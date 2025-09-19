import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, BookOpen, BarChart3, Star, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth-store';
import coursesData from '@/lib/data/courses.json';
import lessonsData from '@/lib/data/lessons.json';

export function DashboardCourses() {
  const { user } = useAuthStore();
  
  // Get enrolled courses from user data
  const enrolledCourseIds = user?.enrolled || [];
  const enrolledCourses = coursesData.filter(course => enrolledCourseIds.includes(course.id));
  
  // Calculate progress and get lesson data
  const coursesWithProgress = enrolledCourses.map(course => {
    const courseLessons = (lessonsData as any[]).filter(l => course.lessons.includes(l.id));
    const totalLessons = courseLessons.length;
    const progress = user?.progress?.[course.id] || 0;
    const completedLessons = Math.floor((progress / 100) * totalLessons);
    
    // Get next lesson
    const nextLesson = courseLessons.find(lesson => 
      courseLessons.indexOf(lesson) === completedLessons
    );
    
    return {
      ...course,
      totalLessons,
      completedLessons,
      progress,
      nextLesson: nextLesson ? {
        id: nextLesson.id,
        title: nextLesson.title,
        duration: nextLesson.duration_minutes
      } : null,
      lastAccessed: "2024-01-15", // Mock data
      timeSpent: Math.floor(course.duration_minutes * (progress / 100)) // Calculate based on progress
    };
  });

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Calculate overall statistics
  const totalLessons = coursesWithProgress.reduce((sum, course) => sum + course.totalLessons, 0);
  const completedLessons = coursesWithProgress.reduce((sum, course) => sum + course.completedLessons, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalTimeSpent = coursesWithProgress.reduce((sum, course) => sum + course.timeSpent, 0);

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
            <div className="text-xl sm:text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedLessons} de {totalLessons} lecciones completadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatTimeSpent(totalTimeSpent)}</div>
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
            <div className="text-xl sm:text-2xl font-bold">{coursesWithProgress.length}</div>
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
            coursesWithProgress.map((course: any, index: number) => (
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
                          src={course.thumbnail}
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
                              Por {course.instructor.name}
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
                          src={course.thumbnail}
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
                            Por {course.instructor.name}
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
            ))
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