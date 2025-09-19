import { HeroSection } from "@/components/hero/hero-section";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Award, Sparkles, Star } from "lucide-react";
import coursesData from '@/lib/data/courses.json';

const Index = () => {
  const courses = coursesData;

  const features = [
    {
      icon: CheckCircle,
      title: "Contenido Práctico",
      description: "Casos reales y ejercicios aplicados al día a día profesional"
    },
    {
      icon: Users,
      title: "Asesorías Personalizadas", 
      description: "Sesiones 1:1 con expertos tributarios certificados"
    },
    {
      icon: Award,
      title: "Certificación Profesional",
      description: "Credenciales reconocidas por el sector tributario"
    },
    {
      icon: Sparkles,
      title: "IA Integrada",
      description: "Powered by Sabio-IA para insights y recomendaciones"
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Featured Courses Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cursos <span className="hero-title">Destacados</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Aprende con nuestros cursos más populares y demandados por profesionales
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {courses?.slice(0, 4).map((course: any, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="btn-primary" asChild>
              <Link to="/courses">
                Ver todos los cursos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir <span className="hero-title">Entributos</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La plataforma más completa para educación tributaria profesional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg border border-border/50 hover:border-primary/30 transition-colors hover-lift"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Comienza tu transformación profesional hoy
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a más de 2,500 profesionales que ya confían en Entributos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
                <Link to="/register">
                  Comenzar gratis
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/20 bg-white/10 hover:bg-white/20 text-white" 
                asChild
              >
                <Link to="/advisory">
                  Asesoría personalizada
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros <span className="hero-title">estudiantes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Miles de profesionales han transformado su carrera con Entributos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Mendoza",
                role: "Contador Público",
                company: "Estudio Mendoza & Asociados",
                content: "Los cursos de Entributos me han ayudado a resolver casos complejos que antes me tomaban días. Ahora tengo la confianza y el conocimiento para enfrentar cualquier desafío tributario.",
                avatar: "https://i.pravatar.cc/100?u=carlos",
                rating: 5
              },
              {
                name: "María González",
                role: "Gerente Financiera",
                company: "Grupo Empresarial Lima",
                content: "La asesoría personalizada y el contenido enriquecido con IA me han permitido optimizar los procesos fiscales de nuestra empresa. Excelente inversión.",
                avatar: "https://i.pravatar.cc/100?u=maria",
                rating: 5
              },
              {
                name: "Roberto Vásquez",
                role: "Consultor Tributario",
                company: "Independiente",
                content: "Después de completar 3 cursos, he aumentado mis ingresos en un 40%. El conocimiento especializado que ofrecen es invaluable para mi práctica profesional.",
                avatar: "https://i.pravatar.cc/100?u=roberto",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border/50 rounded-lg p-6 hover-lift"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
