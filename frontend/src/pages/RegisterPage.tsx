import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            await register({ name, email, password });
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
                                Criar Conta
                            </Heading>
                            <Text color="gray.400">
                                Preencha os dados para se cadastrar
                            </Text>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Stack gap={4}>
                                <Field.Root>
                                    <Field.Label color="gray.300">Nome</Field.Label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Seu nome completo"
                                        bg="gray.700"
                                        border="none"
                                        color="white"
                                        _placeholder={{ color: 'gray.500' }}
                                        minLength={3}
                                        required
                                    />
                                </Field.Root>

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
                                        placeholder="Mínimo 8 caracteres"
                                        bg="gray.700"
                                        border="none"
                                        color="white"
                                        _placeholder={{ color: 'gray.500' }}
                                        required
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label color="gray.300">Confirmar Senha</Field.Label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repita a senha"
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
                                    loadingText="Criando conta..."
                                >
                                    Cadastrar
                                </Button>
                            </Stack>
                        </form>

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
