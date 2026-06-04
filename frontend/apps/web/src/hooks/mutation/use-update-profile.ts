import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadUserAvatar } from '@/lib/avatar';
import { queryKeys } from '@/constants/key-query';
import { UserService } from '@/services/user.services';
import type { EditProfileFormData } from '@/lib/schemas/edit-profile';
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
