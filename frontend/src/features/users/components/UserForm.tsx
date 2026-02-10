import { Button, Input, Stack, Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { UserCreate } from "../types/user";

export interface UserFormData extends Omit<UserCreate, 'password'> {
  password?: string;
}

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading: boolean;
  submitLabel: string;
  isEditing?: boolean;
  onCancel: () => void;
  formId?: string;
}

export function UserForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
  isEditing = false,
  onCancel,
  formId = "user-form",
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      ...defaultValues,
    },
  });

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4" pb="4">
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Nome</Field.Label>
            <Input
              {...register("name", { required: "Nome é obrigatório" })}
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              {...register("email", { required: "Email é obrigatório" })}
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>
              {isEditing ? "Nova Senha (Opcional)" : "Senha"}
            </Field.Label>
            <Input
              type="password"
              {...register("password", {
                required: isEditing ? false : "Senha é obrigatória",
                minLength: { value: 8, message: "Mínimo de 8 caracteres" },
              })}
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>
      </form>

      <Stack direction="row" justify="flex-end" pt="4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form={formId}
          colorPalette="purple"
          loading={isLoading}
        >
          {submitLabel}
        </Button>
      </Stack>
    </>
  );
}
