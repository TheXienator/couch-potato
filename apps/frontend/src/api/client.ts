import createClient from 'openapi-fetch';
import type { paths } from './schema';

const headers = new Headers();

export const apiClient = createClient<paths>({
  baseUrl: '/',
  headers,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.delete('Authorization');
  }
};
