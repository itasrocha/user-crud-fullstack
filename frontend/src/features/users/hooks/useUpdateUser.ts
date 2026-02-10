import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../api/user.service';
import type { UserUpdate } from '../types/user';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdate }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}