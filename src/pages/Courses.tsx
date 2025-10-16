import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from '@/components/course/course-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CourseSearch } from '@/components/search/course-search';
import { useCourses } from '@/hooks/use-courses';
import type { CourseWithDetails } from '@/lib/types/supabase';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourse, setSelectedCourse] = useState<CourseWithDetails | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Usar el hook de Supabase
  const { courses, isLoading, error } = useCourses();

  // Read search query from URL on component mount
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const filteredCourses = courses?.filter((course: CourseWithDetails) => {
    // Search filter (handled by CourseSearch component)
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tag filter
    const matchesTag = !selectedTag || course.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(courses?.flatMap((course: CourseWithDetails) => course.tags) || [])] as string[];
  const visibleTags = (!isMobile || showAllTags) ? allTags : allTags.slice(0, 6);
  const hasMoreTags = isMobile && allTags.length > 6;


  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Catálogo de <span className="hero-title">Cursos</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra colección completa de cursos tributarios diseñados por expertos
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <CourseSearch
                courses={courses}
                onSearch={setSearchQuery}
                onCourseSelect={(course) => {
                  setSelectedCourse(course);
                  setSearchQuery(course.title);
                }}
                placeholder="Buscar cursos..."
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`h-8 w-8 p-0 transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
                title="Vista de cuadrícula"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`h-8 w-8 p-0 transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
                title="Vista de lista"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Filtrar por categoría:</h3>
              {hasMoreTags && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="text-xs h-7 px-3 text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40"
                >
                  {showAllTags ? 'Ver menos' : `Ver todas (${allTags.length})`}
                </Button>
              )}
            </div>
            
            {/* Desktop: Grid layout, Mobile: Flex with expand */}
            <div className={isMobile ? "flex flex-wrap gap-2" : "flex flex-wrap gap-2"}>
              <Button
                variant={selectedTag === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                Todos
              </Button>
              {visibleTags.map((tag: string) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className="capitalize"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Selected Course */}
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-primary">{selectedCourse.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCourse.instructor_name} • {Math.floor(selectedCourse.duration_minutes / 60)}h {selectedCourse.duration_minutes % 60}m
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCourse(null)}
                >
                  Ver todos los cursos
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            {filteredCourses?.length || 0} cursos encontrados
            {searchQuery && (
              <span className="ml-2">
                para "<span className="font-medium">{searchQuery}</span>"
              </span>
            )}
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner size="lg" />}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Error al cargar cursos</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredCourses?.map((course: CourseWithDetails, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CourseCard 
                  course={course} 
                  viewMode={viewMode}
                  className=""
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCourses?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron cursos</h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar tus filtros o búsqueda
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedTag(null);
            }}>
              Limpiar filtros
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;