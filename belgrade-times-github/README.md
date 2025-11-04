# Belgrade Times News Portal

A modern React-based news portal built with Vite, TypeScript, and Supabase.

## 🚀 Ready for Vercel Deployment

This project is pre-configured for seamless Vercel deployment with build optimizations already applied!

### Quick Deploy Steps

1. **Upload to GitHub**
   ```bash
   # Create new repository on GitHub
   # Upload all files from this folder
   # Make sure to include all files except node_modules, dist, .env
   ```

2. **Connect to Vercel** (Auto-configured!)
   - Vercel will auto-detect: Vite + React + TypeScript
   - Build command: `tsc -noEmit && vite build` ✅ (Pre-fixed!)
   - Framework preset: `vite`
   - Output directory: `dist`
   - Install command: `pnpm install`

3. **Set Environment Variables**
   - Go to Vercel dashboard → Project Settings → Environment Variables
   - Add these **exactly as shown**:
     ```
     VITE_SUPABASE_URL=https://wuptzgavpdlutycmdjkd.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cHR6Z2F2cGRsdXR5Y21kamtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTgzMzksImV4cCI6MjA3NzIzNDMzOX0.I_4PH-ZTidr6lqa0gZvURCZ8fMn58JvxMIZ7MPYJHgQ
     ```
   - Set both variables to: **Production, Preview, Development**

4. **Deploy**
   - Vercel will build and deploy automatically
   - Your app will be live at: `https://your-project-name.vercel.app`

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Run development server:**
   ```bash
   pnpm dev
   ```

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIs...` |

**Note:** Never commit your actual `.env` file to version control. Use `.env.example` as a template.

## 🗃️ Database

The app uses Supabase PostgreSQL database with the following tables:
- `articles` - News articles and content
- `categories` - Article categories (Politics, Economy, Sports, etc.)
- `profiles` - User profiles and roles
- `comments` - Article comments
- `site_settings` - Site configuration
- And more...

## 🎨 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Database + Auth)
- **Build Tool:** Vite
- **UI Components:** Radix UI
- **Routing:** React Router

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
│   ├── admin/     # Admin dashboard pages
├── contexts/      # React contexts (Auth)
├── lib/          # Utilities and configurations
├── hooks/        # Custom React hooks
```

## 🚨 Important Notes

- **Your Supabase data is already configured and ready to use**
- **Admin panel is accessible at `/admin/login`**
- **Default admin:** admin@belgradetimes.org
- **Environment variables are required for deployment**

## 📄 License

This project is private and proprietary.