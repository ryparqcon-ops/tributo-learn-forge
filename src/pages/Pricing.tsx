import { motion } from 'framer-motion';
import { Check, X, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: "Básico",
      price: "Gratis",
      period: "",
      description: "Perfecto para comenzar tu aprendizaje",
      features: [
        "2 cursos gratuitos",
        "Certificado digital",
        "Acceso a comunidad",
        "Soporte por email"
      ],
      notIncluded: [
        "Asesorías personalizadas",
        "Contenido exclusivo IA",
        "Descargas offline"
      ],
      cta: "Comenzar Gratis",
      href: "/register"
    },
    {
      name: "Profesional",
      price: "S/ 99",
      period: "/mes",
      description: "Para profesionales que buscan excelencia",
      features: [
        "Acceso completo a cursos",
        "2 asesorías mensuales incluidas",
        "Contenido enriquecido con IA",
        "Descargas offline",
        "Certificados profesionales",
        "Soporte prioritario"
      ],
      notIncluded: [
        "Cursos personalizados"
      ],
      cta: "Comenzar Prueba",
      href: "/register?plan=professional",
      popular: true
    },
    {
      name: "Empresarial",
      price: "S/ 299",
      period: "/mes",
      description: "Solución completa para equipos y empresas",
      features: [
        "Todo lo del plan Profesional",
        "Cursos personalizados",
        "Asesorías ilimitadas",
        "Dashboard para equipos",
        "Reportes de progreso",
        "Gestor de cuenta dedicado",
        "Integración con HRIS"
      ],
      notIncluded: [],
      cta: "Contactar Ventas",
      href: "/contact"
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
            Planes que se adaptan a <span className="hero-title">tu crecimiento</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto para tus necesidades de aprendizaje tributario
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`h-full ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}>
                <CardHeader className="text-center">
                  {plan.popular && (
                    <Badge className="w-fit mx-auto mb-2 bg-secondary">
                      <Star className="h-3 w-3 mr-1" />
                      Más Popular
                    </Badge>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2 opacity-50">
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${plan.popular ? 'btn-hero' : 'btn-primary'}`} 
                    asChild
                  >
                    <Link to={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">¿Por qué elegir Entributos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Powered by Sabio-IA</h3>
              <p className="text-muted-foreground">Contenido enriquecido con inteligencia artificial</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Contenido Actualizado</h3>
              <p className="text-muted-foreground">Siempre al día con las últimas normativas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expertos Certificados</h3>
              <p className="text-muted-foreground">Aprende de los mejores profesionales del sector</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
                <p className="text-muted-foreground">Sí, puedes actualizar o degradar tu plan cuando lo necesites. Los cambios se aplicarán en tu próximo período de facturación.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Hay descuentos para pagos anuales?</h3>
                <p className="text-muted-foreground">Sí, obtienes 2 meses gratis al pagar anualmente en cualquier plan de pago.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Qué incluye el soporte prioritario?</h3>
                <p className="text-muted-foreground">Respuesta en menos de 4 horas, acceso directo a nuestros expertos y soporte técnico especializado.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;