import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, BookOpen, BarChart3, Star, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useDashboard } from '@/hooks/use-dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useMemo } from 'react';

export function DashboardCourses() {
  const { courses: coursesWithProgress, stats, loading, error } = useDashboard();

  const formatTimeSpent = useMemo(() => (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, []);

  // Memoize the course cards to prevent unnecessary re-renders
  const courseCards = useMemo(() => {
    return coursesWithProgress.map((course, index: number) => (
      <motion.div
        key={course.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <Card className="hover-lift mx-2 sm:mx-0">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={course.thumbnail_url || '/placeholder.svg'}
                  alt={course.title}
                  className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm leading-tight pr-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {course.level}
                      </Badge>
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {course.progress}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs text-muted-foreground">
                      Por {course.instructor_name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <Progress value={course.progress} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                  <span>{formatTimeSpent(course.timeSpent)} estudiadas</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs">
                  {course.nextLesson ? (
                    <>
                      <p className="text-muted-foreground">Siguiente:</p>
                      <p className="font-medium line-clamp-1">{course.nextLesson.title}</p>
                    </>
                  ) : (
                    <p className="text-green-600 font-medium">¡Curso completado!</p>
                  )}
                </div>
                <Button size="sm" className="btn-primary w-full text-xs" asChild>
                  <Link to={`/dashboard/course/${course.id}`}>
                    <Play className="h-3 w-3 mr-1" />
                    {course.nextLesson ? 'Continuar' : 'Repasar'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="flex">
              <div className="w-32 h-24 flex-shrink-0">
                <img
                  src={course.thumbnail_url || '/placeholder.svg'}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {course.progress}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs text-muted-foreground">
                    Por {course.instructor_name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{course.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={course.progress} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                    <span>{formatTimeSpent(course.timeSpent)} estudiadas</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs">
                    {course.nextLesson ? (
                      <>
                        <p className="text-muted-foreground">Siguiente:</p>
                        <p className="font-medium">{course.nextLesson.title}</p>
                      </>
                    ) : (
                      <p className="text-green-600 font-medium">¡Curso completado!</p>
                    )}
                  </div>
                  <Button size="sm" className="btn-primary" asChild>
                    <Link to={`/dashboard/course/${course.id}`}>
                      <Play className="h-3 w-3 mr-1" />
                      {course.nextLesson ? 'Continuar' : 'Repasar'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    ));
  }, [coursesWithProgress, formatTimeSpent]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">Error al cargar los cursos</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Cursos</h1>
        <Button asChild>
          <Link to="/courses">
            <BookOpen className="h-4 w-4 mr-2" />
            Explorar más cursos
          </Link>
        </Button>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Progreso Total</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.overallProgress}%</div>
            <Progress value={stats.overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedLessons} de {stats.totalLessons} lecciones completadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatTimeSpent(stats.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Tiempo estudiado
            </p>
          </CardContent>
        </Card>

        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Cursos Activos</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.inProgressCourses}</div>
            <p className="text-xs text-muted-foreground">
              En progreso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold px-2 sm:px-0">Cursos Inscritos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {coursesWithProgress.length === 0 ? (
            <div className="col-span-2 text-center py-12 px-4">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes cursos inscritos</h3>
              <p className="text-muted-foreground mb-4">
                Explora nuestra colección de cursos y comienza tu aprendizaje
              </p>
              <Button asChild>
                <Link to="/courses">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explorar Cursos
                </Link>
              </Button>
            </div>
          ) : (
            courseCards
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mx-2 sm:mx-0">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/courses">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Explorar Cursos</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/dashboard/advisory">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Reservar Asesoría</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-sm sm:text-base">Ver Certificados</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}