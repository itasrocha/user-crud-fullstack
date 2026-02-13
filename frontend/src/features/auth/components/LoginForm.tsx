import { useForm } from "react-hook-form";
import { Button, Input, Stack, Text, Field } from "@chakra-ui/react";
import type { LoginCredentials } from "../types/types";

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  error?: string;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <Field.Root invalid={!!errors.email}>
          <Field.Label color="gray.300">Email</Field.Label>
          <Input
            type="email"
            {...register("email", { required: "Email é obrigatório" })}
            placeholder="seu@email.com"
            bg="gray.700"
            border="none"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label color="gray.300">Senha</Field.Label>
          <Input
            type="password"
            {...register("password", { required: "Senha é obrigatória" })}
            placeholder="••••••••"
            bg="gray.700"
            border="none"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
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
          loading={isSubmitting}
          loadingText="Entrando..."
        >
          Entrar
        </Button>
      </Stack>
    </form>
  );
}
