import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  GraduationCap,
  Briefcase,
  Globe,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  ExternalLink,
  MessageCircle,
  CheckCircle,
  Calendar,
  MapPin,
  Languages,
  TrendingUp,
  Shield,
  Target,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useInstructor } from '@/hooks/use-instructors';
import { useCourses } from '@/hooks/use-courses';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { InstructorWithProfile } from '@/lib/types/supabase';

interface Instructor {
  id: string;
  name: string;
  title: string;
  experience_years: number;
  avatar_url: string;
  bio: string;
  specializations: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  work_experience: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
  }>;
  social_links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    youtube?: string;
    github?: string;
  };
  teaching_style: string;
  languages: string[];
  rating: number;
  total_students: number;
  total_courses: number;
  total_hours_taught: number;
  response_time_hours: number;
  is_verified: boolean;
  is_featured: boolean;
}

const InstructorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  // Obtener instructor de Supabase
  const { instructor, loading: instructorLoading, error: instructorError } = useInstructor(id || '');
  
  // Obtener todos los cursos para filtrar los del instructor
  const { courses } = useCourses();
  
  // Filtrar cursos del instructor
  const instructorCourses = courses?.filter(c => c.instructor_id === id) || [];

  // Loading state
  if (instructorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (instructorError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar instructor</h1>
          <p className="text-muted-foreground mb-6">{instructorError}</p>
          <Link to="/instructors">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Instructores
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not found state
  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Instructor no encontrado</h1>
          <p className="text-muted-foreground mb-6">El instructor que buscas no existe o ha sido eliminado.</p>
          <Link to="/instructors">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Instructores
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDuration = (hours: number) => {
    if (hours >= 1) {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      if (minutes > 0) {
        return `${wholeHours}h ${minutes}m`;
      }
      return `${wholeHours}h`;
    }
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  };

  const formatPrice = (price: string | number, currency: string) => {
    const amount = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'github': return <Github className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link to="/instructors" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Instructores
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Instructor Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Verification Badge */}
                  {instructor.is_verified && (
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400 font-medium">Instructor Verificado</span>
                    </div>
                  )}

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {instructor.full_name}
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-blue-100 mb-4">
                    {instructor.title}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="h-5 w-5 mr-2 fill-current text-yellow-400" />
                        <span className="text-2xl font-bold">{instructor.rating}</span>
                      </div>
                      <p className="text-sm text-blue-100">Calificación</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-5 w-5 mr-2" />
                        <span className="text-2xl font-bold">{instructor.total_students.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-blue-100">Estudiantes</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <BookOpen className="h-5 w-5 mr-2" />
                        <span className="text-2xl font-bold">{instructor.total_courses}</span>
                      </div>
                      <p className="text-sm text-blue-100">Cursos</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="text-2xl font-bold">{instructor.total_hours_taught}</span>
                      </div>
                      <p className="text-sm text-blue-100">Horas enseñadas</p>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {instructor.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="bg-white/20 text-white border-border/30">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-lg text-blue-100 leading-relaxed mb-6">
                    {instructor.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(instructor.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-colors"
                      >
                        {getSocialIcon(platform)}
                        <span className="capitalize">{platform}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Instructor Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <Avatar className="h-48 w-48 lg:h-56 lg:w-56 border-4 border-white/20">
                    <AvatarImage src={instructor.avatar_url || undefined} alt={instructor.full_name} />
                    <AvatarFallback className="text-4xl">
                      {instructor.full_name?.split(' ').map(n => n[0]).join('') || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  {instructor.is_featured && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-2">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
                  <TabsTrigger value="overview" className="text-xs md:text-sm py-2">Resumen</TabsTrigger>
                  <TabsTrigger value="courses" className="text-xs md:text-sm py-2">Cursos</TabsTrigger>
                  <TabsTrigger value="consultations" className="text-xs md:text-sm py-2">Asesorías</TabsTrigger>
                  <TabsTrigger value="experience" className="text-xs md:text-sm py-2">Experiencia</TabsTrigger>
                  <TabsTrigger value="education" className="text-xs md:text-sm py-2">Educación</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-8">
                  <div className="space-y-6">
                    {/* Teaching Style */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Estilo de Enseñanza
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 leading-relaxed">{instructor.teaching_style}</p>
                      </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Languages className="h-5 w-5" />
                          Idiomas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {instructor.languages.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Response Time */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="h-5 w-5" />
                          Tiempo de Respuesta
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{instructor.response_time_hours} horas</span>
                          <span className="text-sm text-muted-foreground">en promedio</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="mt-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Cursos de {instructor.full_name}</h3>
                    {instructorCourses.length > 0 ? (
                      <div className="grid gap-4">
                        {instructorCourses.map((course) => (
                          <Card key={course.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row gap-4">
                                <img 
                                  src={course.thumbnail_url || '/placeholder.svg'} 
                                  alt={course.title}
                                  className="w-full md:w-32 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
                                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.short_description}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {formatDuration(course.duration_hours)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {course.total_enrollments} estudiantes
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                                      {course.rating}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">
                                      {formatPrice(course.price, course.currency)}
                                    </div>
                                    <Badge variant="outline" className="mt-1">{course.level}</Badge>
                                  </div>
                                  <Link to={`/course/${course.slug}`}>
                                    <Button size="sm" className="mt-2">
                                      Ver Curso
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay cursos disponibles aún</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="consultations" className="mt-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Asesorías Disponibles</h3>
                    
                    {/* Consultation Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="h-5 w-5" />
                          Información de Asesorías
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Tiempo de respuesta</span>
                            <span className="font-medium">{instructor.response_time_hours} horas</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Disponibilidad</span>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Disponible
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Especialidades</span>
                            <div className="flex flex-wrap gap-1">
                              {instructor.specializations.map((spec) => (
                                <Badge key={spec} variant="secondary" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Consultation Types */}
                    <div className="grid gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2">Consulta General</h4>
                              <p className="text-muted-foreground mb-3">
                                Asesoría personalizada sobre temas de tributación y contabilidad fiscal.
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>1 hora</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>Individual</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Globe className="h-4 w-4" />
                                  <span>Online</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Button size="sm" className="mb-2">
                                Solicitar Asesoría
                              </Button>
                              <p className="text-sm text-muted-foreground">
                                Precio a consultar
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Target className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2">Revisión de Casos</h4>
                              <p className="text-muted-foreground mb-3">
                                Análisis detallado de casos específicos de tributación empresarial.
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>2 horas</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>Individual</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Globe className="h-4 w-4" />
                                  <span>Online</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Button size="sm" className="mb-2">
                                Solicitar Asesoría
                              </Button>
                              <p className="text-sm text-muted-foreground">
                                Precio a consultar
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Contact Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Cómo Solicitar una Asesoría
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <div>
                              <p className="font-medium">Selecciona el tipo de asesoría</p>
                              <p className="text-sm text-muted-foreground">Elige entre consulta general o revisión de casos</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">2</span>
                            </div>
                            <div>
                              <p className="font-medium">Completa el formulario</p>
                              <p className="text-sm text-muted-foreground">Proporciona detalles sobre tu consulta</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">3</span>
                            </div>
                            <div>
                              <p className="font-medium">Coordina la cita</p>
                              <p className="text-sm text-muted-foreground">El instructor te contactará en un plazo de {instructor.response_time_hours} horas</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="mt-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Experiencia Profesional</h3>
                    <div className="space-y-4">
                      {instructor.work_experience.map((exp, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Briefcase className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{exp.position}</h4>
                                <p className="text-primary font-medium">{exp.company}</p>
                                <p className="text-sm text-muted-foreground mb-2">{exp.years} años de experiencia</p>
                                <p className="text-foreground/80">Experiencia profesional en {exp.company}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Certificaciones</h3>
                      <div className="grid gap-3">
                        {instructor.certifications.map((cert, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Award className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-medium">{cert.name}</h4>
                                  <p className="text-sm text-muted-foreground">{cert.year}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="education" className="mt-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Formación Académica</h3>
                    <div className="space-y-4">
                      {instructor.education.map((edu, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{edu.degree}</h4>
                                <p className="text-primary font-medium">{edu.university}</p>
                                <p className="text-sm text-muted-foreground">{edu.year}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contactar Instructor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Respuesta promedio: {instructor.response_time_hours} horas
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experiencia</span>
                    <span className="font-medium">{instructor.experience_years} años</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estudiantes</span>
                    <span className="font-medium">{instructor.total_students.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cursos</span>
                    <span className="font-medium">{instructor.total_courses}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Horas enseñadas</span>
                    <span className="font-medium">{instructor.total_hours_taught}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Calificación</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specializations Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Especializaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
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

export default InstructorProfile;












