# Backend (FastAPI)

FastAPI backend application for Maigie.

## Setup

### Quick Setup (Windows PowerShell)

Run the automated setup script:
```powershell
cd apps/backend
.\setup-dev.ps1
```

This will:
- Check Python installation
- Install Poetry if needed
- Install all dependencies
- Create `.env` file from `.env.example`
- Verify the setup

### Manual Setup

1. **Install Poetry** (if not already installed):
   ```powershell
   # Windows PowerShell
   .\install-poetry.ps1
   
   # Or use the official installer
   (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
   ```

2. **Install dependencies:**
   ```bash
   poetry install
   ```

3. **Copy environment variables** (optional, defaults are used if not set):
   ```powershell
   # Windows PowerShell
   Copy-Item .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

4. **Run the development server:**
   ```bash
   nx serve backend
   ```

   Or directly:
   ```bash
   cd apps/backend
   poetry run uvicorn src.main:app --reload
   ```

## Verify Application Setup

To verify that the Application Setup requirements are met:

```bash
# Using Poetry
cd apps/backend
poetry run python verify_setup.py

# Or using system Python (if dependencies are installed)
python verify_setup.py
```

Or run the tests:
```bash
nx test backend
# or
poetry run pytest
```

## Project Structure

### Core Application Files
- `src/main.py` - FastAPI app factory and application entry point
- `src/config.py` - Environment configuration management
- `src/dependencies.py` - Dependency injection system
- `src/middleware.py` - Custom middleware (logging, security headers)
- `src/exceptions.py` - Custom exception classes and handlers

### Core Utilities (`src/core/`)
- `core/security.py` - JWT utilities, password hashing
- `core/database.py` - Database connection manager (placeholder for Prisma)
- `core/cache.py` - Cache connection manager (placeholder for Redis)

### Feature Modules
- `src/routes/` - API route handlers
- `src/services/` - Business logic
- `src/models/` - Pydantic schemas and ORM models
- `src/db/` - Database connection and migrations
- `src/tasks/` - Background tasks (Celery/Dramatiq)
- `src/ai_client/` - LLM and embeddings clients
- `src/workers/` - Async workers
- `src/utils/` - Utility functions

### Tests
- `tests/` - Test files
- `verify_setup.py` - Setup verification script

## Application Setup Status

✅ **FastAPI server runs successfully** - Application factory pattern implemented  
✅ **Application structure follows defined patterns** - Organized according to Backend Infrastructure issue  
✅ **Environment configuration works correctly** - Pydantic Settings with .env support  
✅ **Dependency injection system works** - FastAPI Depends pattern implemented  
✅ **Middleware stack is configured** - Logging, Security Headers, and CORS middleware

## API Endpoints

- `GET /` - Root endpoint with app info
- `GET /health` - Health check endpoint
- `GET /ready` - Readiness check (includes DB and cache status)
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)
- `GET /openapi.json` - OpenAPI schema

## Environment Variables

See `.env.example` for available configuration options. Key settings:

- `APP_NAME` - Application name
- `DEBUG` - Enable debug mode
- `ENVIRONMENT` - Environment (development/production)
- `SECRET_KEY` - Secret key for JWT tokens
- `CORS_ORIGINS` - Allowed CORS origins
- `DATABASE_URL` - PostgreSQL connection string (for future use)
- `REDIS_URL` - Redis connection string (for future use)

