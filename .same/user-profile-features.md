# User Profile Features

## Overview

The BOLES Smart Home platform now includes a comprehensive user profile system that allows users to manage their account information, track orders, and update security settings. This document outlines the implementation details and features.

## Key Components

### 1. User Profile Page (`/profile`)

A dedicated page for users to view and manage their account information:

- **Account Information Card**: Displays user profile picture (or initial), name, email, and join date
- **Account Settings Tab**: Integrates with Clerk's UserProfile component for account management
- **Orders Tab**: Shows order history (currently a placeholder for future implementation)
- **Security Tab**: Provides access to security settings like password changes and 2FA

### 2. Header User Menu

An enhanced header with a dropdown menu for authenticated users:

- **User Avatar**: Shows Clerk user avatar with dropdown menu
- **Quick Links**: Direct access to profile, orders, and settings
- **Sign Out**: One-click access to sign out functionality

### 3. Toast Notification System

A modern toast notification system for user feedback:

- **Authentication Events**: Success and error messages for sign-in, sign-up, and sign-out
- **Consistent Styling**: Matches BOLES brand colors and design
- **Multiple Variants**: Success, error, info, and warning message types
- **Auto-dismiss**: Automatically dismisses after a specified duration

### 4. Responsive Auth Dialog

Improved responsive design for the authentication dialog:

- **Mobile Optimization**: Better spacing and sizing for mobile devices
- **Scrollable Content**: For longer forms on smaller screens
- **Fixed Width**: Proper width constraints to improve readability

## Implementation Details

### Protected Routes

The profile page is protected by Clerk middleware:

```typescript
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/account(.*)',
  '/orders(.*)',
  '/profile(.*)',
  '/dashboard(.*)'
])
```

### Toast Notifications

The toast system uses a custom implementation based on Radix UI's Toast primitive:

- Global state management for toast messages
- Support for actions and custom rendering
- Limit on maximum number of toasts (5)
- Automatic removal after timeout

### User Menu

The user menu dropdown uses Radix UI's DropdownMenu for accessibility:

- Keyboard navigation support
- Focus management
- Screen reader friendly
- Mobile-friendly touch targets

## User Journey

1. User signs in via the popup auth dialog
2. Receives a success toast notification
3. Avatar and user name appear in the header
4. User can access profile via the dropdown menu
5. Profile page shows user information and account management options
6. User can sign out via the dropdown menu

## Future Enhancements

- **Order History Integration**: Connect with order database to show actual order history
- **Wishlist Feature**: Add ability to save products to wishlist from profile
- **Address Management**: Allow users to save and manage shipping addresses
- **Payment Methods**: Secure storage of payment information
- **Notification Preferences**: Let users customize email and push notification settings
