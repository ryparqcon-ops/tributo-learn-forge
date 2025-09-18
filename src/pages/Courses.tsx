import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from '@/components/course/course-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      return response.json();
    },
  });

  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || course.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(courses?.flatMap((course: any) => course.tags) || [])] as string[];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 form-input"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedTag === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              Todos
            </Button>
            {allTags.map((tag: string) => (
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
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            {filteredCourses?.length || 0} cursos encontrados
          </p>
        </motion.div>

        {/* Courses Grid */}
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
          {filteredCourses?.map((course: any, index: number) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CourseCard 
                course={course} 
                className={viewMode === 'list' ? "lg:flex lg:flex-row lg:items-center" : ""}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCourses?.length === 0 && (
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