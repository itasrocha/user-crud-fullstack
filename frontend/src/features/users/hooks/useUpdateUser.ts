import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, type CreateUserDTO } from '../api/user.service';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUserDTO }) => 
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}