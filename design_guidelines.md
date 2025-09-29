# TimelyTogether E-Portal Design Guidelines

## Design Approach
**System-Based Approach**: Clean, accessible design prioritizing clarity and ease of use for seniors and their families. Drawing from Material Design principles with enhanced accessibility considerations.

**Core Principles**:
- Maximum readability and contrast
- Simplified navigation patterns
- Clear visual hierarchy
- Consistent, predictable interactions

## Color Palette

**Primary Colors**:
- Light Mode: 210 100% 25% (deep blue - trustworthy, calming)
- Dark Mode: 210 80% 70% (lighter blue variant)

**Background Colors**:
- Light Mode: 0 0% 98% (near white)
- Dark Mode: 220 15% 12% (dark gray-blue)

**Accent Colors**:
- Success/Confirmation: 142 70% 45% (green for positive actions)
- Warning/Edit: 45 90% 55% (amber for caution states)
- Text Primary: 220 15% 15% (light) / 0 0% 90% (dark)
- Text Secondary: 220 10% 45% (light) / 0 0% 65% (dark)

## Typography
**Font Family**: Inter (via Google Fonts CDN)
- Primary: 16px base size (larger than typical for senior accessibility)
- Headings: 24px, 20px, 18px (clear hierarchy)
- Labels: 14px (medium weight)
- Body text: 16px (regular weight)

## Layout System
**Spacing Units**: Tailwind 4, 6, 8, 12 units for consistent rhythm
- Component spacing: p-6, m-4
- Section spacing: py-8, px-6
- Form field spacing: mb-6

## Component Library

**Navigation**:
- Simple horizontal header with clear section labels
- Breadcrumb navigation for multi-step flows
- Large, clearly labeled buttons (minimum 44px height)

**Forms**:
- Large input fields with prominent labels above
- Character counters for title (40) and message (120) limits
- Clear validation states with color and text indicators
- Grouped related fields with subtle borders

**Cards/Containers**:
- Subtle shadows (shadow-sm)
- Rounded corners (rounded-lg)
- Clear content separation with borders

**Buttons**:
- Primary: Solid blue with white text
- Secondary: Outline style with blue border
- Destructive: Red for delete/cancel actions
- Minimum 44px height for accessibility

**Data Display**:
- Clean, scannable lists
- Clear date/time formatting
- Status indicators with color coding
- Easy-to-read recurrence pattern displays

## Screen-Specific Considerations

**Create Reminder Form**:
- Single-column layout for focus
- Progress indication for multi-step feel
- Clear field grouping (basic info, scheduling, notifications)

**Review Reminder**:
- Card-based summary layout
- Prominent Save/Edit action buttons
- Clear visual confirmation of all entered data

**Completion Screen**:
- Centered success message
- Clear next action options
- Confirmation details in easy-to-scan format

## Images
No large hero images needed. Focus on:
- Simple, clear icons for reminder types/statuses
- Small illustrative icons for empty states
- Clear visual indicators for form validation

**Icon Strategy**: Use Heroicons (outline style) for consistency and clarity - calendar, clock, mail, check-circle, and edit icons throughout.