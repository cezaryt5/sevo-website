# SEVO Website

Simat Elkhair Voluntary Organization website with internationalization (i18n) support.

## 🌐 Live Site

**URL**: https://sevo.org

## 📁 Project Structure

```
sevo-website/
├── index.html          # Homepage with i18n support
├── about.html          # About page with i18n support
├── contact.html        # Contact & Donate page with i18n support
├── impact.html         # Impact page with i18n support
├── transparency.html   # Transparency page with i18n support
├── css/
│   └── i18n.css        # RTL support and language switcher styles
├── js/
│   ├── i18n.js         # Core internationalization system
│   ├── components.js   # Shared UI components (language switcher)
│   └── translations/
│       ├── en.json     # English translations
│       └── ar.json     # Arabic translations
├── hero-image.jpeg     # Hero image asset
└── logo.png            # Logo asset
```

## 🌍 Internationalization (i18n)

This website features a **zero-dependency** internationalization system that supports English and Arabic with full RTL (Right-to-Left) layout support.

### Features

- ✅ **Zero build step** - Pure vanilla JavaScript
- ✅ **Zero dependencies** - No external libraries required
- ✅ **Automatic language detection** - Detects browser language on first visit
- ✅ **Language persistence** - Saves user preference to localStorage
- ✅ **RTL support** - Full Arabic layout with text direction switching
- ✅ **Accessibility** - Skip links, ARIA labels, keyboard navigation
- ✅ **SEO friendly** - Proper lang and dir attributes

### Supported Languages

| Language | Code | Direction |
|----------|------|-----------|
| English  | `en` | LTR (Left-to-Right) |
| Arabic   | `ar` | RTL (Right-to-Left) |

### How to Use

#### For Visitors

1. **Language Switcher**: Click the language buttons (EN/AR) in the navigation bar
2. **Automatic Detection**: The site detects your browser language on first visit
3. **Preference Memory**: Your language choice is saved for future visits

#### For Developers

##### Adding New Translations

1. Open the translation file: `js/translations/[lang].json`
2. Add new key-value pairs:

```json
{
  "home": {
    "new_section": "Your new text here"
  }
}
```

3. Add the corresponding `data-i18n` attribute in HTML:

```html
<p data-i18n="home.new_section">Your new text here</p>
```

##### Adding a New Language

1. Create a new JSON file: `js/translations/[lang-code].json`
2. Copy the structure from `en.json` and translate all values
3. Add the language code to the `supportedLangs` array in `js/i18n.js`:

```javascript
const CONFIG = {
    defaultLang: 'en',
    supportedLangs: ['en', 'ar', 'fr'],  // Add new language
    rtlLangs: ['ar']  // Add if RTL language
};
```

4. Add language name to both translation files:

```json
"lang": {
    "en": "English",
    "ar": "العربية",
    "fr": "Français"
}
```

##### Translation Keys Structure

```
[page].[section].[element]

Examples:
- nav.home           → Navigation "Home" link
- home.hero_title    → Homepage hero heading
- contact.form_name  → Contact form name label
- footer.copyright   → Footer copyright text
```

### RTL (Right-to-Left) Support

The system automatically:
- Sets `dir="rtl"` on the `<html>` element for Arabic
- Flips flexbox and grid layouts
- Adjusts margins and paddings
- Mirrors navigation arrows and icons
- Uses Arabic font optimizations (Noto Sans Arabic)

### Architecture

#### Core Files

| File | Purpose |
|------|---------|
| `js/i18n.js` | Main i18n engine - loads translations, switches languages, handles RTL |
| `js/components.js` | Injects language switcher UI into all pages |
| `css/i18n.css` | RTL styles, language switcher styling, accessibility features |

#### Data Attributes

| Attribute | Purpose |
|-----------|---------|
| `data-i18n` | Main translation key for element text |
| `data-i18n-title` | Translation key for page `<title>` |
| `data-i18n-content` | Translation key for meta description |
| `data-i18n-placeholder` | Translation key for input placeholders |
| `data-i18n-attr` | Specifies which attribute to translate (e.g., "alt", "aria-label") |
| `data-i18n-html` | Allows HTML content in translations |

### API Reference

The i18n system exposes a global API via `window.SEVO.i18n`:

```javascript
// Switch language
SEVO.i18n.switchLanguage('ar');

// Get current language
const lang = SEVO.i18n.getCurrentLang(); // 'en' or 'ar'

// Check if RTL
const isRTL = SEVO.i18n.isRTL(); // true or false

// Translate a key programmatically
const text = SEVO.i18n.t('home.hero_title');

// Format numbers
const formatted = SEVO.i18n.formatNumber(1234567); // "1,234,567" or "١٬٢٣٤٬٥٦٧"

// Format dates
const date = SEVO.i18n.formatDate(new Date()); // Locale-specific date
```

## 🚀 Deployment

This site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Deployment Workflow

1. Edit files locally
2. Commit and push to GitHub
3. GitHub Actions automatically deploys to GitHub Pages
4. Changes are live within minutes

### Adding Content

To add new content without affecting translations:

1. Add the HTML content with a `data-i18n` attribute
2. Add the translation key to both `en.json` and `ar.json`
3. Test in both languages before deploying

## ♿ Accessibility

The i18n system includes accessibility features:

- **Skip links** for keyboard navigation
- **ARIA labels** on language switcher buttons
- **Focus indicators** for keyboard users
- **Reduced motion** support for animations
- **High contrast** mode support

## 🔧 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Contact

For questions about the website or internationalization system, contact the tech team.

---

**SEVO** - Empowering Sudanese Women through Community, Growth, and Hope.
