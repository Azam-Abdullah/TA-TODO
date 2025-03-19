# Todo App

A full-stack Todo web application built with Next.js, Supabase, and Prisma. This app features authentication, database integration, and task management.

## Features
- User authentication (login/register)
- Task management (create, update, delete todos)
- Database integration with Prisma and Supabase
- Responsive UI with TailwindCSS

## Tech Stack
- **Next.js** - React framework for server-side rendering and static site generation
- **Supabase** - Open-source backend as a service (BaaS)
- **Prisma** - ORM for database management
- **TailwindCSS** - Utility-first CSS framework for styling
- **NextAuth.js** - Authentication for Next.js applications

## Installation

### Prerequisites
- Node.js (latest LTS version recommended)
- Supabase account & project setup
- Environment variables configured

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Azam-Abdullah/TA-TODO.git
   cd TA-TODO
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   DATABASE_URL=your-prisma-supabase-url
   DIRECT_URL=your-prisma-supabase-direct-url
   AUTH_GOOGLE_ID=your-google-project-id
   AUTH_GOOGLE_SECRET=your-google-project-secret
   AUTH_SECRET= generate using 'openssl rand -base64 32'
   ```
4. Run database migration:
   ```sh
   npx prisma migrate dev
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
### Vercel Deployment
To deploy on Vercel:
1. Push your code to GitHub/GitLab/Bitbucket.
2. Connect your repository to Vercel.
3. Set up environment variables in Vercel.
4. Deploy with the following build command:
   ```sh
   vercel --prod
   ```

## Running Prisma with Vercel
Since Vercel does not support Prisma's default SQLite database well, ensure you are using a PostgreSQL database (Supabase provides one by default). Update your database URL accordingly in `.env`.

For Prisma client generation before deploying, run:
```sh
npx prisma generate
```