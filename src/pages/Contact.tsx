import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hola@entributos.com",
      description: "Te respondemos en menos de 24 horas"
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+51 999 123 456",
      description: "Lunes a Viernes, 9:00 AM - 6:00 PM"
    },
    {
      icon: MapPin,
      title: "Oficina",
      value: "Lima, Perú",
      description: "Av. Principal 123, San Isidro"
    },
    {
      icon: Clock,
      title: "Horario",
      value: "9:00 AM - 6:00 PM",
      description: "Lunes a Viernes (GMT-5)"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ponte en <span className="hero-title">contacto</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas sobre nuestros servicios? Nuestro equipo está aquí para ayudarte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nombre</label>
                      <Input placeholder="Tu nombre completo" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="tu@email.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Empresa</label>
                    <Input placeholder="Nombre de tu empresa (opcional)" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Asunto</label>
                    <Input placeholder="¿En qué te podemos ayudar?" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mensaje</label>
                    <Textarea 
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                      rows={5}
                    />
                  </div>
                  
                  <Button className="w-full btn-primary">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
              <p className="text-muted-foreground mb-8">
                Estamos aquí para ayudarte con cualquier pregunta sobre nuestros cursos, 
                asesorías o servicios empresariales.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          <p className="font-medium">{info.value}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-subtle">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">¿Necesitas ayuda inmediata?</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar email a soporte
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Programar llamada
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Ofrecen cursos personalizados para empresas?</h3>
                <p className="text-muted-foreground">Sí, desarrollamos contenido específico según las necesidades de tu empresa y sector.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Cuál es el tiempo de respuesta para asesorías?</h3>
                <p className="text-muted-foreground">Las consultas urgentes se responden en menos de 4 horas hábiles.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Tienen certificación oficial?</h3>
                <p className="text-muted-foreground">Nuestros certificados están respaldados por expertos reconocidos en el sector tributario.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Puedo cancelar mi suscripción en cualquier momento?</h3>
                <p className="text-muted-foreground">Sí, puedes cancelar en cualquier momento sin penalizaciones.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;