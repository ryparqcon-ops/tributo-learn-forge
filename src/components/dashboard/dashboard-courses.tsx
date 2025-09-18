import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Play, Clock, CheckCircle, BookOpen, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

export function DashboardCourses() {
  const { data: courses } = useQuery({
    queryKey: ['user-courses'],
    queryFn: async () => {
      // Mock enrolled courses with progress
      return [
        {
          id: "course_tax_fundamentals",
          title: "Fundamentos Tributarios para Pymes",
          slug: "fundamentos-tributarios-pymes",
          instructor: { name: "Arash" },
          thumbnail: "https://placehold.co/400x225/10B981/FFFFFF?text=Curso+1",
          progress: 65,
          totalLessons: 12,
          completedLessons: 8,
          nextLesson: {
            id: "lesson_9",
            title: "Régimen MYPE Tributario",
            duration: 25
          },
          lastAccessed: "2024-01-15",
          timeSpent: 180 // minutes
        },
        {
          id: "course_advanced_vat",
          title: "IVA Avanzado: Casos y Jurisprudencia",
          slug: "iva-avanzado",
          instructor: { name: "Andrea" },
          thumbnail: "https://placehold.co/400x225/F59E0B/FFFFFF?text=Curso+2",
          progress: 30,
          totalLessons: 8,
          completedLessons: 3,
          nextLesson: {
            id: "lesson_4",
            title: "Exoneraciones y Inafectaciones",
            duration: 35
          },
          lastAccessed: "2024-01-10",
          timeSpent: 90
        }
      ];
    },
  });

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47%</div>
            <Progress value={47} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              11 de 20 lecciones completadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h 30m</div>
            <p className="text-xs text-muted-foreground">
              Esta semana: 2h 15m
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              En progreso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cursos Inscritos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses?.map((course: any, index: number) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover-lift">
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
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {course.progress}%
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      Por {course.instructor.name}
                    </p>
                    
                    <div className="space-y-2">
                      <Progress value={course.progress} className="h-2" />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                        <span>{formatTimeSpent(course.timeSpent)} estudiadas</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs">
                        <p className="text-muted-foreground">Siguiente:</p>
                        <p className="font-medium">{course.nextLesson.title}</p>
                      </div>
                      <Button size="sm" className="btn-primary" asChild>
                        <Link to={`/dashboard/course/${course.id}`}>
                          <Play className="h-3 w-3 mr-1" />
                          Continuar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/courses">
                <BookOpen className="h-6 w-6" />
                <span>Explorar Cursos</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/dashboard/advisory">
                <Clock className="h-6 w-6" />
                <span>Reservar Asesoría</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <CheckCircle className="h-6 w-6" />
              <span>Ver Certificados</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}