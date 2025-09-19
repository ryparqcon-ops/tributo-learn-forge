import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock,
  BookOpen,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VideoPlayerModal } from '@/components/video/VideoPlayerModal';
import coursesData from '@/lib/data/courses.json';
import lessonsData from '@/lib/data/lessons.json';

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration_minutes: number;
  video_url: string;
  thumbnail: string;
  resources: Array<{
    type: string;
    title: string;
    url: string;
  }>;
  transcript: string;
  objectives: string[];
  order: number;
}

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find course and lessons
  const course = coursesData.find(c => c.id === courseId);
  const courseLessons = (lessonsData as Lesson[]).filter(l => course?.lessons.includes(l.id))
    .sort((a, b) => a.order - b.order);

  const currentLesson = courseLessons[currentLessonIndex];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const handleLessonChange = (index: number) => {
    setCurrentLessonIndex(index);
  };

  const progress = courseLessons.length > 0 ? ((currentLessonIndex + 1) / courseLessons.length) * 100 : 0;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
          <p className="text-muted-foreground mb-4">El curso que buscas no existe o no tienes acceso.</p>
          <Button asChild>
            <Link to="/dashboard/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Cursos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/courses">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Volver</span>
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold truncate">{course.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {courseLessons.length} lecciones disponibles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-xs">{course.level}</Badge>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% completado
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-3" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold mb-2">{course.title}</h2>
                    <p className="text-muted-foreground mb-3 text-sm sm:text-base">{course.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(course.duration_minutes)}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {courseLessons.length} lecciones
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Instructor</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor.name} - {course.instructor.title}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Lo que aprenderás</h3>
                    <ul className="space-y-2">
                      {courseLessons.slice(0, 3).map((lesson, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{lesson.title}</span>
                        </li>
                      ))}
                      {courseLessons.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          Y {courseLessons.length - 3} lecciones más...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson List */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-4 w-4" />
                  Contenido del curso
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {courseLessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      className={`p-3 sm:p-4 cursor-pointer transition-colors ${
                        index === currentLessonIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => {
                        setCurrentLessonIndex(index);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-medium line-clamp-2">{lesson.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(lesson.duration_minutes)}
                            </span>
                            {completedLessons.includes(lesson.id) && (
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Start Learning Button */}
        <div className="mt-6 text-center">
          <Button
            size="lg"
            className="btn-primary w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <Play className="h-5 w-5 mr-2" />
            Comenzar a aprender
          </Button>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={course}
        lessons={courseLessons}
        currentLessonIndex={currentLessonIndex}
        onLessonChange={handleLessonChange}
        onLessonComplete={handleLessonComplete}
        completedLessons={completedLessons}
      />
    </div>
  );
};

export default CoursePlayer;
