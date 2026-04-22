"""Email utilities for sending emergency notifications and OTP emails.

This module supports two modes:
- FastAPI-Mail (`EMAIL_BACKEND=fastapi_mail`) — preferred async sender.
- SMTP fallback (`EMAIL_BACKEND=smtp`) — uses smtplib directly.

Environment variables (set in .env):
    EMAIL_BACKEND          = fastapi_mail   # or 'smtp'
    FASTAPI_MAIL_SERVER    = smtp.gmail.com
    FASTAPI_MAIL_PORT      = 587
    FASTAPI_MAIL_USERNAME  = you@gmail.com
    FASTAPI_MAIL_PASSWORD  = <app-password>
    FASTAPI_MAIL_FROM      = you@gmail.com
    FASTAPI_MAIL_TLS       = true
    FASTAPI_MAIL_SSL       = false

SMTP fallback (kept for backward compatibility):
    EMERGENCY_SMTP_HOST
    EMERGENCY_SMTP_PORT
    EMERGENCY_SMTP_USER
    EMERGENCY_SMTP_PASS
    EMERGENCY_FROM_EMAIL
"""
import os
import asyncio
from pathlib import Path
from typing import Optional

# ── Load .env FIRST so every os.getenv() below picks up the values ────────────
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / '.env', override=False)
except Exception:
    pass  # python-dotenv not installed; rely on env vars being set externally

# ── Lazy helpers — always read from os.environ, never from stale module vars ──

def _get(key: str, default: str = '') -> str:
    return os.getenv(key) or default

def _get_bool(key: str, default: bool = False) -> bool:
    val = os.getenv(key, '')
    if not val:
        return default
    return val.strip().lower() in ('1', 'true', 'yes')

# ── Module-level constants (used by app.py for diagnostic logging) ────────────
# Values are read *after* load_dotenv(), so they are correct at import time.
EMAIL_BACKEND       = _get('EMAIL_BACKEND', 'fastapi_mail')
FASTAPI_MAIL_SERVER = _get('FASTAPI_MAIL_SERVER')
FASTAPI_MAIL_PORT   = int(os.getenv('FASTAPI_MAIL_PORT') or 587)
FASTAPI_MAIL_USERNAME = _get('FASTAPI_MAIL_USERNAME')
FASTAPI_MAIL_PASSWORD = _get('FASTAPI_MAIL_PASSWORD')
FASTAPI_MAIL_FROM   = _get('FASTAPI_MAIL_FROM') or FASTAPI_MAIL_USERNAME
FASTAPI_MAIL_TLS    = _get_bool('FASTAPI_MAIL_TLS', True)
FASTAPI_MAIL_SSL    = _get_bool('FASTAPI_MAIL_SSL', False)

# Backward-compatible SMTP constants
SMTP_HOST  = _get('EMERGENCY_SMTP_HOST')
SMTP_PORT  = int(os.getenv('EMERGENCY_SMTP_PORT') or 587)
SMTP_USER  = _get('EMERGENCY_SMTP_USER')
SMTP_PASS  = _get('EMERGENCY_SMTP_PASS')
FROM_EMAIL = _get('EMERGENCY_FROM_EMAIL') or SMTP_USER

# ── Optional fastapi_mail dependency ──────────────────────────────────────────
_fastapi_mail_available = False
try:
    from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
    _fastapi_mail_available = True
except Exception:
    pass


# ─────────────────────────────────────────────────────────────────────────────
# Public helpers
# ─────────────────────────────────────────────────────────────────────────────

def is_email_configured() -> bool:
    """Return True if at least one email backend is properly configured."""
    backend = _get('EMAIL_BACKEND', 'fastapi_mail')
    if backend == 'fastapi_mail' and _fastapi_mail_available:
        return bool(
            _get('FASTAPI_MAIL_SERVER') and
            _get('FASTAPI_MAIL_USERNAME') and
            _get('FASTAPI_MAIL_PASSWORD') and
            (_get('FASTAPI_MAIL_FROM') or _get('FASTAPI_MAIL_USERNAME'))
        )
    # SMTP fallback
    return bool(
        _get('EMERGENCY_SMTP_HOST') and
        _get('EMERGENCY_SMTP_USER') and
        _get('EMERGENCY_SMTP_PASS')
    )


# ─────────────────────────────────────────────────────────────────────────────
# Internal async FastMail sender
# ─────────────────────────────────────────────────────────────────────────────

async def _async_send_fastmail(
    to_email: str,
    subject: str,
    body_text: str,
    body_html: Optional[str] = None,
) -> None:
    """Send email using the FastMail async client."""
    if not _fastapi_mail_available:
        raise RuntimeError('fastapi_mail package is not installed')

    # Re-read config at send-time so .env is always used
    config = ConnectionConfig(
        MAIL_USERNAME  = _get('FASTAPI_MAIL_USERNAME'),
        MAIL_PASSWORD  = _get('FASTAPI_MAIL_PASSWORD'),
        MAIL_FROM      = _get('FASTAPI_MAIL_FROM') or _get('FASTAPI_MAIL_USERNAME'),
        MAIL_PORT      = int(os.getenv('FASTAPI_MAIL_PORT') or 587),
        MAIL_SERVER    = _get('FASTAPI_MAIL_SERVER'),
        MAIL_FROM_NAME = _get('FASTAPI_MAIL_FROM') or _get('FASTAPI_MAIL_USERNAME'),
        MAIL_STARTTLS  = _get_bool('FASTAPI_MAIL_TLS', True),
        MAIL_SSL_TLS   = _get_bool('FASTAPI_MAIL_SSL', False),
        USE_CREDENTIALS= True,
        TEMPLATE_FOLDER= None,
    )

    body    = body_html if body_html else body_text
    subtype = 'html'  if body_html else 'plain'
    message = MessageSchema(subject=subject, recipients=[to_email], body=body, subtype=subtype)
    await FastMail(config).send_message(message)


# ─────────────────────────────────────────────────────────────────────────────
# send_emergency_email  — synchronous, used by background tasks in app.py
# ─────────────────────────────────────────────────────────────────────────────

def send_emergency_email(
    to_email: str,
    subject: str,
    body_text: str,
    body_html: Optional[str] = None,
) -> None:
    """Send an emergency email (synchronous wrapper around the configured backend)."""
    backend = _get('EMAIL_BACKEND', 'fastapi_mail')
    server  = _get('FASTAPI_MAIL_SERVER')

    if backend == 'fastapi_mail' and _fastapi_mail_available and server:
        asyncio.run(_async_send_fastmail(to_email, subject, body_text, body_html))
        return

    # ── SMTP fallback ────────────────────────────────────────────────────────
    smtp_host = _get('EMERGENCY_SMTP_HOST')
    smtp_user = _get('EMERGENCY_SMTP_USER')
    smtp_pass = _get('EMERGENCY_SMTP_PASS')
    smtp_port = int(os.getenv('EMERGENCY_SMTP_PORT') or 587)
    from_email = _get('EMERGENCY_FROM_EMAIL') or smtp_user

    if not smtp_host or not smtp_user or not smtp_pass:
        raise RuntimeError('Email not configured: set FASTAPI_MAIL_* or EMERGENCY_SMTP_* env vars')

    from email.message import EmailMessage
    import smtplib

    msg = EmailMessage()
    msg['From']    = from_email
    msg['To']      = to_email
    msg['Subject'] = subject
    msg.set_content(body_text)
    if body_html:
        msg.add_alternative(body_html, subtype='html')

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_user, smtp_pass)
        smtp.send_message(msg)


# ─────────────────────────────────────────────────────────────────────────────
# send_email  — async, used by the OTP / forgot-password flow in app.py
#
# IMPORTANT: This is called with `await` inside a FastAPI async endpoint,
# so it must NOT use asyncio.run() (which fails when an event loop is already
# running). Instead it directly awaits _async_send_fastmail(), and runs the
# SMTP fallback in a thread executor so it doesn't block.
# ─────────────────────────────────────────────────────────────────────────────

async def send_email(email: str, subject: str, body: str) -> bool:
    """Async function for the OTP / forgot-password flow.

    Returns True on success, False on failure.
    Body is sent as HTML when it contains '<', otherwise as plain text.
    """
    import logging as _log
    logger = _log.getLogger(__name__)

    is_html   = '<' in body
    body_text = body if not is_html else ''
    body_html = body if is_html else None

    backend = _get('EMAIL_BACKEND', 'fastapi_mail')
    server  = _get('FASTAPI_MAIL_SERVER')

    # ── FastAPI-Mail path: directly await (no asyncio.run) ───────────────────
    if backend == 'fastapi_mail' and _fastapi_mail_available and server:
        try:
            await _async_send_fastmail(email, subject, body_text, body_html)
            return True
        except Exception as exc:
            logger.error(f'❌ send_email (fastapi_mail) failed: {exc}')
            return False

    # ── SMTP fallback: run in thread executor so we don't block the loop ─────
    smtp_host = _get('EMERGENCY_SMTP_HOST')
    smtp_user = _get('EMERGENCY_SMTP_USER')
    smtp_pass = _get('EMERGENCY_SMTP_PASS')
    smtp_port = int(os.getenv('EMERGENCY_SMTP_PORT') or 587)
    from_email = _get('EMERGENCY_FROM_EMAIL') or smtp_user

    if not smtp_host or not smtp_user or not smtp_pass:
        logger.error('❌ send_email: no email backend configured')
        return False

    def _smtp_send():
        from email.message import EmailMessage
        import smtplib
        msg = EmailMessage()
        msg['From']    = from_email
        msg['To']      = email
        msg['Subject'] = subject
        msg.set_content(body_text)
        if body_html:
            msg.add_alternative(body_html, subtype='html')
        with smtplib.SMTP(smtp_host, smtp_port) as s:
            s.starttls()
            s.login(smtp_user, smtp_pass)
            s.send_message(msg)

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _smtp_send)
        return True
    except Exception as exc:
        logger.error(f'❌ send_email (smtp) failed: {exc}')
        return False

