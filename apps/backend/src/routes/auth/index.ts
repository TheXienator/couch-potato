import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.js';
import {
  signupHandler,
  loginHandler,
  meHandler,
  logoutHandler,
  refreshHandler,
} from './handlers.js';
import {
  SignupRequestSchema,
  SignupResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  MeResponseSchema,
  LogoutResponseSchema,
  RefreshResponseSchema,
  ErrorResponseSchema,
} from './schemas.js';

export default async function authRoutes(fastify: FastifyInstance) {
  // Signup route
  fastify.post('/api/auth/signup', {
    schema: {
      description: 'Register a new user',
      tags: ['auth'],
      body: SignupRequestSchema,
      response: {
        200: SignupResponseSchema,
        409: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: signupHandler,
  });

  // Login route
  fastify.post('/api/auth/login', {
    schema: {
      description: 'Authenticate user and return tokens',
      tags: ['auth'],
      body: LoginRequestSchema,
      response: {
        200: LoginResponseSchema,
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: loginHandler,
  });

  // Me route (protected)
  fastify.get('/api/auth/me', {
    onRequest: [authenticate],
    schema: {
      description: 'Get current user information',
      tags: ['auth'],
      security: [{ bearerAuth: [] }],
      response: {
        200: MeResponseSchema,
        401: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
    },
    handler: meHandler,
  });

  // Logout route
  fastify.post('/api/auth/logout', {
    schema: {
      description: 'Logout user and clear refresh token',
      tags: ['auth'],
      response: {
        200: LogoutResponseSchema,
      },
    },
    handler: logoutHandler,
  });

  // Refresh token route
  fastify.post('/api/auth/refresh', {
    schema: {
      description: 'Get new access token using refresh token',
      tags: ['auth'],
      response: {
        200: RefreshResponseSchema,
        401: ErrorResponseSchema,
      },
    },
    handler: refreshHandler,
  });
}
