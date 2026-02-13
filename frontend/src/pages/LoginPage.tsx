import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Stack,
    Text,
    Link,
} from '@chakra-ui/react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LoginForm } from '../features/auth/components/LoginForm';
import type { LoginCredentials } from '../features/auth/types/types';

export function LoginPage() {
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (data: LoginCredentials) => {
        setError('');
        try {
            await login(data);
            navigate(from, { replace: true });
        } catch {
            setError('Email ou senha inválidos');
        }
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.900"
        >
            <Container maxW="md">
                <Box
                    bg="gray.800"
                    p={8}
                    borderRadius="xl"
                    boxShadow="2xl"
                    border="1px solid"
                    borderColor="gray.700"
                >
                    <Stack gap={6}>
                        <Box textAlign="center">
                            <Heading size="xl" color="white" mb={2}>
                                Bem-vindo de volta
                            </Heading>
                            <Text color="gray.400">
                                Entre com suas credenciais para acessar o sistema
                            </Text>
                        </Box>

                        <LoginForm onSubmit={handleLogin} error={error} />

                        <Text textAlign="center" color="gray.400">
                            Não tem uma conta?{' '}
                            <Link asChild color="purple.400">
                                <RouterLink to="/register">Cadastre-se</RouterLink>
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
