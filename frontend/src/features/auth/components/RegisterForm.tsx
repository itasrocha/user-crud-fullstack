import { useForm } from "react-hook-form";
import { Button, Input, Stack, Text, Field } from "@chakra-ui/react";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterSubmitData {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterSubmitData) => Promise<void>;
  error?: string;
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const handleFormSubmit = ({ name, email, password }: RegisterFormData) => {
    return onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap={4}>
        <Field.Root invalid={!!errors.name}>
          <Field.Label color="gray.300">Nome</Field.Label>
          <Input
            type="text"
            {...register("name", {
              required: "Nome é obrigatório",
              minLength: { value: 3, message: "Mínimo de 3 caracteres" },
            })}
            placeholder="Seu nome completo"
            bg="gray.700"
            border="none"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

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
            {...register("password", {
              required: "Senha é obrigatória",
              minLength: { value: 8, message: "Mínimo de 8 caracteres" },
            })}
            placeholder="Mínimo 8 caracteres"
            bg="gray.700"
            border="none"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label color="gray.300">Confirmar Senha</Field.Label>
          <Input
            type="password"
            {...register("confirmPassword", {
              required: "Confirmação é obrigatória",
              validate: (value) =>
                value === password || "As senhas não coincidem",
            })}
            placeholder="Repita a senha"
            bg="gray.700"
            border="none"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
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
          loadingText="Criando conta..."
        >
          Cadastrar
        </Button>
      </Stack>
    </form>
  );
}
