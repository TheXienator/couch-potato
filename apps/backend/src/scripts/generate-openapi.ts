import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import authRoutes from '../routes/auth/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a temporary Fastify instance just to generate the OpenAPI spec
const fastify = Fastify({
  logger: false,
}).withTypeProvider<TypeBoxTypeProvider>();

// Register Swagger/OpenAPI
await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Couch Potato API',
      description: 'Backend API for Couch Potato application',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://couch-potato-backend.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
    },
    tags: [
      { name: 'auth', description: 'Authentication endpoints' },
      { name: 'general', description: 'General endpoints' },
    ],
  },
});

// Register routes to generate their schemas
await fastify.register(authRoutes);

// Wait for Fastify to be ready before generating the spec
await fastify.ready();

// Get the OpenAPI specification
const spec = fastify.swagger();

// Write to file - save it in the backend directory for the frontend to reference
const outputPath = path.join(__dirname, '../../openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));

console.log(`✅ OpenAPI spec generated at: ${outputPath}`);

process.exit(0);
