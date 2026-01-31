# CLAUDE.md - Woods Mill Bend Website

## Project Overview

This is a static website for Woods Mill Bend, a property rental and artist residency venue. The site is a single-page application (SPA) built with vanilla HTML, CSS, and JavaScript - no frameworks or build tools.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, CSS custom properties
- **Vanilla JavaScript** (ES6+) - No frameworks
- **Formspree** - Form submission backend
- **Google Analytics** - Tracking (gtag.js)

## Directory Structure

```
public_html/
├── index.html          # Redirect to html/main.html
├── css/styles.css      # Main stylesheet (primary)
├── js/scripts.js       # Main JavaScript
├── html/
│   ├── main.html       # Primary SPA page
│   ├── menu.html       # Hamburger menu component (loaded via fetch)
│   ├── property.html   # Standalone property page
│   ├── contact.html    # Standalone contact page
│   ├── photographs.html # Gallery page
│   ├── residency.html  # Artist residency form
│   └── manual.html     # User manual page
├── images/
│   ├── gallery/        # Photo gallery images
│   └── property/       # Building images
└── pdf/                # User manual PDFs
```

## Key Files

- `/html/main.html` - Main SPA with all sections (home, airbnb, property, manual, residency, contact, photos)
- `/css/styles.css` - All styles, organized by section
- `/js/scripts.js` - Modal handlers, gallery navigation, sticky header, password protection

## Code Conventions

### CSS
- Classes: kebab-case (`.gallery-img`, `.sticky-header-bar`)
- IDs: camelCase (`#passwordModal`, `#imageModal`)
- CSS variables: `--bg`, `--hunter-green`, `--stripe-text`
- Mobile breakpoint: `@media (max-width: 768px)`

### JavaScript
- Event listeners for modals and gallery
- IntersectionObserver for scroll animations
- Fetch API loads menu.html component
- Gallery modal with arrow key navigation

### HTML
- Semantic elements: `<section>`, `<main>`, `<header>`, `<footer>`
- Lazy loading on gallery images: `loading="lazy"`
- Alt text on all images

## Forms

All forms POST to Formspree: `https://formspree.io/f/myyqelpw`
- Contact form
- Residency application form
- Hidden `_subject` field categorizes submissions

## Password Protection

The manual section uses client-side password protection (password: "cheesegrits" in scripts.js). This is obfuscation only, not secure encryption.

## Development Workflow

1. Edit files directly (no build step)
2. Test locally with live server
3. Upload files to web host via FTP/SFTP
4. No minification or bundling required

## Common Tasks

### Adding a new gallery image
1. Add image to `/images/gallery/`
2. Add `<img>` tag in main.html `#photos` section with `class="gallery-img"` and `loading="lazy"`

### Updating user manual
1. Replace PDF in `/pdf/` directory
2. Update filename in manual section if changed

### Modifying navigation
1. Edit `/html/menu.html` for hamburger menu items
2. Update sticky header in main.html for desktop nav

## External Services

- **Formspree**: Form endpoint `f/myyqelpw`
- **Google Analytics**: ID `G-G7TKXRGNH8`
- **Instagram**: @woodsmillbend
- **Airbnb**: Two property listings linked

## Notes

- Legacy files exist (`property-old.html`, `airbnb.html`) - can be ignored
- `_notes/` folders are Adobe Dreamweaver artifacts
- Some images in `/images/old gallery/` are archived/unused
