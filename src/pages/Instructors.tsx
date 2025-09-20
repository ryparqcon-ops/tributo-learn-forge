import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Users, BookOpen, Clock, Shield, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InstructorCard from '@/components/instructor/instructor-card';
import { useInstructors } from '@/hooks/use-instructors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { InstructorWithProfile } from '@/lib/types/supabase';

const Instructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Usar el hook de Supabase
  const { instructors, isLoading, error } = useInstructors();

  // Filter and sort instructors
  const filteredInstructors = instructors
    ?.filter(instructor => {
      const matchesSearch = instructor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           instructor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           instructor.specializations.some(spec => 
                             spec.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'verified' && instructor.is_verified) ||
                           (filterBy === 'featured' && instructor.is_featured) ||
                           (filterBy === 'experienced' && instructor.experience_years >= 15);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.total_students - a.total_students;
        case 'courses':
          return b.total_courses - a.total_courses;
        case 'experience':
          return b.experience_years - a.experience_years;
        case 'name':
          return a.full_name.localeCompare(b.full_name);
        default:
          return 0;
      }
    }) || [];

  const featuredInstructors = instructors?.filter(inst => inst.is_featured) || [];
  const verifiedInstructors = instructors?.filter(inst => inst.is_verified) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nuestros Instructores
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Aprende de los mejores expertos en tributación y contabilidad del Perú. 
                Profesionales certificados con años de experiencia práctica.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{instructors?.length || 0}</div>
                  <p className="text-blue-100">Instructores</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {instructors?.reduce((acc, inst) => acc + inst.total_students, 0).toLocaleString() || 0}
                  </div>
                  <p className="text-blue-100">Estudiantes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {instructors?.reduce((acc, inst) => acc + inst.total_courses, 0) || 0}
                  </div>
                  <p className="text-blue-100">Cursos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {instructors?.reduce((acc, inst) => acc + inst.total_hours_taught, 0) || 0}
                  </div>
                  <p className="text-blue-100">Horas enseñadas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Search and Filters */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar instructores, especialidades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Calificación</SelectItem>
                      <SelectItem value="students">Estudiantes</SelectItem>
                      <SelectItem value="courses">Cursos</SelectItem>
                      <SelectItem value="experience">Experiencia</SelectItem>
                      <SelectItem value="name">Nombre</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="verified">Verificados</SelectItem>
                      <SelectItem value="featured">Destacados</SelectItem>
                      <SelectItem value="experienced">15+ años exp.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos ({instructors?.length || 0})</TabsTrigger>
              <TabsTrigger value="featured">Destacados ({featuredInstructors.length})</TabsTrigger>
              <TabsTrigger value="verified">Verificados ({verifiedInstructors.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">Error al cargar instructores</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Reintentar
                  </Button>
                </div>
              ) : filteredInstructors.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {filteredInstructors.map((instructor, index) => (
                    <motion.div
                      key={instructor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <InstructorCard 
                        instructor={instructor} 
                        variant={viewMode === 'list' ? 'compact' : 'detailed'}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron instructores</h3>
                  <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredInstructors.map((instructor, index) => (
                  <motion.div
                    key={instructor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <InstructorCard instructor={instructor} variant="detailed" />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="verified" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verifiedInstructors.map((instructor, index) => (
                  <motion.div
                    key={instructor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <InstructorCard instructor={instructor} variant="detailed" />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Instructors;


