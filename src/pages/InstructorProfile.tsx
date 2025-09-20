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
import instructorsData from '@/lib/data/instructors.json';
import coursesData from '@/lib/data/courses.json';

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

  // Find instructor by id
  const instructor = instructorsData.find(i => i.id === id) as Instructor;
  
  // Find courses taught by this instructor
  const instructorCourses = coursesData.filter(c => c.instructor.id === id);

  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Instructor no encontrado</h1>
          <p className="text-muted-foreground mb-6">El instructor que buscas no existe o ha sido eliminado.</p>
          <Link to="/courses">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Cursos
            </Button>
          </Link>
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
            <Link to="/courses" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Cursos
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
                    {instructor.name}
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
                    <AvatarImage src={instructor.avatar_url} alt={instructor.name} />
                    <AvatarFallback className="text-4xl">
                      {instructor.name.split(' ').map(n => n[0]).join('')}
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
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                  <TabsTrigger value="overview" className="text-xs md:text-sm py-2">Resumen</TabsTrigger>
                  <TabsTrigger value="courses" className="text-xs md:text-sm py-2">Cursos</TabsTrigger>
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
                    <h3 className="text-xl font-semibold mb-4">Cursos de {instructor.name}</h3>
                    {instructorCourses.length > 0 ? (
                      <div className="grid gap-4">
                        {instructorCourses.map((course) => (
                          <Card key={course.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row gap-4">
                                <img 
                                  src={course.thumbnail} 
                                  alt={course.title}
                                  className="w-full md:w-32 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
                                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.summary}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {formatDuration(course.duration_minutes)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {course.students_enrolled} estudiantes
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
                                      {formatPrice(course.price_cents, course.currency)}
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
                                <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                                <p className="text-foreground/80">{exp.description}</p>
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
                                  <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
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
                                <p className="text-primary font-medium">{edu.institution}</p>
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


