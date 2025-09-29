import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourses } from '@/hooks/use-courses';
import type { CourseWithDetails } from '@/lib/types/supabase';

interface NavbarSearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export const NavbarSearch = ({ 
  placeholder = "Buscar cursos...",
  className = "",
  onSearch
}: NavbarSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CourseWithDetails[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Usar el hook de Supabase
  const { courses, isLoading } = useCourses();

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2 && courses && courses.length > 0) {
        const filtered = courses.filter((course: CourseWithDetails) => 
          course.title?.toLowerCase().includes(query.toLowerCase()) ||
          course.short_description?.toLowerCase().includes(query.toLowerCase()) ||
          course.instructor_name?.toLowerCase().includes(query.toLowerCase()) ||
          (course.tags && course.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())))
        ).slice(0, 4); // Limit to 4 suggestions for navbar
        
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, courses]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleCourseSelect(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleCourseSelect = (course: CourseWithDetails) => {
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    navigate(`/course/${course.slug}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      navigate(`/courses?search=${encodeURIComponent(query.trim())}`);
      onSearch?.(query);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            className="w-full pl-10 pr-10 bg-card border-border focus:border-primary"
          />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto md:min-w-[400px] w-full"
          >
            <div className="p-3 sm:p-2">
              <div className="text-xs font-medium text-muted-foreground mb-3 sm:mb-2 px-1">
                Sugerencias ({suggestions.length})
              </div>
              {suggestions.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`p-3 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={course.thumbnail_url || '/placeholder.svg'}
                      alt={course.title || 'Curso'}
                      className="w-12 h-8 sm:w-10 sm:h-7 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-sm line-clamp-2 leading-tight">
                        {course.title}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{course.instructor_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{formatDuration(course.duration_hours || 0)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs w-fit">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Show all results link */}
              <div className="px-1 sm:px-2 pt-3 sm:pt-2 border-t border-border">
                <button
                  onClick={handleSearch}
                  className="w-full text-left p-3 sm:p-2 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                >
                  Ver todos los resultados para "{query}"
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
