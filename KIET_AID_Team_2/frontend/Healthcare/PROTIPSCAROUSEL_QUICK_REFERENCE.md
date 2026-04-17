# ProTipsCarousel - Quick Reference Guide

## 🚀 Quick Start (2 minutes)

### 1. Import
```javascript
import { ProTipsCarousel } from './features';
```

### 2. Basic Usage
```javascript
<ProTipsCarousel 
  tips={["Stay hydrated", "Get sleep", "Exercise"]}
  precautions={["Don't skip meals"]}
  riskLevel="low"
/>
```

### 3. Done! 🎉

---

## Component Props

```typescript
<ProTipsCarousel
  tips={string[]}                    // Array of tips
  precautions={string[]}             // Array of precautions
  riskLevel={'low'|'medium'|'high'} // 'low' (default)
  onRefresh={() => void}             // Optional callback
  autoPlayInterval={number}          // 5000ms (default)
/>
```

---

## Risk Levels

| Level | Color | Use When |
|---|---|---|
| `"low"` | 🟢 Green | General wellness advice |
| `"medium"` | 🟡 Amber | Caution recommended |
| `"high"` | 🔴 Red | Medical attention needed |

---

## Examples

### With Refresh Callback
```javascript
const handleRefresh = async () => {
  const res = await fetch('/api/tips');
  const data = await res.json();
  setTips(data.tips);
  setPrecautions(data.precautions);
};

<ProTipsCarousel 
  tips={tips}
  precautions={precautions}
  onRefresh={handleRefresh}
/>
```

### All Props
```javascript
<ProTipsCarousel 
  tips={tipsArray}
  precautions={precautionsArray}
  riskLevel="medium"
  onRefresh={handleRefresh}
  autoPlayInterval={6000}
/>
```

---

## Navigation

| Method | Action |
|---|---|
| **→ Key** | Next slide |
| **← Key** | Previous slide |
| **Click dots** | Jump to slide |
| **Swipe** | Touch navigation |
| **Click buttons** | Next/Previous |
| **Hover** | Pause auto-play |

---

## Auto-Play

- Default: Every 5 seconds
- Pauses on user interaction
- Resumes after 10 seconds of inactivity
- Pauses on hover

**Change interval:**
```javascript
<ProTipsCarousel 
  tips={tips}
  autoPlayInterval={8000}  // 8 seconds
/>
```

---

## Emoji Auto-Assignment

### Tips Emojis
| Keyword | Emoji |
|---|---|
| water, hydrat, drink | 💧 |
| sleep, rest | 😴 |
| eat, food | 🍎 |
| exercise, walk | 🏃 |
| yoga, meditation | 🧘 |
| medicine | 💊 |

### Precautions Emojis
| Keyword | Emoji |
|---|---|
| avoid, never | 🚫 |
| temperature | 🌡️ |
| check, monitor | ✅ |
| doctor, consult | 👨‍⚕️ |
| emergency | 🚨 |

---

## File Structure

```
features/
├── ProTipsCarousel.jsx          ← Main component
├── ProTipsCarousel.css          ← Styling (plain CSS)
├── ProTipsCarousel.example.jsx  ← Usage examples
└── index.js                      ← Exports
```

---

## Common Issues & Fixes

| Issue | Fix |
|---|---|
| Styles not showing | Import `.css` file in `.jsx` |
| Auto-play not working | Array needs 2+ items |
| Keyboard nav fails | Click carousel first for focus |
| Mobile layout broken | Check breakpoints: 480px, 768px |
| Emojis missing | Use emoji-compatible font |

---

## Styles Customization

Override CSS variables:

```css
:root {
  --color-risk-low-badge: #22c55e;    /* Green */
  --color-risk-medium-badge: #f59e0b; /* Amber */
  --color-risk-high-badge: #ef4444;   /* Red */
  --spacing-lg: 16px;
  --transition-base: 300ms ease-in-out;
}
```

---

## Responsive Breakpoints

| Size | Width | Behavior |
|---|---|---|
| **Desktop** | > 768px | Full size, hover effects |
| **Tablet** | 480px - 768px | Optimized spacing |
| **Mobile** | < 480px | Compact layout |

---

## Accessibility

✅ Full keyboard navigation
✅ ARIA labels on all buttons
✅ Screen reader support
✅ High contrast mode support
✅ Reduced motion support
✅ Tab order optimization

---

## Performance

### Prevent Re-renders
```javascript
const MemoCarousel = React.memo(ProTipsCarousel);
```

### Optimize Callbacks
```javascript
const handleRefresh = useCallback(() => {
  // logic
}, [dependencies]);
```

---

## Format Examples

### Good Tip Format
```javascript
tips = [
  "Drink at least 8 glasses of water daily",
  "Get 7-9 hours of sleep each night",
  "Exercise for 30 minutes every day",
]
```

### Good Precautions Format
```javascript
precautions = [
  "Avoid direct sunlight without protection",
  "Do not skip meals",
  "Never ignore persistent symptoms",
]
```

---

## Integration Example

```javascript
import { ProTipsCarousel } from './features';
import { useState, useEffect } from 'react';

export default function HealthcareChatbot() {
  const [tips, setTips] = useState([]);
  const [precautions, setPrecautions] = useState([]);
  const [riskLevel, setRiskLevel] = useState('low');

  useEffect(() => {
    // Fetch tips on mount
    fetchTips();
  }, []);

  const fetchTips = async () => {
    const res = await fetch('/api/generate/tips', {
      method: 'POST',
      body: JSON.stringify({ userContext: {...} })
    });
    const data = await res.json();
    setTips(data.tips);
    setPrecautions(data.precautions);
    setRiskLevel(data.riskLevel);
  };

  return (
    <ProTipsCarousel 
      tips={tips}
      precautions={precautions}
      riskLevel={riskLevel}
      onRefresh={fetchTips}
    />
  );
}
```

---

## CSS Variables (Customization)

### Colors
```css
--color-white: #ffffff;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-600: #4b5563;
--color-gray-900: #111827;

/* Risk Levels */
--color-risk-low-badge: #86efac;
--color-risk-medium-badge: #fde047;
--color-risk-high-badge: #fca5a5;
```

### Spacing
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-2xl: 24px;
--spacing-3xl: 32px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Transitions
```css
--transition-fast: 150ms ease-in-out;
--transition-base: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;
```

---

## Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Related Files

- 📄 `PROTIPSCAROUSEL_DOCUMENTATION.md` - Full documentation
- 📄 `ProTipsCarousel.example.jsx` - Code examples
- 🎨 `ProTipsCarousel.css` - Styling (~600 lines)
- ⚛️ `ProTipsCarousel.jsx` - Component (~400 lines)

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `→` | Next slide |
| `←` | Previous slide |
| `Tab` | Focus element |
| `Enter/Space` | Activate button |

---

## Import Variations

```javascript
// Named import from features
import { ProTipsCarousel } from './features';

// Direct import
import ProTipsCarousel from './features/ProTipsCarousel';

// In JSX
const { ProTipsCarousel } = require('./features');
```

---

## Data Format Checklist

- [ ] `tips` is an array of strings
- [ ] `precautions` is an array of strings
- [ ] Each string is < 200 characters (recommended)
- [ ] `riskLevel` is 'low', 'medium', or 'high'
- [ ] `onRefresh` is a function or undefined
- [ ] `autoPlayInterval` is a number in milliseconds

---

## Troubleshooting Checklist

- [ ] CSS file imported in component
- [ ] Component exported from index.js
- [ ] Props passed correctly
- [ ] Array has at least 1 item
- [ ] Tested on mobile (< 480px width)
- [ ] Keyboard navigation works
- [ ] Emojis display correctly
- [ ] No console errors

---

## Feature Checklist

- ✅ Custom carousel (no external libraries)
- ✅ Plain CSS styling
- ✅ Risk level badges
- ✅ Tab navigation (Tips/Precautions)
- ✅ Auto-play with pause on hover
- ✅ Keyboard navigation (arrow keys)
- ✅ Touch/swipe support
- ✅ Pagination dots
- ✅ Refresh button (optional)
- ✅ Smooth transitions
- ✅ Fully responsive
- ✅ ARIA labels
- ✅ Dark mode support
- ✅ Reduced motion support

---

## Performance Tips

1. Use `React.memo()` to prevent unnecessary re-renders
2. Use `useCallback()` for event handlers
3. Lazy load if not immediately visible
4. Memoize data before passing as props
5. Avoid inline object/array creation

---

## Accessibility Checklist

- ✅ Keyboard navigation works
- ✅ ARIA labels present
- ✅ Focus indicators visible
- ✅ Color contrast sufficient
- ✅ Works with screen readers
- ✅ Reduced motion respected
- ✅ High contrast mode supported

---

## Tips for Best Results

1. **Keep text concise** - Under 100 characters when possible
2. **Use natural language** - Action-oriented, friendly tone
3. **Match risk level** to severity
4. **Test keyboard navigation** - Essential for accessibility
5. **Test mobile view** - Ensure responsive at all sizes
6. **Include refresh callback** - For API integration
7. **Handle errors gracefully** - Empty state handled automatically
8. **Use appropriate intervals** - 4-8 seconds recommended

---

## Support

📚 Full docs: `PROTIPSCAROUSEL_DOCUMENTATION.md`
💡 Examples: `ProTipsCarousel.example.jsx`
🎨 Styles: `ProTipsCarousel.css`

Need help? Check the full documentation or example file.
