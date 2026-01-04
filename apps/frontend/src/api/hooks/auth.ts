import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const { data, error } = await apiClient.POST('/api/auth/signup', {
        body: credentials,
      });
      if (error) throw error;
      return data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data, error } = await apiClient.POST('/api/auth/login', {
        body: credentials,
      });
      if (error) throw error;
      return data;
    },
  });
};

export const useMe = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/auth/me');
      if (error) throw error;
      return data;
    },
    enabled,
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await apiClient.POST('/api/auth/logout');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useRefresh = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await apiClient.POST('/api/auth/refresh');
      if (error) throw error;
      return data;
    },
  });
};
