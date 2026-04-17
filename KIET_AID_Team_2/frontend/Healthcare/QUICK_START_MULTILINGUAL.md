# Multi-Language Quick Start Guide

## 🚀 30-Second Setup

### Step 1: Import Hook (1 line)
```jsx
import { useLanguage } from '../context/LanguageContext';
```

### Step 2: Use Hook (1 line)
```jsx
const { t } = useLanguage();
```

### Step 3: Replace Strings (everywhere)
```jsx
// Before
<button>Send</button>

// After
<button>{t('sendMessage')}</button>
```

### Step 4: Done! ✅

---

## Current Translation Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Login.jsx** | ✅ Complete | All fields translated |
| **Signup.jsx** | ✅ Complete | All 4 steps translated |
| **LanguageProvider** | ✅ Complete | Global state management |
| **LanguageSelector** | ✅ Complete | Dropdown in auth pages |
| **Home.jsx** | ❌ TODO | Hero + Features |
| **HealthcareChatbot.jsx** | ❌ TODO | Main chat interface |
| **Profile.jsx** | ❌ TODO | User profile page |
| **Footer.jsx** | ❌ TODO | Footer links |
| **ProTipsCarousel.jsx** | ❌ TODO | Tips carousel |
| **EmergencySOS.jsx** | ❌ TODO | Emergency feature |
| **HealthDashboard.jsx** | ❌ TODO | Dashboard page |

---

## How It Works

```
App.jsx (Wrapped with LanguageProvider)
  ↓
  Your Component
    ↓
    const { t } = useLanguage()
      ↓
      t('key') → Returns translated string
        ↓
        Text displays in current language
          ↓
          User picks new language
            ↓
            All components re-render with new language ✨
```

---

## Most Used Keys

### Authentication
```javascript
t('username')        // Username
t('password')        // Password
t('email')          // Email
t('login')          // Sign in
t('signup')         // Create account
t('register')       // Register
t('fullName')       // Full name
t('age')            // Age
t('gender')         // Gender
t('forgotPassword') // Forgot password?
```

### Common
```javascript
t('home')           // Home
t('profile')        // Profile
t('logout')         // Log out
t('settings')       // Settings
t('save')           // Save
t('cancel')         // Cancel
t('loading')        // Loading...
```

### Actions
```javascript
t('sendMessage')    // Send message
t('back')          // Back
t('next')          // Next
t('previousItem')  // Previous
t('delete')        // Delete
t('edit')          // Edit
```

---

## Adding New Translation Keys

### 1. Open `src/constants/translations.js`

### 2. Add to English section:
```javascript
en: {
  myNewKey: 'English text',
}
```

### 3. Add to Hindi section:
```javascript
hi: {
  myNewKey: 'हिंदी पाठ',
}
```

### 4. Add to Telugu section:
```javascript
te: {
  myNewKey: 'తెలుగు పాఠం',
}
```

### 5. Use in component:
```javascript
const { t } = useLanguage();
return <p>{t('myNewKey')}</p>;
```

---

## Common Patterns

### Button with Translation
```jsx
<button onClick={handleClick}>
  {t('buttonLabel')}
</button>
```

### Input with Translation
```jsx
<input
  placeholder={t('inputPlaceholder')}
  title={t('inputTooltip')}
/>
```

### Form Label
```jsx
<label>
  {t('fieldLabel')}
  <span style={{ color: 'red' }}>*</span>
</label>
```

### Conditional Text
```jsx
<p>
  {isLoading ? t('loading') : t('complete')}
</p>
```

### List of Options
```jsx
{languages.map(lang => (
  <option key={lang} value={lang}>
    {t(lang === 'en' ? 'english' : lang === 'hi' ? 'hindi' : 'telugu')}
  </option>
))}
```

---

## Debugging

### Check if translation exists:
```javascript
const { t } = useLanguage();
console.log(t('unknownKey')); // Logs: 'unknownKey' (if not found)
```

### Check current language:
```javascript
const { language } = useLanguage();
console.log(language); // Logs: 'en' | 'hi' | 'te'
```

### Force language change:
```javascript
const { changeLanguage } = useLanguage();
changeLanguage('hi'); // Switch to Hindi
```

---

## Testing Each Language

### English
- Set in LanguageSelector dropdown
- Verify all text displays correctly

### Hindi
- Uses Devanagari script
- RTL not needed (Hindi uses LTR)
- Verify spacing and overflow

### Telugu
- Uses Telugu script
- LTR alignment
- Verify font rendering

---

## Files Reference

| File | Purpose | Size |
|------|---------|------|
| `src/constants/translations.js` | All translation strings | ~45 KB |
| `src/context/LanguageContext.jsx` | State management | ~2 KB |
| `src/compontents/LanguageSelector.jsx` | UI Component | ~1 KB |
| `src/compontents/LanguageSelector.css` | Styling | ~2 KB |

---

## Next Component to Update: Home.jsx

### Strings to translate:
```javascript
t('welcomeTitle')        // "Welcome to Healthcare Assistant"
t('welcomeSubtitle')     // "Your Personal AI-Powered Health Guide"
t('startChatting')       // "Start Chatting"
t('learnMore')           // "Learn More"
t('yourHealth')          // "Your Health, Our Priority"
t('featureTitle1')       // "AI-Powered Chat"
t('featureDesc1')        // "Ask any health question..."
// ... and more
```

### Steps:
1. Add `import { useLanguage } from '../context/LanguageContext';`
2. Add `const { t } = useLanguage();` at top of component
3. Replace all hardcoded strings with `t('key')`
4. Test in all 3 languages

---

## Tips & Tricks

✅ **Use meaningful keys** - `t('chatPlaceholder')` not `t('field1')`

✅ **Keep translations concise** - Long strings may overflow

✅ **Test all 3 languages** - Some languages need more space

✅ **Use consistent naming** - `sendButton` not `send_button`

✅ **Add missing keys immediately** - Don't use hardcoded fallbacks

---

## Performance

- ⚡ No network round-trips
- ⚡ Instant language switching
- ⚡ Minimal re-renders
- ⚡ ~50 KB total including all 3 languages

---

## Support

Got issues? Check the full guide:
📖 `src/compontents/MULTILINGUAL_GUIDE.md`

---

**Updated:** April 18, 2026  
**Status:** ✅ Ready to Use
