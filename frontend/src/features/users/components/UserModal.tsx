import { Button, Input, Stack, Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { ModalTemplate } from "../../../components/templates/ModalTemplate";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import type { User, UserCreate, UserUpdate } from "../types/user";

// Combine Create and Update types for the form, making password optional for updates
interface UserFormData extends Omit<UserCreate, 'password'> {
  password?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

export function UserModal({ isOpen, onClose, userToEdit }: UserModalProps) {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditing = !!userToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset({
          name: userToEdit.name,
          email: userToEdit.email,
          password: ""
        });
      } else {
        reset({ name: "", email: "", password: "" });
      }
    }
  }, [isOpen, userToEdit, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && userToEdit) {
        const updateData: UserUpdate = {
          name: data.name,
          email: data.email,
        };
        if (data.password) {
            updateData.password = data.password;
        }

        await updateUserMutation.mutateAsync({ id: userToEdit.id, data: updateData });
      } else {
        // Cast to UserCreate because password is required for creation
        await createUserMutation.mutateAsync(data as UserCreate);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <ModalTemplate
      title={isEditing ? "Editar Usuário" : "Criar Novo Usuário"}
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="user-form"
            colorPalette="purple"
            loading={isLoading}
          >
            {isEditing ? "Salvar Alterações" : "Criar Usuário"}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
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
    </ModalTemplate>
  );
}