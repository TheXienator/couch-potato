import { Type, Static } from '@sinclair/typebox';

// Signup schemas
export const SignupRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});

export const SignupResponseSchema = Type.Object({
  user: Type.Object({
    id: Type.String(),
    email: Type.String(),
    emailVerified: Type.Boolean(),
    createdAt: Type.String(),
  }),
  accessToken: Type.String(),
});

export type SignupRequest = Static<typeof SignupRequestSchema>;
export type SignupResponse = Static<typeof SignupResponseSchema>;

// Login schemas
export const LoginRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

export const LoginResponseSchema = Type.Object({
  user: Type.Object({
    id: Type.String(),
    email: Type.String(),
    emailVerified: Type.Boolean(),
  }),
  accessToken: Type.String(),
});

export type LoginRequest = Static<typeof LoginRequestSchema>;
export type LoginResponse = Static<typeof LoginResponseSchema>;

// Me (current user) schema
export const MeResponseSchema = Type.Object({
  user: Type.Object({
    id: Type.String(),
    email: Type.String(),
    emailVerified: Type.Boolean(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
});

export type MeResponse = Static<typeof MeResponseSchema>;

// Logout schema
export const LogoutResponseSchema = Type.Object({
  message: Type.String(),
});

export type LogoutResponse = Static<typeof LogoutResponseSchema>;

// Refresh token schema
export const RefreshResponseSchema = Type.Object({
  accessToken: Type.String(),
});

export type RefreshResponse = Static<typeof RefreshResponseSchema>;

// Error schema
export const ErrorResponseSchema = Type.Object({
  error: Type.String(),
  message: Type.Optional(Type.String()),
});

export type ErrorResponse = Static<typeof ErrorResponseSchema>;
