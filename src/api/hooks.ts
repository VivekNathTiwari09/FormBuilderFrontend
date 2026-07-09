import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

// Forms Hooks
export const useGetForms = () => {
  return useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const { data } = await apiClient.get('/forms/');
      return data;
    },
  });
};

export const useGetFormById = (formId: number) => {
  return useQuery({
    queryKey: ['forms', formId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/forms/${formId}`);
      return data;
    },
    enabled: !!formId,
  });
};

export const useGetFormResponses = (formId?: number) => {
  return useQuery({
    queryKey: ['forms', formId, 'responses'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/forms/${formId}/responses`);
      return data;
    },
    enabled: !!formId,
  });
};

export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: any) => {
      const { data } = await apiClient.post('/forms/', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};

export const useUpdateForm = (formId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: any) => {
      const { data } = await apiClient.put(`/forms/${formId}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['forms', formId] });
    },
  });
};

export const usePublishForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formId: number) => {
      const { data } = await apiClient.put(`/forms/${formId}/publish`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};
// Responses Hooks
export const useSubmitResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (responseData: any) => {
      const { data } = await apiClient.post('/responses/', responseData);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forms', variables.formid, 'responses'] });
    },
  });
};

// Auth Hooks (for future use)
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: URLSearchParams) => {
      const { data } = await apiClient.post('/auth/login', credentials, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return data;
    },
  });
};
