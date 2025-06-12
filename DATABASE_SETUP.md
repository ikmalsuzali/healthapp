# Database & Authentication Setup Guide

This guide will help you set up the database infrastructure with Drizzle ORM and authentication using NextAuth.js with email/password credentials.

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (local or cloud)
- Basic understanding of Next.js and TypeScript

## 📋 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/healthapp"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-replace-with-random-string"

# Email Configuration (Optional - for email provider)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### 2. Database Setup

1. **Install Dependencies** (already done):

   ```bash
   pnpm add drizzle-orm drizzle-kit @auth/drizzle-adapter next-auth bcryptjs postgres dotenv nanoid
   ```

2. **Generate Database Migration**:

   ```bash
   pnpm db:generate
   ```

3. **Push Schema to Database**:

   ```bash
   pnpm db:push
   ```

4. **Alternative: Run Migration** (if using migrations):
   ```bash
   pnpm db:migrate
   ```

### 3. Database Studio (Optional)

Launch Drizzle Studio to view and manage your database:

```bash
pnpm db:studio
```

## 🏗️ Architecture Overview

### Database Schema

The setup includes the following tables:

#### Authentication Tables (NextAuth.js compatible)

- **users**: User accounts with email/password
- **accounts**: OAuth provider accounts
- **sessions**: User sessions
- **verificationTokens**: Email verification tokens

#### Application Tables

- **profiles**: Extended user profile information for health app

### Key Files Structure

```
src/
├── lib/
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts         # Database schema & relations
│   ├── services/
│   │   └── user-service.ts   # User management functions
│   └── auth.ts               # NextAuth configuration
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts  # NextAuth API routes
│   │       └── register/route.ts       # User registration
│   ├── auth/
│   │   ├── signin/page.tsx   # Sign in page
│   │   └── signup/page.tsx   # Sign up page
│   └── dashboard/page.tsx    # Protected dashboard
├── components/
│   └── providers/
│       └── session-provider.tsx  # Session context provider
├── types/
│   └── next-auth.d.ts        # NextAuth type extensions
└── drizzle.config.ts         # Drizzle configuration
```

## 🔧 Available Scripts

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm db:generate` | Generate migration files from schema |
| `pnpm db:migrate`  | Run pending migrations               |
| `pnpm db:push`     | Push schema directly to database     |
| `pnpm db:studio`   | Launch Drizzle Studio                |

## 🔐 Authentication Features

### Current Implementation

- ✅ Email/Password authentication
- ✅ User registration with validation
- ✅ Secure password hashing (bcrypt)
- ✅ JWT session management
- ✅ Protected routes/pages
- ✅ User profile system

### Authentication Flow

1. **Registration**: `/auth/signup` - Create new account
2. **Sign In**: `/auth/signin` - Authenticate existing user
3. **Dashboard**: `/dashboard` - Protected area (redirects if not authenticated)
4. **Sign Out**: Handled via NextAuth signOut function

## 🧪 Testing Authentication

### 1. Create Test User

Navigate to `/auth/signup` and create a test account:

- Name: Test User
- Email: test@example.com
- Password: password123

### 2. Sign In

Navigate to `/auth/signin` and sign in with the test credentials.

### 3. Access Dashboard

After signing in, you'll be redirected to `/dashboard` where you can see user information and sign out.

## 🔄 API Endpoints

| Endpoint                  | Method   | Description                |
| ------------------------- | -------- | -------------------------- |
| `/api/auth/register`      | POST     | User registration          |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js authentication |

### Registration API Example

```typescript
// POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

## 🏥 Health App Specific Features

The `profiles` table includes health-specific fields:

- Personal information (name, DOB, gender)
- Physical metrics (height, weight, activity level)
- Medical information (conditions, allergies, medications)
- Emergency contact information

## 🚀 Production Deployment

### Environment Variables

Ensure all environment variables are set in your production environment:

- `DATABASE_URL`: Production PostgreSQL connection string
- `NEXTAUTH_SECRET`: Strong random secret (use `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your production domain

### Database Migration

Run migrations in production:

```bash
pnpm db:migrate
```

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Verify `DATABASE_URL` is correct
   - Check PostgreSQL server is running
   - Ensure database exists

2. **NextAuth Session Issues**

   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Clear browser cookies/localStorage

3. **TypeScript Errors**
   - Run `pnpm build` to check for type errors
   - Ensure all dependencies are installed

### Reset Database

To completely reset your database schema:

```bash
pnpm db:push --force
```

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify environment variables are set correctly
3. Ensure database is accessible and schema is up to date
4. Check browser console for client-side errors
5. Review server logs for API errors
