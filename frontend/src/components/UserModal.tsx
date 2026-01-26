import { Button, Dialog, Input, Stack, Field, Portal } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import api from "../api/axios";

interface UserFormData {
  name: string;
  email: string;
  password: string;
}

interface UserModalProps {
  onSuccess: () => void;
}

export function UserModal({ onSuccess }: UserModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      await api.post("/users/", data);
      reset();
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar usuário", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="purple" variant="solid">
          <FaPlus /> Novo Usuário
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Criar Novo Usuário</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4" pb="4">
                  <Field.Root invalid={!!errors.name}>
                    <Field.Label>Nome</Field.Label>
                    <Input
                      placeholder="Hakurei Reimu"
                      {...register("name", { required: "Nome é obrigatório" })}
                    />
                    <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      placeholder="donations-wanted@hakurei.jp"
                      {...register("email", { required: "Email é obrigatório" })}
                    />
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.password}>
                    <Field.Label>Senha</Field.Label>
                    <Input
                      type="password"
                      placeholder="******"
                      {...register("password", {
                        required: "Senha é obrigatória",
                        minLength: { value: 8, message: "Mínimo de 8 caracteres" },
                      })}
                    />
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                  </Field.Root>
                </Stack>
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="user-form"
                colorPalette="teal"
                loading={isSubmitting}
              >
                Salvar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}