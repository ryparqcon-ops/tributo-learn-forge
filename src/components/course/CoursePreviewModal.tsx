import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  X,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Globe,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Link } from 'react-router-dom';
import type { CourseWithDetails } from '@/lib/types/supabase';

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseWithDetails;
}

export function CoursePreviewModal({ isOpen, onClose, course }: CoursePreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showVideoInfo, setShowVideoInfo] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const formatPrice = (price: string | number, currency: string) => {
    const amount = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (videoRef.current && isOpen) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handleDurationChange = () => setDuration(video.duration);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

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
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset video state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

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
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen();
        } else if ((videoRef.current as any).mozRequestFullScreen) {
          (videoRef.current as any).mozRequestFullScreen();
        } else if ((videoRef.current as any).msRequestFullscreen) {
          (videoRef.current as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-6xl mx-auto h-full flex items-center justify-center p-2 lg:p-4 w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card rounded-lg overflow-hidden w-full h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 lg:p-4 bg-card rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
                <h2 className="text-lg lg:text-xl font-semibold truncate">{course.title}</h2>
                <div className="flex gap-1 lg:gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">{course.level}</Badge>
                  {course.ai_enabled && (
                    <Badge className="bg-secondary/90 text-secondary-foreground border-0 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 flex-1 min-h-0">
              {/* Video Section */}
              <div className="lg:col-span-2 relative">
                <div 
                  className="relative bg-black aspect-video w-full h-full flex items-center justify-center overflow-hidden"
                  onMouseMove={() => {
                    setShowControls(true);
                    if (controlsTimeout) {
                      clearTimeout(controlsTimeout);
                    }
                    const timeout = setTimeout(() => setShowControls(false), 3000);
                    setControlsTimeout(timeout);
                  }}
                  onMouseLeave={() => {
                    if (controlsTimeout) {
                      clearTimeout(controlsTimeout);
                    }
                    const timeout = setTimeout(() => setShowControls(false), 1000);
                    setControlsTimeout(timeout);
                  }}
                  onTouchStart={() => {
                    setShowControls(true);
                    if (controlsTimeout) {
                      clearTimeout(controlsTimeout);
                    }
                    const timeout = setTimeout(() => setShowControls(false), 3000);
                    setControlsTimeout(timeout);
                  }}
                >
                  {course.preview_video ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain max-w-full max-h-full"
                      poster={course.thumbnail_url || undefined}
                      onClick={togglePlay}
                    >
                      <source src={course.preview_video} type="video/mp4" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">🎥</div>
                        <h3 className="text-lg font-semibold mb-2">Vista previa no disponible</h3>
                        <p className="text-muted-foreground">
                          Este curso no tiene video de vista previa disponible.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Play/Pause Overlay */}
                  {!isPlaying && course.preview_video && (
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
                  {course.preview_video && (
                    <motion.div
                      initial={{ y: 100 }}
                      animate={{ y: showControls ? 0 : 100 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 lg:p-4
                               fixed md:absolute z-20"
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
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="text-white hover:bg-card/20"
                          >
                            <Maximize className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Preview Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Vista previa
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Course Info Sidebar */}
              <div className="lg:col-span-1 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto h-[60vh] lg:h-auto relative z-10">
                {/* Price and CTA */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(course.price, course.currency)}
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/course/${course.slug}`}>
                      Ver curso completo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDuration(course.duration_hours)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{course.total_lessons || 0} lecciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.total_enrollments} estudiantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {course.description || course.summary}
                  </p>
                </div>

                {/* Instructor */}
                <div>
                  <h3 className="font-semibold mb-2">Instructor</h3>
                  <div className="flex items-center gap-3">
                    {course.instructor_avatar && (
                      <img
                        src={course.instructor_avatar}
                        alt={course.instructor_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm">{course.instructor_name}</p>
                      <p className="text-xs text-muted-foreground">{course.instructor_title}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-2">Incluye</h3>
                  <div className="space-y-2">
                    {course.certificate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-green-600" />
                        <span>Certificado de finalización</span>
                      </div>
                    )}
                    {course.lifetime_access && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span>Acceso vitalicio</span>
                      </div>
                    )}
                    {course.ai_enabled && (
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span>Asistencia con IA</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-2">Temas</h3>
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mobile bottom padding */}
                <div className="h-4 lg:hidden"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
