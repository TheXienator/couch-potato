import Fastify from 'fastify';
import cors from '@fastify/cors';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const fastify = Fastify({
  logger: true,
});

// Register CORS
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || true, // Allow frontend URL or all origins in dev
});

// Hello World route
fastify.get('/api/hello', async (request, reply) => {
  return { message: 'Hello World' };
});

// Health check for Render
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`Backend server running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
