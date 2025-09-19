import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  X,
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Clock,
  Download,
  BookOpen,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

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

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  lessons: Lesson[];
  currentLessonIndex: number;
  onLessonChange: (index: number) => void;
  onLessonComplete: (lessonId: string) => void;
  completedLessons: string[];
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  course,
  lessons,
  currentLessonIndex,
  onLessonChange,
  onLessonComplete,
  completedLessons
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const currentLesson = lessons[currentLessonIndex];

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handleDurationChange = () => setDuration(video.duration);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        onLessonComplete(currentLesson.id);
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('durationchange', handleDurationChange);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('durationchange', handleDurationChange);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentLesson, onLessonComplete]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, [currentLessonIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      onLessonChange(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      onLessonChange(currentLessonIndex - 1);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = lessons.length > 0 ? ((currentLessonIndex + 1) / lessons.length) * 100 : 0;

  if (!isOpen || !currentLesson) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: showControls ? 0 : -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-card/20"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-white">{course.title}</h1>
                <p className="text-sm text-white/80">
                  Lección {currentLessonIndex + 1} de {lessons.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-card/20 text-white border-border/30">
                {course.level}
              </Badge>
              <div className="text-sm text-white">
                {Math.round(progress)}% completado
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-3 bg-card/20" />
        </motion.div>

        {/* Video Player */}
        <motion.div 
          className="relative h-full flex items-center justify-center"
          animate={{ 
            width: showSidebar ? '75%' : '100%'
          }}
          transition={{ duration: 0.3 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            poster={currentLesson.thumbnail}
            onClick={togglePlay}
          >
            <source src={currentLesson.video_url} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <Button
                size="lg"
                className="w-20 h-20 rounded-full bg-card/90 text-foreground hover:bg-card"
                onClick={togglePlay}
              >
                <Play className="h-8 w-8 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Video Controls */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: showControls ? 0 : 100 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-card/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-card/20"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <div className="w-20">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:bg-card/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`text-white hover:bg-card/20 ${
                    showSidebar ? 'bg-card/20' : ''
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="text-white hover:bg-card/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="text-white hover:bg-card/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-card/20"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-black/60 rounded-lg"
              >
                <h4 className="text-white font-medium mb-3">Velocidad de reproducción</h4>
                <div className="flex gap-2">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <Button
                      key={rate}
                      variant={playbackRate === rate ? "default" : "outline"}
                      size="sm"
                      onClick={() => changePlaybackRate(rate)}
                      className="text-white"
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Lesson Info Sidebar - Desktop */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: showSidebar ? 0 : '100%' }}
          transition={{ duration: 0.3 }}
          className={`fixed right-0 top-0 bottom-0 w-1/3 lg:w-1/4 bg-black/95 backdrop-blur-sm overflow-y-auto z-20 hidden lg:block ${
            !showSidebar ? 'pointer-events-none' : ''
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Contenido del curso</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
                className="text-white hover:bg-card/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">{currentLesson.title}</h4>
            <p className="text-white/80 mb-4">{currentLesson.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {Math.floor(currentLesson.duration_minutes / 60)}h {currentLesson.duration_minutes % 60}m
              </span>
            </div>

            {/* Objectives */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3">Lo que aprenderás:</h4>
              <ul className="space-y-2">
                {currentLesson.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Recursos:</h4>
                <div className="space-y-2">
                  {currentLesson.resources.map((resource, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-white border-border/30 hover:bg-card/20"
                      asChild
                    >
                      <a href={resource.url} download>
                        <Download className="h-4 w-4 mr-2" />
                        {resource.title}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Lesson List */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Contenido del curso
              </h4>
              <div className="space-y-1">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`p-3 cursor-pointer transition-colors rounded-lg ${
                      index === currentLessonIndex
                        ? 'bg-card/20 text-white'
                        : 'hover:bg-card/10 text-white/80'
                    }`}
                    onClick={() => onLessonChange(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-card/20 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium line-clamp-2">{lesson.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(lesson.duration_minutes / 60)}h {lesson.duration_minutes % 60}m
                          </span>
                          {completedLessons.includes(lesson.id) && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Lesson Button */}
            <div className="mt-6">
              <Button
                className={`w-full ${
                  completedLessons.includes(currentLesson.id)
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
                onClick={() => onLessonComplete(currentLesson.id)}
                disabled={completedLessons.includes(currentLesson.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {completedLessons.includes(currentLesson.id) ? '✓ Lección Completada' : 'Marcar como Completada'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lesson Info Sidebar - Mobile */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-black/95 backdrop-blur-sm overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Contenido del curso</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className="text-white hover:bg-card/20 p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Lesson List */}
                <div className="space-y-1">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`p-3 sm:p-4 cursor-pointer transition-colors rounded-lg ${
                        index === currentLessonIndex
                          ? 'bg-card/20 text-white'
                          : 'hover:bg-card/10 text-white/80'
                      }`}
                      onClick={() => {
                        onLessonChange(index);
                        setShowSidebar(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-card/20 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium line-clamp-2">{lesson.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(lesson.duration_minutes / 60)}h {lesson.duration_minutes % 60}m
                            </span>
                            {completedLessons.includes(lesson.id) && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Complete Lesson Button */}
                <div className="mt-6">
                  <Button
                    className={`w-full h-12 ${
                      completedLessons.includes(currentLesson.id)
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                    onClick={() => onLessonComplete(currentLesson.id)}
                    disabled={completedLessons.includes(currentLesson.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">
                      {completedLessons.includes(currentLesson.id) ? '✓ Lección Completada' : 'Marcar como Completada'}
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
