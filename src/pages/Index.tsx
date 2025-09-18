import { HeroSection } from "@/components/hero/hero-section";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CourseCard } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Award, Sparkles } from "lucide-react";

const Index = () => {
  const { data: courses } = useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      return response.json();
    },
  });

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {courses?.slice(0, 2).map((course: any, index: number) => (
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
    </div>
  );
};

export default Index;
