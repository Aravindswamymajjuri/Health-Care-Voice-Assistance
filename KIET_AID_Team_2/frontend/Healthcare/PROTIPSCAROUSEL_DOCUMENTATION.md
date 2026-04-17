# ProTipsCarousel - Professional Healthcare Carousel Component
## Plain CSS Implementation Guide

---

## Overview

`ProTipsCarousel` is a professional, custom-built React carousel component designed specifically for healthcare applications. It features a modern, clean UI built entirely with plain CSS (no external UI frameworks).

**Key Features:**
- ✅ Dual-category carousel (Tips & Precautions)
- ✅ Risk level badges with color-coded styling (Green/Yellow/Red)
- ✅ Smooth CSS transitions and animations
- ✅ Keyboard navigation (Arrow keys)
- ✅ Touch/swipe support for mobile
- ✅ Auto-play with pause on hover
- ✅ Pagination dots with direct navigation
- ✅ Fully responsive design
- ✅ Healthcare-themed color scheme
- ✅ ARIA labels and accessibility support
- ✅ Plain CSS - no external dependencies (except React)

---

## File Structure

```
src/compontents/features/
├── ProTipsCarousel.jsx              # Main React component
├── ProTipsCarousel.css              # Complete styling
├── ProTipsCarousel.example.jsx      # Usage examples
└── index.js                          # Exports
```

---

## Installation & Setup

### 1. Import the Component

```javascript
import ProTipsCarousel from './features/ProTipsCarousel';
// OR
import { ProTipsCarousel } from './features';
```

### 2. No Additional Dependencies

The component uses only React (built-in). No external UI libraries required.

---

## Component API

### Props

```typescript
interface ProTipsCarouselProps {
  tips?: string[];                   // Array of tip strings
  precautions?: string[];            // Array of precaution strings
  riskLevel?: 'low' | 'medium' | 'high';  // Risk level (default: 'low')
  onRefresh?: () => void;            // Callback when refresh button clicked
  autoPlayInterval?: number;         // Auto-play interval in ms (default: 5000)
}
```

### Prop Details

| Prop | Type | Default | Description |
|---|---|---|---|
| `tips` | `string[]` | `[]` | Array of healthcare tips to display |
| `precautions` | `string[]` | `[]` | Array of precautions/warnings |
| `riskLevel` | `'low' \| 'medium' \| 'high'` | `'low'` | Determines badge color and styling |
| `onRefresh` | `() => void` | `null` | Optional callback for refresh button |
| `autoPlayInterval` | `number` | `5000` | Milliseconds between auto-play slides |

---

## Basic Usage

### Example 1: Simple Tips Display

```javascript
import { ProTipsCarousel } from './features';

function App() {
  const tips = [
    "Drink 8 glasses of water daily.",
    "Get 7-9 hours of sleep each night.",
    "Exercise for 30 minutes daily.",
  ];

  return (
    <ProTipsCarousel 
      tips={tips}
      riskLevel="low"
    />
  );
}
```

### Example 2: With Precautions and Risk Level

```javascript
const tips = [
  "Stay active with regular exercises.",
  "Maintain a healthy diet.",
];

const precautions = [
  "Avoid strenuous activities without medical clearance.",
  "Consult your doctor if symptoms persist.",
];

<ProTipsCarousel 
  tips={tips}
  precautions={precautions}
  riskLevel="medium"
  autoPlayInterval={4000}
/>
```

### Example 3: With Refresh Callback (API Integration)

```javascript
const [tips, setTips] = useState([]);
const [precautions, setPrecautions] = useState([]);

const handleRefresh = async () => {
  const response = await fetch('/api/generate/tips', {
    method: 'POST',
    body: JSON.stringify({ userContext })
  });
  const data = await response.json();
  setTips(data.tips);
  setPrecautions(data.precautions);
};

<ProTipsCarousel 
  tips={tips}
  precautions={precautions}
  onRefresh={handleRefresh}
  riskLevel="high"
/>
```

### Example 4: Minimal Setup

```javascript
<ProTipsCarousel 
  tips={["Tip 1", "Tip 2"]}
/>
```

---

## Risk Level Styling

The component automatically applies color schemes based on risk level:

### Low Risk ✓ (Green)
```css
Badge Color: #86efac (Light Green)
Background: Linear gradient from #f0fdf4 to #ecfdf5
Border: #dcfce7 (Light Green Border)
Text: #166534 (Dark Green)
```

### Medium Risk ⚠ (Amber/Yellow)
```css
Badge Color: #fde047 (Light Yellow)
Background: Linear gradient from #fffbeb to #fef3c7
Border: #fef08a (Light Yellow Border)
Text: #7c2d12 (Dark Orange)
```

### High Risk ! (Red)
```css
Badge Color: #fca5a5 (Light Red)
Background: Linear gradient from #fef2f2 to #fee2e2
Border: #fee2e2 (Light Red Border)
Text: #7f1d1d (Dark Red)
```

---

## Emoji/Icon Assignment

The component automatically assigns relevant emojis based on content keywords:

### Tips Emojis
| Keyword | Emoji | Use Case |
|---|---|---|
| water, hydrat, drink | 💧 | Hydration advice |
| sleep, rest, relaxation | 😴 | Sleep tips |
| eat, food, nutrition, meal | 🍎 | Dietary advice |
| exercise, walk, activity, movement | 🏃 | Activity tips |
| stretch, yoga, meditation | 🧘 | Wellness practices |
| medicine, medication | 💊 | Medical advice |
| (default) | ✓, 💡, 🌟, 👍 | General tips |

### Precautions Emojis
| Keyword | Emoji | Use Case |
|---|---|---|
| avoid, do not, dont, never | 🚫 | Things to avoid |
| warm, cold, temperature | 🌡️ | Temperature warnings |
| check, monitor, test | ✅ | Monitoring advice |
| consult, doctor, medical | 👨‍⚕️ | Medical consultation |
| emergency, urgent, severe | 🚨 | Emergency warnings |
| (default) | ⚠️, 🛑, ⛔, 📋 | General precautions |

**Example:**
```javascript
// These will auto-assign icons
tips = [
  "Drink 8 glasses of water daily",      // Gets 💧 emoji
  "Get 7-9 hours of sleep",             // Gets 😴 emoji
  "Exercise for 30 minutes",            // Gets 🏃 emoji
]

precautions = [
  "Avoid heavy lifting",                 // Gets 🚫 emoji
  "Check blood pressure regularly",      // Gets ✅ emoji
]
```

---

## Navigation & Interaction

### Keyboard Navigation
- **→ Right Arrow:** Go to next slide
- **← Left Arrow:** Go to previous slide
- **Tab:** Focus on interactive elements
- **Enter/Space:** Activate focused buttons

### Mouse/Touch
- **Click Previous/Next buttons:** Navigate between slides
- **Click pagination dots:** Jump to specific slide
- **Click on Tips/Precautions tab:** Switch categories
- **Swipe left/right:** Navigate on touch devices

### Auto-Play Behavior
- Automatically advances to next slide every `autoPlayInterval` ms
- **Pauses on hover** over the carousel
- **Pauses when user interacts** (clicking, keyboard, touch)
- **Resumes after 10 seconds** of inactivity

---

## CSS Styling Architecture

### CSS Variables (Customizable)

The component uses CSS variables for easy customization:

```css
/* Colors */
--color-white: #ffffff;
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-900: #111827;

/* Risk Level Colors */
--color-risk-low-light: #f0fdf4;
--color-risk-low-badge: #86efac;
--color-risk-low-text: #166534;

--color-risk-medium-light: #fffbeb;
--color-risk-medium-badge: #fde047;
--color-risk-medium-text: #7c2d12;

--color-risk-high-light: #fef2f2;
--color-risk-high-badge: #fca5a5;
--color-risk-high-text: #7f1d1d;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-2xl: 24px;
--spacing-3xl: 32px;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Border Radius */
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-xl: 16px;

/* Transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;
```

### Customizing Colors

Override CSS variables in your application's CSS:

```css
:root {
  --color-risk-low-badge: #22c55e;      /* Change green */
  --color-risk-medium-badge: #f59e0b;   /* Change amber */
  --color-risk-high-badge: #ef4444;     /* Change red */
}
```

---

## Layout Structure

```
ProTipsCarousel
├── Header
│   ├── Title: "💡 Pro Tips & Precautions"
│   ├── Subtitle
│   └── Risk Badge (Low/Medium/High)
│
├── Tab Navigation
│   ├── 💡 Tips (count)
│   └── ⚠️ Precautions (count)
│
├── Carousel Container
│   ├── Slide Content
│   │   ├── Emoji Icon
│   │   ├── Text Content
│   │   ├── TIP/CAUTION Badge
│   │   └── Slide Counter
│   ├── Previous Button (‹)
│   └── Next Button (›)
│
└── Footer Controls
    ├── Pagination Dots
    └── Refresh Button (if onRefresh provided)
```

---

## Responsive Design

### Mobile (< 480px)
- Smaller fonts and spacing
- Simplified layout
- Touch-friendly button sizes
- Vertical stacking on small screens

### Tablet (480px - 768px)
- Medium spacing and fonts
- Optimized for portrait and landscape

### Desktop (> 768px)
- Full-size fonts and spacing
- Optimal reading width
- Enhanced hover effects

**Breakpoints:**
```css
@media (max-width: 768px) { /* Tablet and below */ }
@media (max-width: 480px) { /* Mobile */ }
```

---

## Accessibility Features

### ARIA Labels
```javascript
// All interactive elements have descriptive labels
<button aria-label="Previous slide" />
<button aria-label="Next slide" />
<button aria-label="Go to slide X" />
<button aria-label="Show tips" aria-current="page" />
```

### Keyboard Navigation
- Full keyboard support for all interactive elements
- Logical tab order
- Focus indicators on all buttons
- Shortcut documentation

### Screen Reader Support
- Semantic HTML elements
- Descriptive ARIA labels
- Current slide indicator
- Tab counter information

### Accessibility Features in CSS
```css
@media (prefers-contrast: more) {
  /* High contrast mode support */
}

@media (prefers-reduced-motion: reduce) {
  /* Reduced motion support */
}

@media (prefers-color-scheme: dark) {
  /* Dark mode support */
}
```

---

## Animation Details

### Slide Transition
```css
/* 300ms smooth fade and slide in */
animation: slideEnter 300ms ease-out;

@keyframes slideEnter {
  from {
    opacity: 0.8;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Icon Animation
```css
/* Bouncy entrance for emoji */
animation: bounceIn 300ms ease-out;

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
```

### Hover Effects
- Buttons: Scale up, change background
- Risk badge: Lift with shadow
- Navigation buttons: Transform and shadow changes

---

## Common Integration Patterns

### Pattern 1: With HealthcareChatbot

```javascript
import { HealthcareChatbot } from './HealthcareChatbot';
import { ProTipsCarousel } from './features';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [tips, setTips] = useState([]);
  const [precautions, setPrecautions] = useState([]);
  const [riskLevel, setRiskLevel] = useState('low');

  const handleRefresh = async () => {
    const res = await fetch('/api/generate/tips', {
      method: 'POST',
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    setTips(data.tips);
    setPrecautions(data.precautions);
    setRiskLevel(data.riskLevel);
  };

  return (
    <div>
      <ProTipsCarousel 
        tips={tips}
        precautions={precautions}
        riskLevel={riskLevel}
        onRefresh={handleRefresh}
      />
      <HealthcareChatbot />
    </div>
  );
}
```

### Pattern 2: Conditional Rendering

```javascript
{tips.length > 0 && (
  <ProTipsCarousel 
    tips={tips}
    precautions={precautions}
    riskLevel={riskLevel}
  />
)}
```

### Pattern 3: Multiple Instances

```javascript
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
  <ProTipsCarousel tips={morningTips} riskLevel="low" />
  <ProTipsCarousel tips={eveningTips} riskLevel="medium" />
</div>
```

### Pattern 4: With Error Handling

```javascript
const [error, setError] = useState(null);

const handleRefresh = async () => {
  try {
    const res = await fetch('/api/generate/tips');
    if (!res.ok) throw new Error('Failed to fetch tips');
    const data = await res.json();
    setTips(data.tips);
  } catch (err) {
    setError('Failed to refresh tips. Please try again.');
  }
};
```

---

## Performance Optimization

### React.memo (Prevent Unnecessary Re-renders)
```javascript
const MemoCarousel = React.memo(ProTipsCarousel);
```

### useCallback (Optimize Callbacks)
```javascript
const handleRefresh = useCallback(async () => {
  // Fetch logic
}, [dependencies]);
```

### Lazy Loading
```javascript
const ProTipsCarousel = React.lazy(() => 
  import('./features/ProTipsCarousel')
);
```

---

## Browser Support

| Browser | Version | Support |
|---|---|---|
| Chrome | Latest | ✅ Full support |
| Firefox | Latest | ✅ Full support |
| Safari | Latest | ✅ Full support |
| Edge | Latest | ✅ Full support |
| Mobile Safari | iOS 13+ | ✅ Full support |
| Chrome Mobile | Android | ✅ Full support |

---

## Troubleshooting

### Issue: Styles not applying

**Solution:** Ensure `ProTipsCarousel.css` is imported in `ProTipsCarousel.jsx` at the top:
```javascript
import './ProTipsCarousel.css';
```

### Issue: Auto-play not working

**Solution:** Check that:
- Array has more than 1 item
- `autoPlayInterval` is > 0
- Component is not being unmounted

### Issue: Keyboard navigation not working

**Solution:** Ensure component has focus and browser is not blocking keyboard events.

### Issue: Mobile layout broken

**Solution:** 
- Test viewport width < 480px
- Check for CSS media query conflicts
- Clear browser cache

### Issue: Emojis not displaying

**Solution:** Use a comprehensive emoji font:
```css
body {
  font-family: 'Segoe UI', 'Apple Color Emoji', ...;
}
```

### Issue: Touch swipe not working

**Solution:** 
- Verify touch event handlers exist
- Check for CSS `touch-action: auto`
- Test on actual touch device

---

## Best Practices

✅ **DO:**
- Keep tips concise and actionable
- Test on actual mobile devices
- Use appropriate risk levels
- Provide refresh callbacks for API integration
- Test keyboard navigation
- Use semantic HTML

❌ **DON'T:**
- Use overly long tip text (>200 characters)
- Mix tips and precautions in the same array
- Forget to test responsiveness
- Ignore accessibility requirements
- Set very short auto-play intervals (< 2000ms)

---

## CSS Class Reference

### Main Classes
```css
.carousel-wrapper           /* Outer container */
.carousel-header           /* Header section */
.carousel-title            /* Main title */
.carousel-subtitle         /* Subtitle text */
.risk-badge               /* Risk level badge */
.tab-nav-container        /* Tab navigation */
.tab-button               /* Individual tab */
.tab-active               /* Active tab state */
.carousel-container       /* Carousel main box */
.carousel-slide           /* Slide content */
.slide-icon               /* Emoji icon */
.slide-text               /* Main text */
.slide-badge              /* TIP/CAUTION badge */
.slide-counter            /* Slide counter */
.carousel-btn             /* Navigation buttons */
.carousel-btn-prev        /* Previous button */
.carousel-btn-next        /* Next button */
.carousel-footer          /* Footer section */
.pagination-dots          /* Dot indicators */
.dot                      /* Individual dot */
.dot-active               /* Active dot */
.refresh-button           /* Refresh button */
```

---

## Support & Examples

📁 **Example File:** `ProTipsCarousel.example.jsx`
- Contains 8 different usage examples
- Standalone demo
- Risk level variations
- API integration pattern
- Dynamic data handling

📄 **Documentation:** This file

🎨 **CSS File:** `ProTipsCarousel.css`
- Complete styling (600+ lines)
- CSS variables for easy customization
- Responsive design
- Accessibility support
- Dark mode support

---

## Next Steps

1. **Install & Import:**
   ```javascript
   import { ProTipsCarousel } from './features';
   ```

2. **Use in Component:**
   ```javascript
   <ProTipsCarousel 
     tips={tipsArray}
     precautions={precautionsArray}
     riskLevel="medium"
     onRefresh={handleRefresh}
   />
   ```

3. **Test:**
   - Keyboard navigation (Arrow keys)
   - Mobile responsiveness
   - Different risk levels
   - Tab switching
   - Refresh functionality

4. **Customize:**
   - Adjust CSS variables for colors
   - Modify emoji assignments
   - Change animation speeds
   - Update spacing

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2026-04-18 | Initial release with full plain CSS support |

---

## File Locations

```
project-root/
├── Frontend/
│   └── Healthcare/
│       └── src/
│           └── compontents/
│               └── features/
│                   ├── ProTipsCarousel.jsx
│                   ├── ProTipsCarousel.css
│                   ├── ProTipsCarousel.example.jsx
│                   └── index.js (exports)
```

---

## License

Part of KIET AID Healthcare Chatbot Project

---

## Questions or Issues?

Refer to the example file for usage patterns or check the troubleshooting section above.
