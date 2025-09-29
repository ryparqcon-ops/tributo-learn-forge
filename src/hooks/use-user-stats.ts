import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth-store';
import { supabase } from '@/lib/supabase';

interface UserStats {
  totalHoursStudied: number;
  coursesCompleted: number;
  averageProgress: number;
  totalEnrollments: number;
  totalAdvisorySessions: number;
  completedAdvisorySessions: number;
}

export function useUserStats() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async (): Promise<UserStats> => {
      if (!user?.id) {
        return {
          totalHoursStudied: 0,
          coursesCompleted: 0,
          averageProgress: 0,
          totalEnrollments: 0,
          totalAdvisorySessions: 0,
          completedAdvisorySessions: 0,
        };
      }

      try {
        // Obtener estadísticas de cursos
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            progress_percentage,
            course:courses (
              id,
              duration_hours
            )
          `)
          .eq('student_id', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        // Obtener estadísticas de asesorías
        const { data: advisorySessions, error: advisoryError } = await supabase
          .from('consultation_sessions')
          .select('id, status, duration_hours')
          .eq('student_id', user.id);

        if (advisoryError) {
          console.error('Error fetching advisory sessions:', advisoryError);
        }

        // Calcular estadísticas de cursos
        const totalEnrollments = enrollments?.length || 0;
        const coursesCompleted = enrollments?.filter(e => e.progress_percentage >= 100).length || 0;
        const totalHoursStudied = enrollments?.reduce((total, enrollment) => {
          const courseHours = enrollment.course?.duration_hours || 0;
          const progress = enrollment.progress_percentage || 0;
          return total + (courseHours * progress / 100);
        }, 0) || 0;
        
        const averageProgress = totalEnrollments > 0 
          ? Math.round(enrollments?.reduce((total, e) => total + (e.progress_percentage || 0), 0) / totalEnrollments)
          : 0;

        // Calcular estadísticas de asesorías
        const totalAdvisorySessions = advisorySessions?.length || 0;
        const completedAdvisorySessions = advisorySessions?.filter(s => s.status === 'completed').length || 0;

        return {
          totalHoursStudied: Math.round(totalHoursStudied),
          coursesCompleted,
          averageProgress,
          totalEnrollments,
          totalAdvisorySessions,
          completedAdvisorySessions,
        };
      } catch (error) {
        console.error('Error calculating user stats:', error);
        return {
          totalHoursStudied: 0,
          coursesCompleted: 0,
          averageProgress: 0,
          totalEnrollments: 0,
          totalAdvisorySessions: 0,
          completedAdvisorySessions: 0,
        };
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
