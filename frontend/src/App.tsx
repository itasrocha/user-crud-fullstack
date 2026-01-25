import { useEffect, useState } from 'react';
import { Box, Heading, Text, Code } from "@chakra-ui/react";
import api from './api/axios';
import type { User } from './types/user';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/');
        console.log("Dados recebidos:", response.data);
        setUsers(response.data);
      } catch (err) {
        console.error("Erro ao buscar:", err);
        setError("Falha ao conectar com o Backend");
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box p={5}>
      <Heading mb={4}>Painel Administrativo</Heading>
      
      {error && <Text color="red.500">{error}</Text>}

      <Text mb={2}>Total de usuários: {users.length}</Text>
      
      <Code display="block" whiteSpace="pre" p={2}>
        {JSON.stringify(users, null, 2)}
      </Code>
    </Box>
  );
}

export default App;