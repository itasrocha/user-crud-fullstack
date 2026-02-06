import { useState } from "react";
import { 
  Table, 
  HStack, 
  IconButton, 
  Box, 
  Text 
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import type { User } from "../types/user";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { ConfirmDialog } from "../../../components/templates/ConfirmDialog";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export function UserTable({ users, onEdit }: UserTableProps) {
  const deleteUserMutation = useDeleteUser();
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const confirmDelete = async () => {
    if (userToDelete !== null) {
      await deleteUserMutation.mutateAsync(userToDelete);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
        <Table.Root variant="line" interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Nome</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell fontWeight="bold">{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <HStack gap="2" justifyContent="end">
                    <IconButton 
                      aria-label="Editar" 
                      size="sm" 
                      colorPalette="blue" 
                      variant="ghost"
                      onClick={() => onEdit(user)}
                    >
                      <FaEdit />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="Excluir" 
                      size="sm" 
                      colorPalette="red" 
                      variant="ghost"
                      onClick={() => setUserToDelete(user.id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        {users.length === 0 && (
            <Text p="4" textAlign="center" color="gray.500">
              Nenhum usuário encontrado.
            </Text>
        )}
      </Box>

      <ConfirmDialog 
        open={userToDelete !== null}
        onOpenChange={(e) => !e.open && setUserToDelete(null)}
        title="Excluir Usuário"
        description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        isLoading={deleteUserMutation.isPending}
      />
    </>
  );
}