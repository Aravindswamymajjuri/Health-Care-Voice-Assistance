# ProTipsCarousel - CSS Styling Reference

## Overview

The component uses a comprehensive CSS system with:
- CSS Variables for easy customization
- Responsive media queries for all screen sizes
- Smooth transitions and animations
- Accessibility features (high contrast, reduced motion, dark mode)
- Plain CSS (no preprocessors required)

**File:** `ProTipsCarousel.css`
**Size:** ~600 lines
**Structure:** Variables → Base → Components → Media Queries → Accessibility

---

## CSS Variables

All customizable values are set as CSS variables at the root level:

### Color Palette

#### Neutral Colors
```css
--color-white: #ffffff;
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-900: #111827;
```

#### Risk Level - Low (Green)
```css
--color-risk-low-light: #f0fdf4;      /* Very light background */
--color-risk-low-border: #dcfce7;     /* Border color */
--color-risk-low-badge: #86efac;      /* Badge background */
--color-risk-low-text: #166534;       /* Text color */
```

#### Risk Level - Medium (Amber)
```css
--color-risk-medium-light: #fffbeb;   /* Very light background */
--color-risk-medium-border: #fef3c7;  /* Border color */
--color-risk-medium-badge: #fde047;   /* Badge background */
--color-risk-medium-text: #7c2d12;    /* Text color */
```

#### Risk Level - High (Red)
```css
--color-risk-high-light: #fef2f2;     /* Very light background */
--color-risk-high-border: #fee2e2;    /* Border color */
--color-risk-high-badge: #fca5a5;     /* Badge background */
--color-risk-high-text: #7f1d1d;      /* Text color */
```

#### Category Gradients
```css
--color-tip-bg: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
--color-tip-border: #dcfce7;
--color-tip-badge: #16a34a;

--color-precaution-bg: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
--color-precaution-border: #fef08a;
--color-precaution-badge: #d97706;
```

### Spacing Scale

```css
--spacing-xs: 4px;      /* Very small: margins between elements */
--spacing-sm: 8px;      /* Small: gaps between tabs, dots */
--spacing-md: 12px;     /* Medium: padding inside buttons */
--spacing-lg: 16px;     /* Large: padding in carousel, margins */
--spacing-xl: 20px;     /* Extra large: padding in slide content */
--spacing-2xl: 24px;    /* 2x large: header padding */
--spacing-3xl: 32px;    /* 3x large: carousel internal padding */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);     /* Subtle */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);   /* Medium */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* Large */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1); /* Extra large */
```

### Border Radius

```css
--border-radius-md: 8px;    /* Small buttons, badges */
--border-radius-lg: 12px;   /* Larger elements */
--border-radius-xl: 16px;   /* Main container */
```

### Transitions

```css
--transition-fast: 150ms ease-in-out;   /* Quick interactions */
--transition-base: 300ms ease-in-out;   /* Standard animations */
--transition-slow: 500ms ease-in-out;   /* Entrance animations */
```

---

## CSS Classes & Components

### `.carousel-wrapper`
**Purpose:** Outer container for entire component
**Styling:**
```css
width: 100%;
max-width: 900px;
margin: 0 auto;
padding: var(--spacing-lg);
```
**Customization:** Change `max-width` to make component narrower/wider

### `.carousel-header`
**Purpose:** Top section with title and risk badge
**Styling:**
```css
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-start;
gap: var(--spacing-lg);
margin-bottom: var(--spacing-2xl);
flex-wrap: wrap;
```
**Responsive:** Becomes `flex-direction: column` on mobile

### `.carousel-title`
**Purpose:** Main title "💡 Pro Tips & Precautions"
**Styling:**
```css
font-size: 28px;
font-weight: 700;
color: var(--color-gray-900);
line-height: 1.3;
letter-spacing: -0.5px;
```
**Mobile:** Reduces to `font-size: 20px`

### `.carousel-subtitle`
**Purpose:** Secondary text below title
**Styling:**
```css
font-size: 14px;
color: var(--color-gray-600);
line-height: 1.5;
```

### `.risk-badge`
**Purpose:** Shows risk level (Low/Medium/High)
**Styling:**
```css
display: flex;
align-items: center;
gap: var(--spacing-md);
padding: var(--spacing-md) var(--spacing-lg);
border-radius: var(--border-radius-lg);
font-weight: 600;
font-size: 14px;
transition: transform var(--transition-fast), box-shadow var(--transition-fast);
```
**Hover:** `transform: translateY(-2px); box-shadow: var(--shadow-md);`

**Variants:**
- `.risk-low` - Green background
- `.risk-medium` - Amber background
- `.risk-high` - Red background

### `.tab-nav-container`
**Purpose:** Container for Tips/Precautions tabs
**Styling:**
```css
display: flex;
gap: var(--spacing-md);
margin-bottom: var(--spacing-2xl);
border-bottom: 2px solid var(--color-gray-200);
padding-bottom: var(--spacing-md);
```

### `.tab-button`
**Purpose:** Individual tab button
**Styling:**
```css
display: flex;
align-items: center;
gap: var(--spacing-sm);
padding: var(--spacing-md) var(--spacing-lg);
border: none;
background: transparent;
font-size: 15px;
font-weight: 600;
color: var(--color-gray-600);
cursor: pointer;
position: relative;
transition: color var(--transition-base);
```
**Hover:** `color: var(--color-gray-900);`

**Active State (.tab-active):**
```css
color: var(--color-gray-900);
```
With `::after` pseudo-element:
```css
content: '';
position: absolute;
bottom: -11px;
left: var(--spacing-md);
right: var(--spacing-md);
height: 3px;
background: linear-gradient(90deg, var(--color-tip-badge), var(--color-precaution-badge));
border-radius: 2px;
animation: slideIn var(--transition-base) ease-out;
```

### `.carousel-container`
**Purpose:** Main carousel box
**Styling:**
```css
position: relative;
display: flex;
align-items: center;
justify-content: center;
background: white;
border-radius: var(--border-radius-xl);
border: 2px solid var(--color-gray-200);
min-height: 280px;
overflow: hidden;
box-shadow: var(--shadow-lg);
transition: box-shadow var(--transition-fast), border-color var(--transition-base);
```

**Variants by Category:**
- `.carousel-tips` - Green theme
- `.carousel-precautions` - Amber theme

### `.carousel-slide`
**Purpose:** Content area with text and emoji
**Styling:**
```css
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: var(--spacing-lg);
padding: var(--spacing-3xl) var(--spacing-2xl);
width: 100%;
min-height: 280px;
text-align: center;
animation: slideEnter var(--transition-base) ease-out;
```

**Animation - slideEnter:**
```css
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

### `.slide-icon`
**Purpose:** Emoji display
**Styling:**
```css
font-size: 48px;
line-height: 1;
animation: bounceIn var(--transition-base) ease-out;
```

**Animation - bounceIn:**
```css
@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### `.slide-text`
**Purpose:** Main content text
**Styling:**
```css
font-size: 18px;
font-weight: 500;
color: var(--color-gray-900);
line-height: 1.6;
letter-spacing: 0.2px;
```

### `.slide-badge`
**Purpose:** TIP or CAUTION indicator
**Styling:**
```css
display: inline-block;
padding: var(--spacing-sm) var(--spacing-lg);
background: var(--color-gray-100);
border-radius: var(--border-radius-md);
font-size: 12px;
font-weight: 700;
color: var(--color-gray-700);
text-transform: uppercase;
letter-spacing: 1px;
```

**Category Variants:**
- `.carousel-tips .slide-badge` - Green styling
- `.carousel-precautions .slide-badge` - Amber styling

### `.carousel-btn`
**Purpose:** Previous/Next navigation buttons
**Styling:**
```css
position: absolute;
top: 50%;
transform: translateY(-50%);
width: 48px;
height: 48px;
border: 2px solid var(--color-gray-300);
background: white;
color: var(--color-gray-700);
font-size: 24px;
font-weight: 300;
border-radius: var(--border-radius-md);
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
transition: all var(--transition-base);
z-index: 10;
outline: none;
```

**Hover:**
```css
background: var(--color-gray-900);
color: white;
border-color: var(--color-gray-900);
transform: translateY(-50%) scale(1.05);
box-shadow: var(--shadow-md);
```

**Disabled:**
```css
opacity: 0.5;
cursor: not-allowed;
```

**Variants:**
- `.carousel-btn-prev` - Left side (left: var(--spacing-lg))
- `.carousel-btn-next` - Right side (right: var(--spacing-lg))

### `.pagination-dots`
**Purpose:** Container for slide indicator dots
**Styling:**
```css
display: flex;
gap: var(--spacing-sm);
align-items: center;
```

### `.dot`
**Purpose:** Individual pagination dot
**Styling:**
```css
width: 10px;
height: 10px;
border: none;
border-radius: 50%;
background: var(--color-gray-300);
cursor: pointer;
transition: all var(--transition-base);
outline: none;
padding: 0;
```

**Hover:** `background: var(--color-gray-400); transform: scale(1.2);`

**Active (.dot-active):**
```css
background: linear-gradient(135deg, var(--color-tip-badge), var(--color-precaution-badge));
width: 12px;
height: 12px;
transform: scale(1.2);
```

### `.refresh-button`
**Purpose:** Refresh button
**Styling:**
```css
padding: var(--spacing-md) var(--spacing-lg);
background: var(--color-tip-badge);
color: white;
border: none;
border-radius: var(--border-radius-md);
font-size: 14px;
font-weight: 600;
cursor: pointer;
transition: all var(--transition-base);
outline: none;
```

**Hover:** `filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-md);`

---

## Animations Reference

### `slideEnter` - Slide entrance
```css
Duration: 300ms
Easing: ease-out
Effect: Fade in + slide up
```

### `bounceIn` - Icon entrance
```css
Duration: 300ms
Easing: ease-out
Effect: Scale bounce animation
```

### `slideIn` - Tab underline animation
```css
Duration: 300ms
Easing: ease-out
Effect: Slide in from left
```

---

## Responsive Design

### Desktop (> 768px)
- Full size fonts and spacing
- Hover effects enabled
- Optimal readability width
- Standard animations

### Tablet (480px - 768px)
```css
@media (max-width: 768px) {
  /* Reduced font sizes */
  Title: 24px (was 28px)
  Text: 16px (was 18px)
  
  /* Adjusted spacing */
  Padding: var(--spacing-lg) (was var(--spacing-2xl))
  
  /* Smaller buttons */
  Button size: 44px (was 48px)
}
```

### Mobile (< 480px)
```css
@media (max-width: 480px) {
  /* Small fonts */
  Title: 20px (was 24px)
  Text: 15px (was 16px)
  
  /* Compact layout */
  Hide tab counts
  Reduce gaps
  Full-width refresh button
  
  /* Smaller interactive elements */
  Button size: 40px
  Dot size: 8px (was 10px)
}
```

---

## Accessibility Features

### High Contrast Mode
```css
@media (prefers-contrast: more) {
  /* Thicker borders and underlines */
  --border-width: 3px;
  --underline-height: 4px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
```

### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  /* Inverted colors for dark backgrounds */
  --color-white: #1f2937;
  --color-gray-900: #f9fafb;
  --color-gray-600: #d1d5db;
  /* ... etc */
}
```

---

## Common Customizations

### Change Primary Color Theme

```css
/* Original (green) */
--color-tip-badge: #16a34a;

/* Custom example (blue) */
:root {
  --color-tip-badge: #3b82f6;
  --color-tip-bg: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  --color-tip-border: #bfdbfe;
}
```

### Make Component Narrower

```css
.carousel-wrapper {
  max-width: 700px; /* Reduce from 900px */
}
```

### Increase Font Sizes

```css
.carousel-title {
  font-size: 32px; /* Increase from 28px */
}

.slide-text {
  font-size: 20px; /* Increase from 18px */
}
```

### Change Animation Speed

```css
:root {
  --transition-base: 500ms ease-in-out; /* Slower from 300ms */
}
```

### Remove Rounded Corners

```css
:root {
  --border-radius-md: 0px;
  --border-radius-lg: 0px;
  --border-radius-xl: 0px;
}
```

---

## Performance Considerations

### CSS Optimization
- CSS variables allow instant theme changes without browser reflow
- Smooth transitions use `ease-in-out` for 60fps animations
- Hardware acceleration through `transform` properties
- Minimal `box-shadow` use (only on hover/active states)

### Animation Performance
```css
/* Good - GPU accelerated */
transform: translateY(-2px);
opacity: 0.8;

/* Avoid - CPU intensive */
top: -2px;
left: 0;
width: 100%;
position: relative;
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |
| Animations | ✅ | ✅ | ✅ | ✅ |
| Grid/Flexbox | ✅ | ✅ | ✅ | ✅ |
| Media Queries | ✅ | ✅ | ✅ | ✅ |

All target browsers fully support the CSS used.

---

## File Size

- **Unminified:** ~600 lines
- **Minified:** ~12KB
- **Gzipped:** ~2.5KB

Optimized for fast loading without sacrificing functionality.

---

## Debugging CSS

### Check Active Styles
```javascript
// In DevTools Console
const elem = document.querySelector('.carousel-container');
console.log(window.getComputedStyle(elem));
```

### Inspect Variables
```javascript
const style = getComputedStyle(document.documentElement);
console.log(style.getPropertyValue('--color-tip-badge'));
```

### Animation Performance
- DevTools → Performance → Record
- Look for smooth 60fps animation
- CSS animations should not cause layout thrashing

---

## Best Practices

✅ **DO:**
- Use CSS variables for consistent theming
- Test responsive behavior at actual screen sizes
- Use `transform` and `opacity` for animations
- Keep specificity low (avoid deep nesting)
- Use browser DevTools to inspect computed styles

❌ **DON'T:**
- Override variables inline (use CSS files)
- Use `!important` for overrides (causes issues)
- Add animations that cause layout shifts
- Change core structure through CSS
- Forget to test on real devices

---

## References

- **W3C:** https://www.w3.org/Style/CSS/
- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS
- **Can I Use:** https://caniuse.com/
- **CSS Tricks:** https://css-tricks.com/

