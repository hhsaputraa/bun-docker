# Bun-Docker with Supabase CRUD API

> [!IMPORTANT]
> Render now supports Bun natively, so you can use Bun without Docker.
> Learn more in our [language support docs](https://docs.render.com/language-support).

## About

This project is a modular and scalable API built with Bun and Supabase. It provides a simple CRUD API for managing tasks, with a clean architecture that's easy to extend.

## Features

- Bun HTTP server with TypeScript
- Supabase integration for database operations
- Complete CRUD API for tasks
- Modular architecture for scalability
- Environment variable configuration
- Docker support for deployment

## Prerequisites

1. Refer to the [Bun documentation](https://bun.sh/docs/installation) to install Bun.
2. Create a [Supabase](https://supabase.com/) account and project.
3. Create a `tasks` table in your Supabase project with the following schema:
   - `id` (uuid, primary key)
   - `title` (text, not null)
   - `description` (text)
   - `is_completed` (boolean, default: false)
   - `created_at` (timestamp with time zone, default: now())
   - `updated_at` (timestamp with time zone)

## Configuration

1. Copy the `.env` file and update it with your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=8081
NODE_ENV=development
```

## Project Structure

```
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers
│   ├── models/       # Data models and types
│   ├── routes/       # API routes
│   ├── services/     # Business logic and data access
│   └── utils/        # Utility functions
├── app.ts           # Main application entry point
├── Dockerfile       # Docker configuration
├── package.json     # Project dependencies
└── tsconfig.json    # TypeScript configuration
```

## Usage

### `bun install`

To run this app locally, first run `bun install` to install the dependencies.

### `bun dev`

Run `bun dev` to start the server locally with hot reloading.

### `bun start`

Run `bun start` to start the server locally without hot reloading.

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deploy to Render

Use the official [Bun Docker image](https://hub.docker.com/r/oven/bun) to deploy this app to Render.

### Manual deploy

1. [Fork this repo](https://github.com/render-examples/bun-docker/fork) on GitHub or click **Use this template**.
2. Create a new **web service** on Render, and give Render permission to access your new repo.
3. Select **Docker** as your service's runtime.
4. Add your Supabase environment variables in the Render dashboard.

That's it! Your web service will be live on your Render URL as soon as the build finishes.

### One-click deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/render-examples/bun-docker)
