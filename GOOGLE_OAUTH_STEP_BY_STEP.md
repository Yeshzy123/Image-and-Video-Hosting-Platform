# Google OAuth Setup - Step by Step

## The Error You're Seeing
```
Error 401: invalid_client
The OAuth client was not found.
```

This happens because we need real Google OAuth credentials, not placeholder ones.

## Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click the project dropdown at the top and click "NEW PROJECT"
4. Name it something like "Image Hosting App" and click "CREATE"

## Step 2: Enable Google+ API

1. In the left menu, go to "APIs & Services" → "Library"
2. Search for "Google+ API" 
3. Click on it and click "ENABLE"

## Step 3: Create OAuth Credentials

1. In the left menu, go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, click "CONFIGURE CONSENT SCREEN" first:
   - Choose "External" and click "CREATE"
   - Fill in:
     - App name: Image Hosting
     - User support email: your-email@gmail.com
     - Developer contact: your-email@gmail.com
   - Click "SAVE AND CONTINUE" through all steps
4. Now back at credentials, click "+ CREATE CREDENTIALS" → "OAuth client ID"
5. Select "Web application"
6. Under "Authorized redirect URIs", click "ADD URI" and add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click "CREATE"

## Step 4: Get Your Credentials

You'll see a popup with:
- **Client ID** (copy this)
- **Client Secret** (copy this)

## Step 5: Update Your .env File

Replace the placeholder values in your .env file:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

## Step 6: Restart the Server

Stop the current server (Ctrl+C) and run:
```bash
npm run dev
```

## Step 7: Test Google Sign-In

1. Go to http://localhost:3000/auth/signin
2. Click "Google" button
3. It should now work!

## Troubleshooting

If it still doesn't work:
- Make sure the redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check that Google+ API is enabled
- Verify your credentials are correct (no extra spaces)
- Make sure you're using http:// not https:// for localhost

## Alternative: Disable Google OAuth Temporarily

If you want to skip Google OAuth for now, you can remove the Google button from the sign-in page and just use email/password.
