# Environment Configuration

This project uses Vite environment variables for configuration management.

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration values:

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

### API Configuration

- `VITE_API_BASE_URL`: Base URL for the Crisis Journalist AI API
  - Default: `http://0.0.0.000:8000`
  - Example: `https://your-api-domain.com`

- `VITE_API_TIMEOUT`: Default API request timeout in milliseconds
  - Default: `120000` (2 minutes)

- `VITE_API_UPLOAD_TIMEOUT`: File upload timeout in milliseconds
  - Default: `300000` (5 minutes)

### Upload Configuration

- `VITE_MAX_UPLOAD_SIZE`: Maximum file upload size in bytes
  - Default: `104857600` (100MB)

### CORS Configuration

- `VITE_API_WITH_CREDENTIALS`: Enable credentials for CORS requests
  - Default: `false`
  - Values: `true` or `false`

### Environment

- `VITE_NODE_ENV`: Application environment
  - Default: `development`
  - Values: `development`, `staging`, `production`

## Usage in Code

Environment variables are accessible via `import.meta.env`:

```javascript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const timeout = import.meta.env.VITE_API_TIMEOUT;
```

## Configuration File

The main configuration is located in `src/config/api.js` and automatically reads from environment variables with fallback defaults.

## Security Note

- Never commit `.env` files to version control
- Use `.env.example` as a template for required variables
- Environment variables with `VITE_` prefix are bundled into the client-side code and are visible to users
