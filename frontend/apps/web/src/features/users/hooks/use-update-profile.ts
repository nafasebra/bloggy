import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadUserAvatar } from '@/features/users/lib/avatar';
import { queryKeys } from '@/shared/lib/query-keys';
import { UserService } from '@/features/users/api/user.services';
import type { EditProfileFormData } from '@/features/users/schemas/edit-profile';
import { toast } from 'sonner';

type UpdateProfileInput = {
  userId: string;
  data: EditProfileFormData;
  avatarFile?: File | null;
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data, avatarFile }: UpdateProfileInput) => {
      if (avatarFile) {
        await uploadUserAvatar(userId, avatarFile);
      }

      return UserService.updateUser(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userMe() });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    },
  });
}
