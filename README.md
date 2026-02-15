# Modern Image Hosting Platform

A beautiful, full-featured image hosting website built with Next.js 14, featuring user authentication, subscription payments, admin panel, and smooth animations.

## ✨ Features

### User Features
- 🔐 **Authentication System**
  - Email/password signup and login
  - Google OAuth integration
  - Password reset functionality
  - Secure session management

- 📤 **Image Upload**
  - Drag-and-drop interface
  - Multiple file upload
  - Automatic image optimization
  - Supported formats: PNG, JPG, JPEG, GIF, WEBP
  - Real-time upload progress
  - Generate direct links, thumbnails, and delete tokens

- 📊 **User Dashboard**
  - Personal image gallery
  - Grid and list view modes
  - Search and filter images
  - Favorite images
  - Storage usage tracking
  - Delete and rename images

- 💳 **Subscription System**
  - Free tier: 500 MB storage, 5 MB max file size
  - Premium tier: 25+ GB storage, 100 MB max file size
  - $3.25/month subscription via Stripe
  - Easy upgrade/downgrade
  - Automatic billing management

### Admin Features
- 👥 **User Management**
  - View all users
  - Ban/unban users
  - Delete users
  - View user statistics
  - Monitor storage usage

- 📈 **Analytics Dashboard**
  - Total users and images
  - Storage statistics
  - Active subscriptions
  - Monthly revenue tracking
  - New user metrics

- 🛡️ **Moderation Tools**
  - Image moderation system
  - Flagging capabilities
  - Content management

### Design Features
- 🎨 **Beautiful UI**
  - Nature green, pastel, and pink color themes
  - Glassmorphism effects
  - Smooth page transitions
  - Animated gradients
  - Responsive design (mobile, tablet, desktop)

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **Storage**: Local or AWS S3
- **Image Processing**: Sharp
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Stripe account (for payments)
- AWS S3 bucket (optional, for cloud storage)

### Setup Steps

1. **Clone the repository**
```bash
cd "img hoster"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/imagehoster"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PRICE_ID="price_your_price_id"

# Storage (local or s3)
STORAGE_TYPE="local"
UPLOAD_DIR="./public/uploads"

# AWS S3 (optional)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Limits
FREE_STORAGE_LIMIT_MB=500
PREMIUM_STORAGE_LIMIT_MB=25600
FREE_MAX_FILE_SIZE_MB=5
PREMIUM_MAX_FILE_SIZE_MB=100
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Create uploads directory (if using local storage)**

```bash
mkdir -p public/uploads
```

6. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🔧 Configuration

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Create a product and price for the $3.25/month subscription
4. Set up a webhook endpoint at `/api/stripe/webhook`
5. Add the webhook secret to your `.env` file

### Google OAuth Setup (Optional)

1. Go to Google Cloud Console
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `.env` file

### AWS S3 Setup (Optional)

1. Create an S3 bucket
2. Configure bucket permissions for public read access
3. Create IAM user with S3 access
4. Add credentials to `.env` file
5. Set `STORAGE_TYPE="s3"` in `.env`

## 👤 Creating an Admin User

After signing up, you need to manually promote a user to admin in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🗂️ Project Structure

```
img hoster/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── admin/        # Admin endpoints
│   │   ├── images/       # Image management
│   │   ├── stripe/       # Payment processing
│   │   └── upload/       # File upload
│   ├── admin/            # Admin panel
│   ├── auth/             # Auth pages
│   ├── dashboard/        # User dashboard
│   ├── pricing/          # Pricing page
│   ├── upload/           # Upload page
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                  # Utility functions
│   ├── auth.ts          # Auth configuration
│   ├── prisma.ts        # Database client
│   ├── storage.ts       # File storage
│   ├── stripe.ts        # Payment processing
│   └── utils.ts         # Helper functions
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static files
└── types/               # TypeScript types
```

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  nature: { /* your colors */ },
  pastel: { /* your colors */ },
}
```

### Adjusting Storage Limits

Modify limits in `.env`:

```env
FREE_STORAGE_LIMIT_MB=500
PREMIUM_STORAGE_LIMIT_MB=25600
```

### Changing Subscription Price

1. Update Stripe product price
2. Update `STRIPE_PRICE_ID` in `.env`
3. Update display price in `app/pricing/page.tsx`

## 🔒 Security Features

- Encrypted passwords with bcrypt
- Secure session management
- Rate limiting on API routes
- File type validation
- Size limit enforcement
- CSRF protection
- SQL injection prevention (Prisma)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS
- Heroku

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues and questions:
- Open an issue on GitHub
- Contact support at your-email@example.com

## 🎉 Acknowledgments

Built with:
- Next.js
- React
- TailwindCSS
- Prisma
- Stripe
- NextAuth.js
- Framer Motion
- Lucide Icons

---

Made with ❤️ by Your Name
