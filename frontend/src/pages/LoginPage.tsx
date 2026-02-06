import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Heading,
    Input,
    Stack,
    Text,
    Link,
    Field,
} from '@chakra-ui/react';
import { useAuth } from '../features/auth/hooks/useAuth';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError('Email ou senha inválidos');
        } finally {
            setIsLoading(false);
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

                        <form onSubmit={handleSubmit}>
                            <Stack gap={4}>
                                <Field.Root>
                                    <Field.Label color="gray.300">Email</Field.Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        bg="gray.700"
                                        border="none"
                                        color="white"
                                        _placeholder={{ color: 'gray.500' }}
                                        required
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label color="gray.300">Senha</Field.Label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        bg="gray.700"
                                        border="none"
                                        color="white"
                                        _placeholder={{ color: 'gray.500' }}
                                        required
                                    />
                                </Field.Root>

                                {error && (
                                    <Text color="red.400" fontSize="sm" textAlign="center">
                                        {error}
                                    </Text>
                                )}

                                <Button
                                    type="submit"
                                    colorPalette="purple"
                                    size="lg"
                                    width="full"
                                    loading={isLoading}
                                    loadingText="Entrando..."
                                >
                                    Entrar
                                </Button>
                            </Stack>
                        </form>

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
