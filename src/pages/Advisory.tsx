import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, Star, BookOpen, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookingModal from '@/components/advisory/booking-modal';
import { useAuthStore } from '@/lib/store/auth-store';

const Advisory = () => {
  const { isAuthenticated } = useAuthStore();
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

  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "Contador Público",
      content: "La asesoría me ayudó a resolver un caso complejo de IGV en tiempo récord.",
      rating: 5
    },
    {
      name: "María González",
      role: "Gerente Financiera", 
      content: "Excelente atención y conocimiento actualizado. Muy recomendable.",
      rating: 5
    }
  ];

  const handleBookService = (service) => {
    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login';
      return;
    }
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Asesorías <span className="hero-title">Personalizadas</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Resuelve tus consultas tributarias con expertos certificados. 
            Sesiones 1:1 adaptadas a tus necesidades específicas.
          </p>
        </motion.div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {advisoryServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`h-full ${service.popular ? 'border-primary shadow-lg md:scale-105' : ''} mx-2 sm:mx-0`}>
                <CardHeader className="text-center p-4 sm:p-6">
                  {service.popular && (
                    <Badge className="w-fit mx-auto mb-3 bg-secondary text-xs sm:text-sm">Más Popular</Badge>
                  )}
                  <CardTitle className="text-xl sm:text-2xl mb-2">{service.title}</CardTitle>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm sm:text-base">{service.duration}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{service.price}</div>
                </CardHeader>
                <CardContent className="text-center p-4 sm:p-6 pt-0">
                  <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">{service.description}</p>
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full btn-primary text-sm sm:text-base py-2 sm:py-3"
                    onClick={() => handleBookService(service)}
                  >
                    Reservar Sesión
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 px-2">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">1. Reserva tu cita</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Elige el horario que mejor te convenga</p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">2. Conecta con experto</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Sesión personalizada vía videollamada</p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">3. Recibe soluciones</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Plan de acción claro y recomendaciones</p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 px-2">Testimonios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="mx-2 sm:mx-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Expertos Disponibles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 px-2">Nuestros Expertos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Dr. Carlos Mendoza",
                title: "Especialista en Tributación",
                experience: "15 años",
                expertise: ["Pymes", "SUNAT", "Asesoría Fiscal"],
                rating: 4.9,
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Dra. Andrea Vásquez",
                title: "Abogada Tributaria",
                experience: "12 años",
                expertise: ["Derecho Tributario", "Litigios", "Cumplimiento"],
                rating: 4.8,
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "CPC María Elena Torres",
                title: "Especialista en Nóminas",
                experience: "18 años",
                expertise: ["Nóminas", "Tributación Laboral", "ESSALUD"],
                rating: 4.7,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
              }
            ].map((expert, index) => (
              <Card key={expert.name} className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={expert.avatar} 
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{expert.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{expert.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{expert.experience} de experiencia</p>
                  
                  <div className="flex justify-center items-center space-x-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{expert.rating}</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {expert.expertise.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Perfil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                ¿Listo para resolver tus dudas tributarias?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Reserva una asesoría personalizada con nuestros expertos certificados 
                y obtén respuestas claras a tus consultas tributarias.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => handleBookService(advisoryServices[1])}>
                  <BookOpen className="h-5 w-5 mr-2" />
                  Reservar Asesoría
                </Button>
                <Button size="lg" variant="outline">
                  <Shield className="h-5 w-5 mr-2" />
                  Ver Garantías
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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

export default Advisory;