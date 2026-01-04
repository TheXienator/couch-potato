import { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthUser {
  id: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: AuthUser;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    // Store authenticated user in authUser instead of user
    request.authUser = request.user as AuthUser;
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
