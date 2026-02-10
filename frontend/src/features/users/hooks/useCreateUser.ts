import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/user.service';
import type { UserCreate } from '../types/user';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreate) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}