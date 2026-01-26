import { useEffect, useState, useCallback } from "react";
import { 
  Box, 
  Heading, 
  Table, 
  Spinner, 
  Text, 
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import api from "../api/axios";
import type { User } from "../types/user";
import { UserModal } from "../components/UserModal";

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users/?skip=0&limit=100");
      setUsers(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar usuários.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Box>
      <HStack justifyContent="space-between" mb="8">
        <Heading size="lg">Gerenciar Usuários</Heading>
        <UserModal onSuccess={fetchUsers} />
      </HStack>

      {isLoading ? (
        <HStack justifyContent="center" py="10">
          <Spinner size="xl" color="teal.500" />
        </HStack>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : (
        <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
          <Table.Root variant="line" interactive>
            <Table.Header bg="gray.50">
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
                      <IconButton aria-label="Editar" size="sm" colorPalette="blue" variant="ghost">
                        <FaEdit />
                      </IconButton>
                      <IconButton aria-label="Excluir" size="sm" colorPalette="red" variant="ghost">
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
      )}
    </Box>
  );
}