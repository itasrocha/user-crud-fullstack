import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../api/user.service';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error("Failed to delete user:", error); // TODO: Add toast notification latter 
    }
  });
}