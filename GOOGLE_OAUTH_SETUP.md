# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Select "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

## Step 2: Update Environment Variables

Add your Google OAuth credentials to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Step 3: Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 4: Test Google Sign-In

1. Go to http://localhost:3000
2. Click "Sign In"
3. Click "Google" button
4. Sign in with your Google account
5. You'll be redirected back to the app

## Admin Account Ready! 🎉

Your admin account is already created:
- **Email:** yesh@gmail.com
- **Password:** BrahBrah12!
- **Role:** ADMIN

You can use this to access the admin panel at http://localhost:3000/admin

## Troubleshooting

If Google OAuth doesn't work:
1. Check that the redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
2. Make sure the Google+ API is enabled
3. Verify your credentials are correct in the .env file
4. Check the browser console for error messages
