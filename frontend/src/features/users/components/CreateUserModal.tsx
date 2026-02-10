import { ModalTemplate } from "../../../components/templates/ModalTemplate";
import { useCreateUser } from "../hooks/useCreateUser";
import { UserForm, type UserFormData } from "./UserForm";
import type { UserCreate } from "../types/user";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const createUserMutation = useCreateUser();

  const handleSubmit = async (data: UserFormData) => {
    try {
      await createUserMutation.mutateAsync(data as UserCreate);
      onClose();
    } catch (error) {
      console.error("Erro ao criar usuário", error);
    }
  };

  return (
    <ModalTemplate
      title="Criar Novo Usuário"
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      footer={null}
    >
      <UserForm
        onSubmit={handleSubmit}
        isLoading={createUserMutation.isPending}
        submitLabel="Criar Usuário"
        onCancel={onClose}
        isEditing={false}
      />
    </ModalTemplate>
  );
}
