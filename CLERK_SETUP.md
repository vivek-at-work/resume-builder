# Clerk Authentication Setup

This project uses Clerk for authentication. Follow these steps to set it up:

## 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

## 2. Get Your Publishable Key

1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

## 3. Configure Environment Variables

1. Create a `.env` file in the root of your project:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

2. Replace `pk_test_your_actual_key_here` with your actual Clerk Publishable Key

## 4. Configure Clerk Dashboard Settings

In your Clerk Dashboard:

1. Go to **Paths** and set:
   - Sign-in path: `/sign-in`
   - Sign-up path: `/sign-up`

2. Go to **User & Authentication** → **Email, Phone, Username**:
   - Enable email/password authentication
   - Configure password reset settings

3. Go to **User & Authentication** → **Password**:
   - Enable "Forgot Password" functionality
   - Configure password reset email templates

## 5. Run the Application

```bash
npm run dev
```

The application will now have:
- Landing page at `/`
- Sign-in page at `/sign-in`
- Sign-up page at `/sign-up`
- Protected dashboard at `/dashboard` (requires authentication)

## Features Included

✅ Modern landing page with hero section
✅ Sign-in/Sign-up pages with Clerk components
✅ Forgot password functionality (handled by Clerk)
✅ Protected routes
✅ User session management
✅ Sign out functionality

## Notes

- Clerk handles password reset automatically through their UI
- The forgot password link appears in the SignIn component
- All authentication state is managed by Clerk
- User data is available via `useUser()` hook

