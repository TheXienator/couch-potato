import { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  LogoutResponse,
  RefreshResponse,
} from './schemas.js';

export async function signupHandler(
  request: FastifyRequest<{ Body: SignupRequest }>,
  reply: FastifyReply
): Promise<SignupResponse> {
  const { email, password } = request.body;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    reply.status(409).send({ error: 'User already exists' });
    return;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      hashedPassword,
    })
    .returning();

  // Generate access token
  const accessToken = request.server.jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
    },
    { expiresIn: '15m' }
  );

  // Generate refresh token
  const refreshToken = request.server.jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      type: 'refresh',
    },
    { expiresIn: '7d' }
  );

  // Set refresh token as httpOnly cookie
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  });

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt.toISOString(),
    },
    accessToken,
  };
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
): Promise<LoginResponse> {
  const { email, password } = request.body;

  // Find user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    reply.status(401).send({ error: 'Invalid credentials' });
    return;
  }

  // Verify password
  const isValid = await verifyPassword(password, user.hashedPassword);

  if (!isValid) {
    reply.status(401).send({ error: 'Invalid credentials' });
    return;
  }

  // Generate access token
  const accessToken = request.server.jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    { expiresIn: '15m' }
  );

  // Generate refresh token
  const refreshToken = request.server.jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: 'refresh',
    },
    { expiresIn: '7d' }
  );

  // Set refresh token as httpOnly cookie
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    },
    accessToken,
  };
}

export async function meHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<MeResponse> {
  const userId = request.user!.id;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    reply.status(404).send({ error: 'User not found' });
    return;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  };
}

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<LogoutResponse> {
  // Clear refresh token cookie
  reply.clearCookie('refreshToken', { path: '/' });

  return {
    message: 'Logged out successfully',
  };
}

export async function refreshHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<RefreshResponse> {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    reply.status(401).send({ error: 'No refresh token provided' });
    return;
  }

  try {
    const decoded = request.server.jwt.verify(refreshToken) as {
      id: string;
      email: string;
      type?: string;
    };

    if (decoded.type !== 'refresh') {
      reply.status(401).send({ error: 'Invalid token type' });
      return;
    }

    // Generate new access token
    const accessToken = request.server.jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
      },
      { expiresIn: '15m' }
    );

    return {
      accessToken,
    };
  } catch (err) {
    reply.status(401).send({ error: 'Invalid or expired refresh token' });
    return;
  }
}
