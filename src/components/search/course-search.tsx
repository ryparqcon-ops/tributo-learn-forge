import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  summary: string;
  instructor: {
    name: string;
  };
  duration_minutes: number;
  level: string;
  tags: string[];
  thumbnail: string;
}

interface CourseSearchProps {
  courses: Course[];
  onSearch: (query: string) => void;
  onCourseSelect: (course: Course) => void;
  placeholder?: string;
  className?: string;
}

export const CourseSearch = ({ 
  courses,
  onSearch, 
  onCourseSelect, 
  placeholder = "Buscar cursos...",
  className = ""
}: CourseSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true);
    }
    
    const timeoutId = setTimeout(() => {
      // Always trigger search for real-time filtering
      onSearch(query);
      setIsSearching(false);
      
      // Show suggestions only when typing (query length >= 2)
      if (query.length >= 2 && courses && courses.length > 0) {
        const filtered = courses.filter((course: Course) => 
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.summary.toLowerCase().includes(query.toLowerCase()) ||
          course.instructor.name.toLowerCase().includes(query.toLowerCase()) ||
          (course.tags && course.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())))
        ).slice(0, 5);
        
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch, courses]);

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
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleCourseSelect = (course: Course) => {
    setQuery(course.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onCourseSelect(course);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch('');
    inputRef.current?.focus();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
      <div className="relative">
        {isSearching ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          className="pl-10 pr-10 form-input"
        />
        {query && !isSearching && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Sugerencias de cursos ({suggestions.length})
              </div>
              {suggestions.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-12 h-8 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {course.summary}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {course.instructor.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(course.duration_minutes)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};