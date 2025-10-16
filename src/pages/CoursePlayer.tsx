import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock,
  BookOpen,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VideoPlayerModal } from '@/components/video/VideoPlayerModal';
import { useCourseById } from '@/hooks/use-courses';
import { useLessons } from '@/hooks/use-lessons';
import { useCompletedLessons } from '@/hooks/use-enrollments';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/lib/supabase';

import type { Lesson } from '@/lib/types/supabase';

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('🎯 CoursePlayer: courseId obtenido:', courseId);
  console.log('🎯 CoursePlayer: Componente renderizado');

  // Get course and lessons from Supabase
  const { course, loading: courseLoading, error: courseError } = useCourseById(courseId || '');
  const { lessons: courseLessons, loading: lessonsLoading, error: lessonsError } = useLessons(courseId || '');
  const { completedLessons, loading: completedLoading, error: completedError, refetch: refetchCompletedLessons, addCompletedLessonOptimistic } = useCompletedLessons(courseId || '');


  const currentLesson = courseLessons[currentLessonIndex];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleLessonComplete = async (lessonId: string) => {
    console.log('🔄 handleLessonComplete llamado con lessonId:', lessonId);
    try {
      // Import the service dynamically to avoid circular dependencies
      const { LessonProgressService } = await import('@/lib/services/enrollments');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Usuario actual:', user?.id);
      console.log('📚 CourseId:', courseId);
      
      if (!user || !courseId) {
        console.log('❌ Usuario o courseId no encontrado');
        return;
      }

      // Update UI optimistically first
      addCompletedLessonOptimistic(lessonId);
      
      // Mark lesson as completed in database
      console.log('💾 Marcando lección como completada en la base de datos...');
      await LessonProgressService.completeLesson(user.id, lessonId, courseId);
      
      console.log('✅ Lección marcada como completada:', lessonId);
      
      // No need for immediate refetch - optimistic update handles UI
      // The data will sync naturally when component remounts or user navigates
    } catch (error) {
      console.error('❌ Error al completar lección:', error);
    }
  };

  const handleLessonChange = (index: number) => {
    setCurrentLessonIndex(index);
  };

  // Calcular progreso basado en lecciones completadas, no en la lección actual
  const progress = courseLessons.length > 0 ? (completedLessons.length / courseLessons.length) * 100 : 0;

  // Loading state
  if (courseLoading || lessonsLoading || completedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (courseError || lessonsError || completedError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar el curso</h1>
          <p className="text-muted-foreground mb-4">{courseError || lessonsError || completedError}</p>
          <Button asChild>
            <Link to="/dashboard/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Cursos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
          <p className="text-muted-foreground mb-4">El curso que buscas no existe o no tienes acceso.</p>
          <Button asChild>
            <Link to="/dashboard/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Cursos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/courses">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Volver</span>
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold truncate">{course.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {courseLessons.length} lecciones disponibles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-xs">{course.level}</Badge>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% completado
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-3" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                  <img
                    src={course.thumbnail_url || '/placeholder.svg'}
                    alt={course.title}
                    className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold mb-2">{course.title}</h2>
                    <p className="text-muted-foreground mb-3 text-sm sm:text-base">{course.short_description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(course.duration_hours * 60)}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {courseLessons.length} lecciones
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Instructor</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor_name} - {course.instructor_title}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Lo que aprenderás</h3>
                    <ul className="space-y-2">
                      {courseLessons.slice(0, 3).map((lesson, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{lesson.title}</span>
                        </li>
                      ))}
                      {courseLessons.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          Y {courseLessons.length - 3} lecciones más...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson List */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-4 w-4" />
                  Contenido del curso
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {courseLessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      className={`p-3 sm:p-4 cursor-pointer transition-colors ${
                        index === currentLessonIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => {
                        setCurrentLessonIndex(index);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-medium line-clamp-2">{lesson.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(lesson.duration_minutes)}
                            </span>
                            {completedLessons.includes(lesson.id) && (
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Start Learning Button */}
        <div className="mt-6 text-center">
          <Button
            size="lg"
            className="btn-primary w-full sm:w-auto"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <Play className="h-5 w-5 mr-2" />
            Comenzar a aprender
          </Button>
        </div>
      </div>

      {/* Video Player Modal */}
      {course && courseLessons && courseLessons.length > 0 && (
        <VideoPlayerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          course={course}
          lessons={courseLessons}
          currentLessonIndex={currentLessonIndex}
          onLessonChange={handleLessonChange}
          onLessonComplete={handleLessonComplete}
          completedLessons={completedLessons}
        />
      )}
    </div>
  );
};

export default CoursePlayer;
