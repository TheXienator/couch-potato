import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { env } from './config/env.js';
import authRoutes from './routes/auth/index.js';

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Register Swagger/OpenAPI before routes
await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Couch Potato API',
      description: 'Backend API for Couch Potato application',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
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

// Register Swagger UI
await fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
});

// Register CORS
await fastify.register(cors, {
  origin: env.FRONTEND_URL || true,
  credentials: true,
});

// Register JWT
await fastify.register(jwt, {
  secret: env.JWT_SECRET,
});

// Register Cookie
await fastify.register(cookie, {
  secret: env.JWT_REFRESH_SECRET,
});

// Register auth routes
await fastify.register(authRoutes);

// Hello World route
fastify.get('/api/hello', {
  schema: {
    description: 'Hello World endpoint',
    tags: ['general'],
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: async (request, reply) => {
    return { message: 'Hello World' };
  },
});

// Health check for Render
fastify.get('/health', {
  schema: {
    description: 'Health check endpoint',
    tags: ['general'],
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' },
        },
      },
    },
  },
  handler: async (request, reply) => {
    return { status: 'ok' };
  },
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: env.HOST });
    console.log(`Backend server running on http://${env.HOST}:${env.PORT}`);
    console.log(`Swagger UI available at http://${env.HOST}:${env.PORT}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
