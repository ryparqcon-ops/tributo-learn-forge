import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth-store';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_notifications: boolean;
  profile_public: boolean;
  show_email: boolean;
  show_phone: boolean;
  show_location: boolean;
  created_at: string;
  updated_at: string;
}

interface UpdatePreferencesData {
  email_notifications?: boolean;
  push_notifications?: boolean;
  sms_notifications?: boolean;
  marketing_notifications?: boolean;
  profile_public?: boolean;
  show_email?: boolean;
  show_phone?: boolean;
  show_location?: boolean;
}

export function useUserPreferences() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Obtener preferencias del usuario
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async (): Promise<UserPreferences | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Si no existe, crear preferencias por defecto
        if (error.code === 'PGRST116') {
          const defaultPreferences = {
            user_id: user.id,
            email_notifications: true,
            push_notifications: false,
            sms_notifications: false,
            marketing_notifications: false,
            profile_public: true,
            show_email: false,
            show_phone: false,
            show_location: false,
          };

          const { data: newPreferences, error: createError } = await supabase
            .from('user_preferences')
            .insert(defaultPreferences)
            .select()
            .single();

          if (createError) {
            console.error('Error creating preferences:', createError);
            // Si no se pueden crear preferencias, devolver valores por defecto
            return {
              id: 'default',
              user_id: user.id,
              ...defaultPreferences,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          }

          return newPreferences;
        }

        if (error.code === '42501') {
          console.warn('Permission denied for user_preferences, using default values');
          // Devolver preferencias por defecto si no hay permisos
          return {
            id: 'default',
            user_id: user.id,
            email_notifications: true,
            push_notifications: false,
            sms_notifications: false,
            marketing_notifications: false,
            profile_public: true,
            show_email: false,
            show_phone: false,
            show_location: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }

        console.error('Error fetching preferences:', error);
        throw new Error('Error al cargar las preferencias');
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Actualizar preferencias
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: UpdatePreferencesData): Promise<UserPreferences> => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const { data: updatedPreferences, error } = await supabase
        .from('user_preferences')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating preferences:', error);
        throw new Error('Error al actualizar las preferencias');
      }

      return updatedPreferences;
    },
    onSuccess: (updatedPreferences) => {
      // Actualizar el cache
      queryClient.setQueryData(['user-preferences', user?.id], updatedPreferences);
      
      toast.success("Preferencias actualizadas correctamente");
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar las preferencias";
      toast.error(errorMessage);
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
}
