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
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BookingModal from '@/components/advisory/booking-modal';

// Mock data for advisory sessions
const mockAdvisorySessions = [
  {
    id: 'adv_001',
    title: 'Consulta sobre IGV en Exportaciones',
    expert: {
      name: 'Dr. Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      specialty: 'Especialista en Tributación'
    },
    date: '2024-01-25',
    time: '14:00',
    duration: '60 min',
    status: 'confirmed',
    type: 'Asesoría Especializada',
    price: 'S/ 200',
    description: 'Análisis de obligaciones tributarias para exportaciones de productos agrícolas',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Preparar documentación de exportaciones del último trimestre'
  },
  {
    id: 'adv_002',
    title: 'Revisión de Planillas de Personal',
    expert: {
      name: 'CPC María Elena Torres',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      specialty: 'Especialista en Nóminas'
    },
    date: '2024-01-28',
    time: '10:30',
    duration: '30 min',
    status: 'pending',
    type: 'Consulta Express',
    price: 'S/ 120',
    description: 'Verificación de cálculos de beneficios sociales y aportes',
    meetingLink: null,
    notes: 'Revisar cambios en la normativa de ESSALUD'
  },
  {
    id: 'adv_003',
    title: 'Estrategia de Defensa Fiscal',
    expert: {
      name: 'Dra. Andrea Vásquez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      specialty: 'Abogada Tributaria'
    },
    date: '2024-01-20',
    time: '16:00',
    duration: '90 min',
    status: 'completed',
    type: 'Plan Empresarial',
    price: 'S/ 350',
    description: 'Desarrollo de estrategia para fiscalización de SUNAT',
    meetingLink: null,
    notes: 'Documentos enviados por email. Seguimiento en 2 semanas.',
    rating: 5,
    feedback: 'Excelente asesoría, muy clara y profesional'
  }
];

const statusConfig = {
  confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  completed: { label: 'Completada', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: AlertCircle }
};

const DashboardAdvisory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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

  const filteredSessions = mockAdvisorySessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.expert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBookService = (service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUpcomingSessions = () => {
    const today = new Date();
    return filteredSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= today && session.status !== 'completed';
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getCompletedSessions = () => {
    return filteredSessions.filter(session => session.status === 'completed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Asesorías</h1>
          <p className="text-muted-foreground">Gestiona tus sesiones de asesoría personalizada</p>
        </div>
        <Button onClick={() => handleBookService(advisoryServices[1])} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Asesoría
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
                <p className="text-2xl font-bold">{getUpcomingSessions().length}</p>
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
                <p className="text-2xl font-bold">{getCompletedSessions().length}</p>
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
                <p className="text-2xl font-bold">4.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Expertos</p>
                <p className="text-2xl font-bold">3</p>
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
                      {/* Expert Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={session.expert.avatar} />
                          <AvatarFallback>{session.expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{session.expert.name}</h3>
                          <p className="text-sm text-muted-foreground">{session.expert.specialty}</p>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{session.type}</Badge>
                          <Badge variant="outline">{session.price}</Badge>
                          <Badge variant="outline">{session.duration}</Badge>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{session.time}</span>
                        </div>
                        <Badge className={statusConfig[session.status].color}>
                          {statusConfig[session.status].label}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {session.meetingLink && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
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
                            <DropdownMenuItem className="text-red-600">
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
                <Button onClick={() => handleBookService(advisoryServices[1])}>
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
                      {/* Expert Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={session.expert.avatar} />
                          <AvatarFallback>{session.expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{session.expert.name}</h3>
                          <p className="text-sm text-muted-foreground">{session.expert.specialty}</p>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                        {session.feedback && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm italic">"{session.feedback}"</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(session.rating)].map((_, i) => (
                                <span key={i} className="text-yellow-400">★</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{session.type}</Badge>
                          <Badge variant="outline">{session.price}</Badge>
                          <Badge variant="outline">{session.duration}</Badge>
                        </div>
                      </div>

                      {/* Date & Status */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{session.time}</span>
                        </div>
                        <Badge className={statusConfig[session.status].color}>
                          {statusConfig[session.status].label}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver detalles
                        </Button>
                        <Button size="sm" variant="outline">
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
      {selectedService && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default DashboardAdvisory;


