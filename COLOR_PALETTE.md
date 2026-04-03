# Modern Color Palette - AccountEezy 2026

## Overview
The frontend has been updated with a modern, professional color scheme designed for contemporary business applications.

## Primary Colors

### Indigo (Primary Brand)
- **Primary**: `#4F46E5` - Vibrant indigo for primary actions, links, and brand elements
- **Primary Dark**: `#3730A3` - Deeper shade for hover states and emphasis
- **Primary Light**: `#6366F1` - Lighter shade for backgrounds and highlights

**Usage**: Primary buttons, links, active states, brand elements

### Cyan/Teal (Accent)
- **Accent**: `#06B6D4` - Bright cyan for secondary actions and highlights
- **Accent Dark**: `#0891B2` - Deeper cyan for hover states
- **Accent Light**: `#22D3EE` - Light cyan for subtle accents

**Usage**: Secondary buttons, icons, checkmarks, completed states

## Neutral Colors (Slate Scale)

- **50**: `#F8FAFC` - Lightest background
- **100**: `#F1F5F9` - Light background (secondary)
- **200**: `#E2E8F0` - Borders and dividers
- **300**: `#CBD5E1` - Disabled states
- **400**: `#94A3B8` - Placeholder text
- **500**: `#64748B` - Secondary text
- **600**: `#475569` - Body text
- **700**: `#334155` - Headings
- **800**: `#1E293B` - Dark elements
- **900**: `#0F172A` - Darkest (headers, navigation)

## Semantic Colors

### Success
- **Color**: `#10B981` (Emerald)
- **Usage**: Success messages, completed tasks, positive indicators

### Warning
- **Color**: `#F59E0B` (Amber)
- **Usage**: Warnings, pending actions, attention needed

### Error
- **Color**: `#EF4444` (Red)
- **Usage**: Error messages, validation errors, destructive actions

### Info
- **Color**: `#3B82F6` (Blue)
- **Usage**: Informational messages, tips, neutral notifications

## Application Colors

### Backgrounds
- **Primary**: `#FFFFFF` - Main content areas
- **Secondary**: `#F8FAFC` - Page backgrounds
- **Tertiary**: `#F1F5F9` - Sidebar, cards, subtle sections

### Text
- **Primary**: `#0F172A` - Main text, headings
- **Secondary**: `#475569` - Subheadings, descriptions
- **Tertiary**: `#94A3B8` - Hints, labels, disabled text

## CSS Variables

All colors are available as CSS custom properties:

```css
/* Primary */
var(--primary-color)
var(--primary-dark)
var(--primary-light)

/* Accent */
var(--accent-color)
var(--accent-dark)
var(--accent-light)

/* Neutrals */
var(--neutral-50) through var(--neutral-900)

/* Semantic */
var(--success)
var(--warning)
var(--error)
var(--info)

/* Backgrounds */
var(--background-primary)
var(--background-secondary)
var(--background-tertiary)

/* Text */
var(--text-primary)
var(--text-secondary)
var(--text-tertiary)
```

## Design Features

### Gradients
Modern gradient buttons and cards:
```css
/* Primary gradient */
linear-gradient(135deg, var(--primary-color), var(--primary-light))

/* Accent gradient */
linear-gradient(135deg, var(--accent-color), var(--accent-light))

/* Background gradient */
linear-gradient(135deg, var(--neutral-50), var(--neutral-100))
```

### Shadows
Subtle, layered shadows for depth:
```css
/* Small shadow */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);

/* Medium shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12);

/* Primary color shadow */
box-shadow: 0 4px 16px rgba(79, 70, 229, 0.4);

/* Accent color shadow */
box-shadow: 0 4px 16px rgba(6, 182, 212, 0.4);
```

### Transitions
Smooth, professional animations:
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## Color Accessibility

All color combinations meet WCAG 2.1 AA standards for contrast:
- **Text on white**: All neutral-600 and darker
- **White text on primary**: All primary colors pass
- **White text on accent**: All accent colors pass

## Migration Notes

### Legacy Colors (Deprecated)
The old black and gold theme has been replaced:
- ~~`#000000`~~ → `var(--neutral-900)` or `var(--text-primary)`
- ~~`#C7AE6A`~~ → `var(--primary-color)`
- ~~`#e3d6b4`~~ → `var(--background-secondary)`

### Backward Compatibility
Legacy CSS variables are still mapped for gradual migration:
- `--primary-black` → maps to `--neutral-900`
- `--primary-gold` → maps to `--primary-color`
- `--background-cream` → maps to `--background-secondary`

## Examples

### Primary Button
```html
<button class="mat-mdc-raised-button mat-primary">
  Get Started
</button>
```
**Result**: Indigo gradient with white text, hover lifts with shadow

### Accent Button
```html
<button class="mat-mdc-raised-button mat-accent">
  Learn More
</button>
```
**Result**: Cyan gradient with white text

### Card
```html
<mat-card>
  <mat-card-header>Title</mat-card-header>
  <mat-card-content>Content</mat-card-content>
</mat-card>
```
**Result**: White card with subtle shadow, rounds corners, lifts on hover

## Brand Personality

This color palette conveys:
- **Professional**: Deep indigo and slate grays
- **Trustworthy**: Clean, consistent neutrals
- **Modern**: Vibrant accents, smooth gradients
- **Accessible**: High contrast, clear hierarchy
- **Energetic**: Bright cyan accents
- **Sophisticated**: Layered shadows and smooth transitions

---

**Last Updated**: March 1, 2026
**Version**: 2.0
