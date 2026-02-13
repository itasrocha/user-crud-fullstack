import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Stack,
    Text,
    Link,
} from '@chakra-ui/react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import type { RegisterSubmitData } from '../features/auth/components/RegisterForm';

export function RegisterPage() {
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterSubmitData) => {
        setError('');
        try {
            await register(data);
            navigate('/', { replace: true });
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { status?: number } };
                if (axiosErr.response?.status === 409) {
                    setError('Este email já está cadastrado');
                } else {
                    setError('Erro ao criar conta. Tente novamente.');
                }
            } else {
                setError('Erro ao criar conta. Tente novamente.');
            }
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
                                Criar Conta
                            </Heading>
                            <Text color="gray.400">
                                Preencha os dados para se cadastrar
                            </Text>
                        </Box>

                        <RegisterForm onSubmit={handleRegister} error={error} />

                        <Text textAlign="center" color="gray.400">
                            Já tem uma conta?{' '}
                            <Link asChild color="purple.400">
                                <RouterLink to="/login">Entrar</RouterLink>
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
