import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Video, Plus, Users, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function DashboardMeetings() {
  const { data: meetings } = useQuery({
    queryKey: ['user-meetings'],
    queryFn: async () => {
      // Mock meetings data
      return [
        {
          id: "meet_01",
          type: "1:1_advisory",
          title: "Revisión fiscal Q4",
          host: { name: "Arash", avatar: "https://i.pravatar.cc/50?u=arash" },
          start: "2024-01-20T16:00:00-05:00",
          duration_minutes: 60,
          meeting_url: "https://meet.google.com/abc-defg-hij",
          status: "confirmed",
          description: "Revisión de obligaciones tributarias del cuarto trimestre y planificación fiscal 2024."
        },
        {
          id: "meet_02",
          type: "1:1_advisory",
          title: "Consulta sobre IGV",
          host: { name: "Andrea", avatar: "https://i.pravatar.cc/50?u=andrea" },
          start: "2024-01-25T10:00:00-05:00",
          duration_minutes: 30,
          meeting_url: null,
          status: "pending",
          description: "Consulta específica sobre exoneraciones de IGV en servicios digitales."
        },
        {
          id: "meet_03",
          type: "group_session",
          title: "Workshop: Nuevas Normativas 2024",
          host: { name: "Arash", avatar: "https://i.pravatar.cc/50?u=arash" },
          start: "2024-02-01T19:00:00-05:00",
          duration_minutes: 90,
          meeting_url: "https://zoom.us/j/123456789",
          status: "confirmed",
          description: "Sesión grupal para revisar las principales actualizaciones normativas del año."
        }
      ];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Asesorías</h1>
        <Button className="btn-primary" asChild>
          <Link to="/advisory">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Asesoría
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Próximas Sesiones</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>
        
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Horas Programadas</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Sesiones Completadas</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Total este año
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Próximas Sesiones</h2>
        <div className="space-y-4">
          {meetings?.map((meeting: any, index: number) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover-lift mx-2 sm:mx-0">
                <CardContent className="p-4 sm:p-6">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src={meeting.host.avatar}
                        alt={meeting.host.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm leading-tight pr-2">{meeting.title}</h3>
                          <Badge className={`${getStatusColor(meeting.status)} text-xs px-2 py-1 flex-shrink-0`}>
                            {getStatusText(meeting.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Con {meeting.host.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{formatMeetingDate(meeting.start)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{meeting.duration_minutes} min</span>
                        {meeting.type === 'group_session' && (
                          <>
                            <span className="mx-1">•</span>
                            <Users className="h-3 w-3" />
                            <span>Grupal</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {meeting.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      {meeting.meeting_url ? (
                        <Button size="sm" className="btn-primary text-xs px-3 py-2 flex-1">
                          <Video className="h-3 w-3 mr-1" />
                          Unirse
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs px-3 py-2 flex-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          Detalles
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-xs px-3 py-2">
                        Reagendar
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <img
                          src={meeting.host.avatar}
                          alt={meeting.host.name}
                          className="w-12 h-12 rounded-full"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold truncate">{meeting.title}</h3>
                            <Badge className={getStatusColor(meeting.status)}>
                              {getStatusText(meeting.status)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            Con {meeting.host.name}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatMeetingDate(meeting.start)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{meeting.duration_minutes} min</span>
                            </div>
                            {meeting.type === 'group_session' && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>Grupal</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {meeting.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {meeting.meeting_url ? (
                          <Button size="sm" className="btn-primary">
                            <Video className="h-4 w-4 mr-2" />
                            Unirse
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-2" />
                            Detalles
                          </Button>
                        )}
                        
                        <Button size="sm" variant="ghost" className="text-xs">
                          Reagendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Meeting History */}
      <Card className="mx-2 sm:mx-0">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Historial de Sesiones</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3">
            {[
              { date: "15 Ene 2024", topic: "Planificación Fiscal Anual", duration: "60 min", expert: "Arash" },
              { date: "08 Ene 2024", topic: "Consulta sobre Retenciones", duration: "30 min", expert: "Andrea" },
              { date: "20 Dic 2023", topic: "Cierre Contable 2023", duration: "45 min", expert: "Arash" }
            ].map((session, index) => (
              <div key={index} className="flex items-start sm:items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-sm sm:text-base leading-tight mb-1">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.date} • {session.duration} • Con {session.expert}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="text-xs flex-shrink-0">
                  Ver notas
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}