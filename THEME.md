# RetroLite Theme: "Reflection"

## Theme Concept

**"Reflection"** is a calming, professional theme designed specifically for sprint retrospective sessions. It balances professionalism with approachability, creating an environment that encourages thoughtful reflection and open collaboration.

### Design Philosophy

- **Calming & Focused**: Soft colors reduce visual fatigue during facilitated sessions
- **Professional Yet Approachable**: Maintains workplace credibility while feeling inviting
- **Modern & Clean**: Contemporary design that doesn't distract from content
- **Accessible**: High contrast ratios ensure readability for all users

## Color Palette

### Light Mode

#### Primary Colors

- **Primary**: Soft Indigo (`hsl(230, 50%, 55%)`)
  - Represents trust, calm, and reflection
  - Used for main actions, links, and key UI elements
  - Foreground: `hsl(0, 0%, 98%)` (near-white)

#### Secondary Colors

- **Secondary**: Warm Gray (`hsl(220, 15%, 92%)`)
  - Subtle background for secondary elements
  - Foreground: `hsl(220, 20%, 20%)` (dark gray-blue)

#### Accent Colors

- **Accent**: Tailwind Slate (`hsl(210, 40%, 96%)`)
  - Tailwind's default slate-100 color
  - Used for highlights and hover states
  - Foreground: `hsl(222, 47%, 11%)` (slate-900)

#### Semantic Colors

- **Destructive**: Warm Coral (`hsl(0, 70%, 60%)`)

  - Used for delete actions and warnings
  - Foreground: `hsl(0, 0%, 98%)` (white)

- **Muted**: Cool Gray (`hsl(220, 10%, 85%)`)
  - Subtle backgrounds and dividers
  - Foreground: `hsl(220, 10%, 45%)` (medium gray)

#### Background & Surface

- **Background**: Warm Off-White (`hsl(40, 20%, 98%)`)

  - Soft, warm base that's easier on the eyes than pure white
  - Reduces glare during long sessions

- **Card**: Pure White (`hsl(0, 0%, 100%)`)

  - Clean surface for content cards
  - Foreground: `hsl(220, 20%, 15%)` (dark text)

- **Popover**: Pure White (`hsl(0, 0%, 100%)`)

  - Dropdowns and tooltips
  - Foreground: `hsl(220, 20%, 15%)`

- **Border**: Soft Gray (`hsl(220, 15%, 85%)`)

  - Subtle borders that don't overpower content

- **Input**: Soft Gray (`hsl(220, 15%, 90%)`)

  - Input field backgrounds
  - Border: `hsl(220, 15%, 75%)`

- **Ring**: Primary Indigo (`hsl(230, 50%, 55%)`)
  - Focus rings for accessibility

### Dark Mode

#### Primary Colors

- **Primary**: Bright Indigo (`hsl(230, 60%, 70%)`)
  - Lighter for better contrast on dark backgrounds
  - Foreground: `hsl(220, 30%, 10%)` (very dark blue-gray)

#### Secondary Colors

- **Secondary**: Dark Blue-Gray (`hsl(220, 20%, 18%)`)
  - Foreground: `hsl(220, 10%, 85%)` (light gray)

#### Accent Colors

- **Accent**: Tailwind Slate (`hsl(217, 33%, 17%)`)
  - Tailwind's default slate-800 color for dark mode
  - Foreground: `hsl(210, 40%, 96%)` (slate-100)

#### Semantic Colors

- **Destructive**: Bright Coral (`hsl(0, 75%, 65%)`)

  - More vibrant for dark backgrounds
  - Foreground: `hsl(0, 0%, 98%)`

- **Muted**: Dark Gray (`hsl(220, 15%, 20%)`)
  - Foreground: `hsl(220, 10%, 65%)` (medium-light gray)

#### Background & Surface

- **Background**: Deep Navy (`hsl(220, 30%, 8%)`)

  - Rich, deep base that's easy on the eyes
  - Not pure black for better depth perception

- **Card**: Dark Blue-Gray (`hsl(220, 25%, 12%)`)

  - Foreground: `hsl(220, 10%, 90%)` (light text)

- **Popover**: Dark Blue-Gray (`hsl(220, 25%, 12%)`)

  - Foreground: `hsl(220, 10%, 90%)`

- **Border**: Medium Gray (`hsl(220, 15%, 25%)`)

  - Visible but not harsh

- **Input**: Dark Gray (`hsl(220, 20%, 15%)`)

  - Border: `hsl(220, 15%, 30%)`

- **Ring**: Bright Indigo (`hsl(230, 60%, 70%)`)

## Typography

- **Font Family**: Inter (already configured)
- **Base Size**: 16px
- **Line Height**: 1.5
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Border Radius

- **Base Radius**: `0.5rem` (8px)
- **Small**: `calc(0.5rem - 2px)` (6px)
- **Medium**: `calc(0.5rem - 4px)` (4px)

## Spacing & Layout

- Consistent spacing scale using Tailwind's default spacing
- Generous padding for touch-friendly interactions
- Comfortable line heights for readability

## Component-Specific Styling

### Buttons

- Primary: Indigo background with white text
- Secondary: Light gray background with dark text
- Outline: Transparent with indigo border
- Ghost: Transparent with hover state
- Destructive: Coral background with white text

### Cards

- White background (light mode) / Dark blue-gray (dark mode)
- Subtle shadow for depth
- Rounded corners for modern feel
- Clear borders for definition

### Inputs

- Soft gray background
- Clear focus states with indigo ring
- Comfortable padding for text entry

### Badges

- Used for vote counts
- Indigo background for primary badges
- Slate for subtle indicators

## Accessibility

- **WCAG AA Compliant**: All color combinations meet contrast requirements
- **Focus States**: Clear, visible focus rings on all interactive elements
- **Touch Targets**: Minimum 44x44px for mobile interactions
- **Text Sizes**: Minimum 16px base font size

## Usage Guidelines

1. **Primary actions** should use the indigo primary color
2. **Hover states and highlights** use slate accent for subtle feedback
3. **Destructive actions** use coral for clear distinction
4. **Backgrounds** should remain subtle to keep focus on content
5. **Borders** should be minimal but present for structure

## Inspiration

This theme draws inspiration from:

- Modern SaaS applications (calm, professional)
- Meditation apps (soothing colors)
- Design systems like Linear and Vercel (clean, modern)
- Retrospective facilitation tools (focused, distraction-free)
