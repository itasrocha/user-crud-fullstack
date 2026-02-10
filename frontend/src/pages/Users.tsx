import { useState } from "react";
import { Box, Heading, Spinner, Text, HStack, Button } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { CreateUserModal } from "../features/users/components/CreateUserModal";
import { UpdateUserModal } from "../features/users/components/UpdateUserModal";
import { UserTable } from "../features/users/components/UserTable";
import { useUsers } from "../features/users/hooks/useUsers";
import type { User } from "../features/users/types/user";

export function Users() {
  const { data: users, isLoading, isError } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Box>
      <HStack justifyContent="space-between" mb="8">
        <Heading size="lg">Gerenciar Usuários</Heading>
        <Button colorPalette="purple" onClick={handleCreate}>
           <FaPlus /> Novo Usuário
        </Button>
      </HStack>

      {isLoading ? (
        <HStack justifyContent="center" py="10">
          <Spinner size="xl" color="purple.500" />
        </HStack>
      ) : isError ? (
        <Text color="red.500" textAlign="center">
          Erro ao carregar usuários.
        </Text>
      ) : (
        <UserTable 
          users={users || []} 
          onEdit={handleEdit}  
        />
      )}

      {selectedUser ? (
        <UpdateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userToEdit={selectedUser}
        />
      ) : (
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Box>
  );
}