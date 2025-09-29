import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth-store';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  company?: string;
  position?: string;
  website?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  company?: string;
  position?: string;
  website?: string;
  avatar_url?: string;
}

export function useUserProfile() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Obtener perfil del usuario
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Error al cargar el perfil del usuario');
      }

      // Agregar el email del usuario autenticado
      return {
        ...data,
        email: user.email || '',
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Actualizar perfil del usuario
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<UserProfile> => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw new Error('Error al actualizar el perfil');
      }

      return updatedProfile;
    },
    onSuccess: (updatedProfile) => {
      // Actualizar el cache
      queryClient.setQueryData(['user-profile', user?.id], updatedProfile);
      
      // Actualizar el store de autenticación
      useAuthStore.getState().updateUser({
        name: updatedProfile.full_name,
        email: user?.email || '', // Usar email del usuario autenticado
        phone: updatedProfile.phone,
        location: updatedProfile.location,
        bio: updatedProfile.bio,
        company: updatedProfile.company,
        position: updatedProfile.position,
        website: updatedProfile.website,
        avatar: updatedProfile.avatar_url,
        role: updatedProfile.role,
      });

      toast.success("Perfil actualizado correctamente");
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el perfil";
      toast.error(errorMessage);
    },
  });

  // Actualizar contraseña
  const updatePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        throw new Error('Error al actualizar la contraseña');
      }
    },
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar la contraseña";
      toast.error(errorMessage);
    },
  });

  // Eliminar cuenta
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      // Primero eliminar el perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw new Error('Error al eliminar el perfil');
      }

      // Luego eliminar la cuenta de autenticación
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

      if (authError) {
        console.error('Error deleting auth user:', authError);
        throw new Error('Error al eliminar la cuenta de autenticación');
      }
    },
    onSuccess: () => {
      // Cerrar sesión
      useAuthStore.getState().logout();
      toast.success("Cuenta eliminada correctamente");
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar la cuenta";
      toast.error(errorMessage);
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    updatePassword: updatePasswordMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isUpdatingPassword: updatePasswordMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
  };
}
