import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, BookOpen, Clock, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import instructorsData from '@/lib/data/instructors.json';

interface Instructor {
  id: string;
  name: string;
  title: string;
  experience_years: number;
  avatar_url: string;
  bio: string;
  specializations: string[];
  rating: number;
  total_students: number;
  total_courses: number;
  total_hours_taught: number;
  is_verified: boolean;
  is_featured: boolean;
}

const FeaturedInstructors = () => {
  const featuredInstructors = (instructorsData as Instructor[])
    .filter(instructor => instructor.is_featured)
    .slice(0, 3);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nuestros Instructores Destacados
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Aprende de los mejores expertos en tributación y contabilidad del Perú. 
                Profesionales certificados con años de experiencia práctica.
              </p>
            </motion.div>
          </div>

          {/* Instructors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredInstructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="h-20 w-20 mx-auto">
                        <AvatarImage src={instructor.avatar_url} alt={instructor.name} />
                        <AvatarFallback className="text-xl">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {instructor.is_verified && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                          <Shield className="h-3 w-3" />
                        </div>
                      )}
                      {instructor.is_featured && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black rounded-full p-1">
                          <Award className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{instructor.name}</CardTitle>
                    <p className="text-muted-foreground text-sm mb-3">{instructor.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{instructor.bio}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-lg font-bold">{instructor.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Calificación</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-lg font-bold">{instructor.total_students.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Estudiantes</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-lg font-bold">{instructor.total_courses}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Cursos</p>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Especializaciones</h4>
                      <div className="flex flex-wrap gap-1">
                        {instructor.specializations.slice(0, 2).map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {instructor.specializations.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{instructor.specializations.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/instructor/${instructor.id}`} className="block">
                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        Ver Perfil Completo
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-4">
                  ¿Quieres conocer a todos nuestros instructores?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Explora el perfil completo de cada instructor, sus especializaciones, 
                  experiencia profesional y cursos disponibles.
                </p>
                <Link to="/instructors">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                    Ver Todos los Instructores
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedInstructors;


