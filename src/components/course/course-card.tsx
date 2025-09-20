import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Play, Sparkles, Award, Globe, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CoursePreviewModal } from './CoursePreviewModal';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { CourseWithDetails } from '@/lib/types/supabase';

interface Course {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  instructor: {
    id: string;
    name: string;
    title?: string;
    experience?: string;
    avatar?: string;
  };
  price_cents: number;
  currency: string;
  duration_minutes: number;
  avg_lesson_time: number;
  lessons: string[];
  tags: string[];
  rating: number;
  students_enrolled: number;
  ai_enabled: boolean;
  thumbnail: string;
  level?: string;
  language?: string;
  certificate?: boolean;
  lifetime_access?: boolean;
}

interface CourseCardProps {
  course: CourseWithDetails;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export function CourseCard({ course, className, viewMode = 'grid' }: CourseCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("group", className)}
      >
        <Card className="course-card h-full">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Thumbnail */}
            <div className="relative w-full lg:w-80 h-48 lg:h-auto overflow-hidden flex-shrink-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay with play button */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button 
                  size="sm" 
                  className="btn-hero"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsPreviewOpen(true);
                  }}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Vista previa
                </Button>
              </div>

              {/* AI Badge */}
              {course.ai_enabled && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-secondary/90 text-secondary-foreground border-0 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                </div>
              )}

              {/* Rating */}
              <div className="absolute top-2 left-2 flex items-center space-x-1 bg-background/90 rounded-full px-2 py-1 text-xs">
                <Star className="h-3 w-3 fill-secondary text-secondary" />
                <span className="font-medium">{course.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between min-h-0">
              {/* Header */}
              <div className="flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title and description */}
                <div className="mb-4">
                  <h3 className="font-semibold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {course.summary}
                  </p>
                </div>

                {/* Instructor */}
                <p className="text-sm text-muted-foreground mb-4">
                  Por <span className="font-medium text-foreground">{course.instructor_name}</span>
                </p>

                {/* Stats - Horizontal layout for list view */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(course.duration_minutes)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.total_lessons || 0} lecciones</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students_enrolled}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Level and Features */}
                <div className="flex flex-wrap gap-2">
                  {course.level && (
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                  )}
                  {course.certificate && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Award className="h-3 w-3" />
                      <span>Certificado</span>
                    </div>
                  )}
                  {course.lifetime_access && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Globe className="h-3 w-3" />
                      <span>Acceso vitalicio</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(course.price_cents, course.currency)}
                </div>
                <Button className="btn-primary" asChild>
                  <Link to={`/course/${course.slug}`}>
                    Ver curso
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Course Preview Modal */}
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          course={course}
        />
      </motion.div>
    );
  }

  // Grid view (original design)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group", className)}
    >
      <Card className="course-card h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button 
              size="lg" 
              className="btn-hero"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
            >
              <Play className="h-5 w-5 mr-2" />
              Vista previa
            </Button>
          </div>

          {/* AI Badge */}
          {course.ai_enabled && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-secondary/90 text-secondary-foreground border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                IA
              </Badge>
            </div>
          )}

          {/* Rating */}
          <div className="absolute top-3 left-3 flex items-center space-x-1 bg-background/90 rounded-full px-2 py-1 text-xs">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="font-medium">{course.rating}</span>
          </div>
        </div>

        <CardContent className="flex-1 p-6">
          <div className="space-y-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs capitalize">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title and description */}
            <div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {course.summary}
              </p>
            </div>

            {/* Instructor */}
            <p className="text-sm text-muted-foreground">
              Por <span className="font-medium text-foreground">{course.instructor_name}</span>
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration_minutes)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.total_lessons || 0} lecciones</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.students_enrolled}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            </div>

            {/* Level and Features */}
            <div className="flex flex-wrap gap-2">
              {course.level && (
                <Badge variant="outline" className="text-xs">
                  {course.level}
                </Badge>
              )}
              {course.certificate && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Award className="h-3 w-3" />
                  <span>Certificado</span>
                </div>
              )}
              {course.lifetime_access && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Globe className="h-3 w-3" />
                  <span>Acceso vitalicio</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(course.price_cents, course.currency)}
            </div>
            <Button className="btn-primary" asChild>
              <Link to={`/course/${course.slug}`}>
                Ver curso
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Course Preview Modal */}
      <CoursePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        course={course}
      />
    </motion.div>
  );
}