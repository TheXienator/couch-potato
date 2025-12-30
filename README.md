# Couch Potato

A minimal TypeScript monorepo with Fastify backend and React frontend.

## Project Structure

```
couch-potato/
├── apps/
│   ├── backend/     # Fastify server
│   └── frontend/    # React + Vite app
├── package.json
├── pnpm-workspace.yaml
└── render.yaml      # Render deployment config
```

## Development

```bash
# Install dependencies
pnpm install

# Run both frontend and backend
pnpm dev

# Run backend only
pnpm dev:backend

# Run frontend only
pnpm dev:frontend
```

**Access the app:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/hello

## Production Build

```bash
# Build both apps
pnpm build

# Start production server
pnpm start
```

## Deployment to Render

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub/GitLab/Bitbucket

3. Connect your repository to Render

4. Render will automatically detect `render.yaml` and create both services:
   - **Backend**: Web service (Node.js)
   - **Frontend**: Static site

## Free Hosting Options

This project is configured for **Render**, but can be deployed to:
- **Render** (recommended): Free tier with 750 hours/month
- **Railway**: $5/month credit
- **Fly.io**: Free tier for low-traffic apps
- **Vercel**: Great for frontend + serverless functions

## Tech Stack

- **Backend**: Fastify, TypeScript
- **Frontend**: React, Vite, TypeScript
- **Package Manager**: pnpm
- **Deployment**: Render
