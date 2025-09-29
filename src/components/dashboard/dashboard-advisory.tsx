import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import BookingModal from '@/components/advisory/booking-modal';
import { useUserConsultationSessions, useConsultations } from '@/hooks/use-consultations';
import { useSessionActions } from '@/hooks/use-consultations';
import type { ConsultationSession, ConsultationWithInstructor } from '@/lib/services/consultations';

// Función para formatear duración
const formatDuration = (hours: number) => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours} hora${hours > 1 ? 's' : ''}`;
};

// Función para formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función para formatear hora
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const statusConfig = {
  scheduled: { label: 'Programada', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  in_progress: { label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  completed: { label: 'Completada', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: AlertCircle }
};

const DashboardAdvisory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConsultations, setSelectedConsultations] = useState<ConsultationWithInstructor[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Hooks para datos reales
  const { sessions, loading: sessionsLoading, error: sessionsError, refetch } = useUserConsultationSessions();
  const { consultations, loading: consultationsLoading, error: consultationsError } = useConsultations();
  const { 
    cancelSession, 
    rateSession, 
    completeSession, 
    addMeetingUrl, 
    confirmSession, 
    loading: actionLoading 
  } = useSessionActions();

  // Debug logs
  console.log('DashboardAdvisory - consultations:', consultations);
  console.log('DashboardAdvisory - consultationsLoading:', consultationsLoading);
  console.log('DashboardAdvisory - consultationsError:', consultationsError);

  const advisoryServices = [
    {
      title: "Consulta Express",
      duration: "30 min",
      price: "S/ 120",
      description: "Consulta rápida para resolver dudas específicas",
      features: ["Respuesta inmediata", "1 consulta incluida", "Vía videollamada"]
    },
    {
      title: "Asesoría Especializada",
      duration: "60 min",
      price: "S/ 200",
      description: "Sesión completa con análisis detallado",
      features: ["Análisis profundo", "Recomendaciones escritas", "Seguimiento por email"],
      popular: true
    },
    {
      title: "Plan Empresarial",
      duration: "90 min",
      price: "S/ 350",
      description: "Para empresas que necesitan asesoría integral",
      features: ["Revisión completa", "Plan de acción", "3 seguimientos incluidos"]
    }
  ];

  // Filtrar sesiones por búsqueda y estado
  const filteredSessions = sessions.filter(session => {
    // Por ahora solo filtramos por estado ya que no tenemos título en las sesiones
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesStatus;
  });


  const handleBookService = () => {
    console.log('handleBookService called - consultations:', consultations);
    console.log('handleBookService - consultations.length:', consultations.length);
    setSelectedConsultations(consultations);
    setIsBookingModalOpen(true);
    console.log('handleBookService - modal should be open now');
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await cancelSession(sessionId);
      refetch(); // Recargar las sesiones
    } catch (error) {
      console.error('Error cancelando sesión:', error);
    }
  };

  const handleRateSession = async (sessionId: string, rating: number) => {
    try {
      await rateSession(sessionId, rating);
      refetch(); // Recargar las sesiones
    } catch (error) {
      console.error('Error calificando sesión:', error);
    }
  };

  const handleConfirmSession = async (sessionId: string) => {
    try {
      await confirmSession(sessionId);
      refetch(); // Recargar las sesiones
    } catch (error) {
      console.error('Error confirmando sesión:', error);
    }
  };

  const handleCompleteSession = async (sessionId: string, notes?: string) => {
    try {
      await completeSession(sessionId, notes);
      refetch(); // Recargar las sesiones
    } catch (error) {
      console.error('Error completando sesión:', error);
    }
  };

  const getUpcomingSessions = () => {
    const today = new Date();
    return filteredSessions.filter(session => {
      const sessionDate = new Date(session.scheduled_at);
      return sessionDate >= today && session.status !== 'completed' && session.status !== 'cancelled';
    }).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  };

  const getCompletedSessions = () => {
    return filteredSessions.filter(session => session.status === 'completed');
  };

  // Calcular estadísticas
  const stats = {
    upcoming: getUpcomingSessions().length,
    completed: getCompletedSessions().length,
    totalHours: sessions.filter(session => session.status !== 'cancelled').reduce((total, session) => total + session.duration_hours, 0),
    totalSessions: sessions.filter(session => session.status !== 'cancelled').length
  };

  // Mostrar loading si están cargando los datos
  if (sessionsLoading || consultationsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Mostrar error si hay un problema
  if (sessionsError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar asesorías</h3>
          <p className="text-red-600">{sessionsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Asesorías</h1>
          <p className="text-muted-foreground">Gestiona tus sesiones de asesoría personalizada</p>
          {consultationsError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              Error cargando asesorías: {consultationsError}
            </div>
          )}
        </div>
        <Button 
          onClick={handleBookService}
          className="w-full sm:w-auto"
          disabled={consultations.length === 0 || consultationsLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {consultationsLoading ? 'Cargando...' : 'Nueva Asesoría'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Próximas</p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completadas</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Horas Totales</p>
                <p className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total Sesiones</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar asesorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="confirmed">Confirmadas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Próximas ({getUpcomingSessions().length})</TabsTrigger>
          <TabsTrigger value="completed">Completadas ({getCompletedSessions().length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {getUpcomingSessions().length > 0 ? (
            getUpcomingSessions().map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Session Details */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">Sesión de Asesoría</h4>
                        <p className="text-sm text-muted-foreground">
                          Duración: {formatDuration(session.duration_hours)}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">ID: {session.id.slice(0, 8)}</Badge>
                          <Badge variant="outline">{formatDuration(session.duration_hours)}</Badge>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.scheduled_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(session.scheduled_at)}</span>
                        </div>
                        <Badge className={statusConfig[session.status]?.color || 'bg-gray-100 text-gray-800'}>
                          {statusConfig[session.status]?.label || session.status}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {session.meeting_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-1" />
                              Unirse
                            </a>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Reagendar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleCancelSession(session.id)}
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes asesorías próximas</h3>
                <p className="text-muted-foreground mb-4">
                  Reserva una asesoría personalizada con nuestros expertos
                </p>
                <Button 
                  onClick={handleBookService}
                  disabled={consultations.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Reservar Asesoría
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {getCompletedSessions().length > 0 ? (
            getCompletedSessions().map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Session Details */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">Sesión de Asesoría Completada</h4>
                        <p className="text-sm text-muted-foreground">
                          Duración: {formatDuration(session.duration_hours)}
                        </p>
                        {session.student_rating && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-sm font-medium">Tu calificación:</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < session.student_rating! 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">ID: {session.id.slice(0, 8)}</Badge>
                          <Badge variant="outline">{formatDuration(session.duration_hours)}</Badge>
                        </div>
                      </div>

                      {/* Date & Status */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.scheduled_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(session.scheduled_at)}</span>
                        </div>
                        <Badge className={statusConfig[session.status]?.color || 'bg-gray-100 text-gray-800'}>
                          {statusConfig[session.status]?.label || session.status}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver detalles
                        </Button>
                        {!session.student_rating && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRateSession(session.id, 5)}
                            disabled={actionLoading}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Calificar
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleBookService}
                          disabled={consultations.length === 0}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Repetir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes asesorías completadas</h3>
                <p className="text-muted-foreground mb-4">
                  Las asesorías que completes aparecerán aquí
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedConsultations([]);
        }}
        consultations={selectedConsultations}
      />
    </div>
  );
};

export default DashboardAdvisory;


























