import { ModalTemplate } from "../../../components/templates/ModalTemplate";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { UserForm, type UserFormData } from "./UserForm";
import type { User, UserUpdate } from "../types/user";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User;
}

export function UpdateUserModal({ isOpen, onClose, userToEdit }: UpdateUserModalProps) {
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (data: UserFormData) => {
    try {
      const updateData: UserUpdate = {
        name: data.name,
        email: data.email,
      };
      if (data.password) {
        updateData.password = data.password;
      }

      await updateUserMutation.mutateAsync({ id: userToEdit.id, data: updateData });
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar usuário", error);
    }
  };

  return (
    <ModalTemplate
      title="Editar Usuário"
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      footer={null}
    >
        <UserForm
          key={userToEdit.id} 
          defaultValues={{
            name: userToEdit.name,
            email: userToEdit.email,
          }}
          onSubmit={handleSubmit}
          isLoading={updateUserMutation.isPending}
          submitLabel="Salvar Alterações"
          isEditing={true}
          onCancel={onClose}
        />
    </ModalTemplate>
  );
}
