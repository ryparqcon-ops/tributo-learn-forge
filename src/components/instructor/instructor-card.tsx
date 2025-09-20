import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  Shield,
  ExternalLink,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { InstructorWithProfile } from '@/lib/types/supabase';

interface InstructorCardProps {
  instructor: InstructorWithProfile;
  variant?: 'default' | 'compact' | 'detailed';
  showSocialLinks?: boolean;
  className?: string;
}

const InstructorCard = ({ 
  instructor, 
  variant = 'default', 
  showSocialLinks = true,
  className = '' 
}: InstructorCardProps) => {
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

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={instructor.avatar_url} alt={instructor.full_name} />
                <AvatarFallback>{instructor.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{instructor.full_name}</h3>
                  {instructor.is_verified && (
                    <Shield className="h-3 w-3 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{instructor.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span className="text-xs">{instructor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{instructor.total_students}</span>
                  </div>
                </div>
              </div>
              <Link to={`/instructor/${instructor.id}`}>
                <Button size="sm" variant="outline">
                  Ver
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={instructor.avatar_url} alt={instructor.full_name} />
                  <AvatarFallback className="text-lg">
                    {instructor.full_name.split(' ').map(n => n[0]).join('')}
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
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{instructor.full_name}</h3>
                <p className="text-muted-foreground mb-2">{instructor.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{instructor.bio}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="text-lg font-bold">{instructor.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">Calificación</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-lg font-bold">{instructor.total_students.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Estudiantes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-lg font-bold">{instructor.total_courses}</span>
                </div>
                <p className="text-xs text-muted-foreground">Cursos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-lg font-bold">{instructor.total_hours_taught}</span>
                </div>
                <p className="text-xs text-muted-foreground">Horas</p>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h4 className="text-sm font-medium mb-2">Especializaciones</h4>
              <div className="flex flex-wrap gap-1">
                {instructor.specializations.slice(0, 3).map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
                {instructor.specializations.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{instructor.specializations.length - 3} más
                  </Badge>
                )}
              </div>
            </div>

            {/* Social Links */}
            {showSocialLinks && Object.keys(instructor.social_links).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Redes Sociales</h4>
                <div className="flex gap-2">
                  {Object.entries(instructor.social_links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link to={`/instructor/${instructor.id}`} className="block">
              <Button className="w-full">
                Ver Perfil Completo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={instructor.avatar_url} alt={instructor.full_name} />
                <AvatarFallback>{instructor.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              {instructor.is_verified && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <Shield className="h-3 w-3" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{instructor.full_name}</h3>
                {instructor.is_featured && (
                  <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-2">{instructor.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{instructor.bio}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span>{instructor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{instructor.total_students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{instructor.total_courses} cursos</span>
                </div>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1 mb-4">
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

              {/* Social Links */}
              {showSocialLinks && Object.keys(instructor.social_links).length > 0 && (
                <div className="flex gap-2 mb-4">
                  {Object.entries(instructor.social_links).slice(0, 3).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              )}

              <Link to={`/instructor/${instructor.id}`}>
                <Button size="sm" className="w-full">
                  Ver Perfil
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InstructorCard;


