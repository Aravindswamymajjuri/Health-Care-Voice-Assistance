#!/usr/bin/env python3
"""
Automated Gemini API Setup Script

This script helps you quickly configure and test your Gemini API setup.
Run it once to set up everything.

Usage:
    python setup_gemini.py
"""

import os
import sys
import subprocess
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text):
    """Print colored header"""
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}{Colors.BOLD}{text:^60}{Colors.END}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}→ {text}{Colors.END}")

def get_api_key():
    """Get API key from user"""
    print_info("Get your API key from: https://aistudio.google.com/app/apikeys\n")
    
    api_key = input(f"{Colors.BOLD}Paste your API key here: {Colors.END}").strip()
    
    if not api_key:
        print_error("API key cannot be empty!")
        return None
    
    if len(api_key) < 20:
        print_error("API key seems too short. Check it again.")
        return None
    
    return api_key

def create_env_file(api_key):
    """Create or update .env file"""
    env_path = Path(".env")
    
    env_content = f"""# Gemini API Configuration
GEMINI_API_KEY={api_key}
GEMINI_MODEL=gemini-1.5-flash

# Application Settings
DEBUG=true
"""
    
    try:
        env_path.write_text(env_content)
        print_success(f"Created .env file")
        
        # Make sure .env is in .gitignore
        gitignore_path = Path(".gitignore")
        if gitignore_path.exists():
            content = gitignore_path.read_text()
            if ".env" not in content:
                with open(gitignore_path, "a") as f:
                    f.write("\n.env\n")
                print_success("Added .env to .gitignore")
        else:
            gitignore_path.write_text(".env\n")
            print_success("Created .gitignore with .env")
        
        return True
    except Exception as e:
        print_error(f"Failed to create .env: {e}")
        return False

def check_env():
    """Check if environment variables are set"""
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    print_info(f"GEMINI_API_KEY: {'Set ✓' if api_key else 'Not set ✗'}")
    print_info(f"GEMINI_MODEL: {model}")
    
    return bool(api_key)

def run_test():
    """Run the test script"""
    print_info("Running test script...")
    
    try:
        result = subprocess.run(
            [sys.executable, "test_gemini.py"],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print_error("Test timed out")
        return False
    except FileNotFoundError:
        print_error("test_gemini.py not found. Run this script from Backend directory.")
        return False
    except Exception as e:
        print_error(f"Test failed: {e}")
        return False

def install_dependencies():
    """Install required packages"""
    print_info("Checking dependencies...")
    
    try:
        import httpx
        import dotenv
        print_success("All dependencies installed")
        return True
    except ImportError:
        print_warning("Installing missing dependencies...")
        try:
            subprocess.run(
                [sys.executable, "-m", "pip", "install", "httpx", "python-dotenv"],
                capture_output=True,
                check=True
            )
            print_success("Dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print_error(f"Failed to install dependencies: {e}")
            return False

def main():
    """Main setup flow"""
    
    print_header("GEMINI API SETUP WIZARD")
    
    # Step 1: Check Python version
    print_info(f"Python: {sys.version.split()[0]}")
    if sys.version_info < (3, 8):
        print_error("Python 3.8+ required")
        return 1
    print_success("Python version OK\n")
    
    # Step 2: Check working directory
    if not Path("gemini_integration.py").exists():
        print_error("Please run this script from the Backend directory")
        return 1
    print_success("In correct directory (Backend/)\n")
    
    # Step 3: Install dependencies
    print_header("STEP 1: Install Dependencies")
    if not install_dependencies():
        return 1
    
    # Step 4: Get API key from user
    print_header("STEP 2: Configure API Key")
    
    existing_key = os.getenv("GEMINI_API_KEY")
    if existing_key:
        print_info(f"Found existing key (length: {len(existing_key)} chars)")
        use_existing = input("Use existing key? (y/n): ").lower()
        if use_existing == "y":
            api_key = existing_key
        else:
            api_key = get_api_key()
            if not api_key:
                return 1
    else:
        api_key = get_api_key()
        if not api_key:
            return 1
    
    # Step 5: Create .env file
    print_header("STEP 3: Create Configuration")
    if not create_env_file(api_key):
        return 1
    
    # Step 6: Verify environment
    print_header("STEP 4: Verify Environment")
    if not check_env():
        print_warning("Environment variables not loaded. Restarting with .env...")
        from dotenv import load_dotenv
        load_dotenv()
        check_env()
    
    # Step 7: Run tests
    print_header("STEP 5: Running Tests")
    if not run_test():
        print_warning("Some tests failed. Check configuration.")
        print_info("Run 'python test_gemini.py' for more details")
        return 1
    
    # Success!
    print_header("✓ SETUP COMPLETE!")
    
    print(f"""
{Colors.GREEN}{Colors.BOLD}Your Gemini API is now configured!{Colors.END}

{Colors.BOLD}Next Steps:{Colors.END}

1. {Colors.BOLD}Start FastAPI server:{Colors.END}
   uvicorn app:app --reload

2. {Colors.BOLD}Test the endpoint:{Colors.END}
   curl -X POST "http://localhost:8000/api/generate/tips"

3. {Colors.BOLD}View documentation:{Colors.END}
   - GEMINI_SETUP_GUIDE.md
   - IMPLEMENTATION_GUIDE.md
   - QUICK_REFERENCE.md

{Colors.GREEN}{Colors.BOLD}Happy coding! 🚀{Colors.END}
""")
    
    return 0

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\nSetup cancelled.")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)
