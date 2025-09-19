import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  Download, 
  CheckCircle, 
  Award, 
  Globe, 
  BookOpen,
  Video,
  FileText,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import coursesData from '@/lib/data/courses.json';
import lessonsData from '@/lib/data/lessons.json';

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration_minutes: number;
  video_url: string;
  thumbnail: string;
  resources: Array<{
    type: string;
    title: string;
    url: string;
  }>;
  transcript: string;
  objectives: string[];
  order: number;
}

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  // Find course by slug
  const course = coursesData.find(c => c.slug === slug);
  const courseLessons = (lessonsData as Lesson[]).filter(l => course?.lessons.includes(l.id));

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
          <p className="text-muted-foreground">El curso que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Course Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="capitalize bg-card/20 text-white border-border/30">
                  {tag}
                </Badge>
              ))}
            </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                  {course.title}
                </h1>
                
                <p className="text-lg md:text-xl mb-6 md:mb-8 text-blue-100 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1 md:mb-2">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                      <span className="text-lg md:text-2xl font-bold">{formatDuration(course.duration_minutes)}</span>
                    </div>
                    <p className="text-xs md:text-sm text-blue-100">Duración total</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1 md:mb-2">
                      <BookOpen className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                      <span className="text-lg md:text-2xl font-bold">{courseLessons.length}</span>
                    </div>
                    <p className="text-xs md:text-sm text-blue-100">Lecciones</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1 md:mb-2">
                      <Users className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                      <span className="text-lg md:text-2xl font-bold">{course.students_enrolled}</span>
                    </div>
                    <p className="text-xs md:text-sm text-blue-100">Estudiantes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1 md:mb-2">
                      <Star className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 fill-current" />
                      <span className="text-lg md:text-2xl font-bold">{course.rating}</span>
                    </div>
                    <p className="text-xs md:text-sm text-blue-100">Calificación</p>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                  {/* Price Section - Centered */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-4xl md:text-5xl font-bold text-white">
                        {formatPrice(course.price_cents, course.currency)}
                      </span>
                      <span className="text-sm text-blue-200 line-through opacity-75">
                        S/ 399.00
                      </span>
                      <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                        -30%
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-200">Pago único • Acceso de por vida</p>
                  </div>
                  
                  {/* Benefits Section - Centered */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                    {course.certificate && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 min-w-0 flex-1 sm:flex-none">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-sm font-medium text-white">Certificado incluido</p>
                          <p className="text-xs text-blue-200">Al completar el curso</p>
                        </div>
                      </div>
                    )}
                    {course.lifetime_access && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 min-w-0 flex-1 sm:flex-none">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Globe className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-sm font-medium text-white">Acceso de por vida</p>
                          <p className="text-xs text-blue-200">Sin límite de tiempo</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* CTA Button - Centered */}
                  <div className="text-center mb-4">
                    <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-base md:text-lg px-8 md:px-12 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Inscribirse Ahora
                      </span>
                    </Button>
                  </div>
                  
                  {/* Additional benefits - Centered */}
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-200">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Garantía 30 días</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Acceso inmediato</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Soporte 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Course Thumbnail */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative order-first lg:order-last"
              >
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 sm:h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button size="lg" className="bg-card/90 text-foreground hover:bg-card text-sm md:text-base">
                      <Play className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      Ver Preview
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                  <TabsTrigger value="overview" className="text-xs md:text-sm py-2">Resumen</TabsTrigger>
                  <TabsTrigger value="curriculum" className="text-xs md:text-sm py-2">Contenido</TabsTrigger>
                  <TabsTrigger value="instructor" className="text-xs md:text-sm py-2">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-xs md:text-sm py-2">Reseñas</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 md:mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">¿Qué aprenderás en este curso?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                        {courseLessons.map((lesson, index) => (
                          <div key={lesson.id} className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-sm md:text-base">{lesson.title}</h4>
                              <p className="text-xs md:text-sm text-muted-foreground">{lesson.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4 md:mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">Requisitos del curso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm md:text-base">Conocimientos básicos de contabilidad</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm md:text-base">Acceso a internet estable</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm md:text-base">Dispositivo con audio y video</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contenido del curso</CardTitle>
                      <p className="text-muted-foreground">
                        {courseLessons.length} lecciones • {formatDuration(course.duration_minutes)} de contenido
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courseLessons
                          .sort((a, b) => a.order - b.order)
                          .map((lesson, index) => (
                          <div key={lesson.id} className="border rounded-lg p-4 hover:bg-card/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {formatDuration(lesson.duration_minutes)}
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Play className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {lesson.resources && lesson.resources.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex flex-wrap gap-2">
                                  {lesson.resources.map((resource, resIndex) => (
                                    <Button key={resIndex} variant="outline" size="sm">
                                      <Download className="h-4 w-4 mr-2" />
                                      {resource.title}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conoce a tu instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={course.instructor.avatar} />
                          <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{course.instructor.name}</h3>
                          <p className="text-lg text-muted-foreground mb-2">{course.instructor.title}</p>
                          <p className="text-sm text-muted-foreground mb-4">{course.instructor.experience} de experiencia</p>
                          <p className="text-foreground/80 leading-relaxed">{course.instructor.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reseñas de estudiantes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Las reseñas estarán disponibles próximamente</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 md:space-y-6 order-first lg:order-last">
              {/* Price Card - Sticky on mobile */}
              <Card className="sticky top-4 md:static">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold mb-2">
                      {formatPrice(course.price_cents, course.currency)}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">Pago único • Acceso de por vida</p>
                    
                    <Button size="lg" className="w-full mb-4 text-sm md:text-base">
                      Inscribirse Ahora
                    </Button>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>✓ Garantía de 30 días</p>
                      <p>✓ Certificado de finalización</p>
                      <p>✓ Acceso móvil y de escritorio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Información del curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-muted-foreground">Nivel</span>
                    <Badge variant="outline" className="text-xs">{course.level}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-muted-foreground">Idioma</span>
                    <span className="text-xs md:text-sm">{course.language}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-muted-foreground">Duración</span>
                    <span className="text-xs md:text-sm">{formatDuration(course.duration_minutes)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-muted-foreground">Lecciones</span>
                    <span className="text-xs md:text-sm">{courseLessons.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-muted-foreground">Estudiantes</span>
                    <span className="text-xs md:text-sm">{course.students_enrolled}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-muted-foreground">Calificación</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4 fill-current text-yellow-400" />
                      <span className="text-xs md:text-sm">{course.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
