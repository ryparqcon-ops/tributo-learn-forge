import { HeroSection } from "@/components/hero/hero-section";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Award, Sparkles, Star } from "lucide-react";
import coursesData from '@/lib/data/courses.json';
import CompanyLogo from '@/components/ui/company-logos';

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
      description: "Powered by Tributin-IA para insights y recomendaciones"
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
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
                <CheckCircle className="h-4 w-4 mr-2 inline" />
                100% Gratis
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
                <Users className="h-4 w-4 mr-2 inline" />
                Sin compromiso
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
                <Award className="h-4 w-4 mr-2 inline" />
                Certificado incluido
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Comienza tu transformación profesional hoy
            </h2>
            
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Únete a más de{' '}
              <span className="text-3xl md:text-4xl font-bold text-yellow-300">
                2,500
              </span>{' '}
              profesionales que ya confían en Entributos
            </p>

            <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto">
              Accede a contenido premium, asesoría experta y una comunidad de profesionales
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 bg-white text-slate-900 hover:bg-white/90 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 font-semibold group"
                asChild
              >
                <Link to="/register" className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Comenzar gratis
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-6 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white hover:border-white/50 shadow-xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 font-semibold backdrop-blur-sm" 
                asChild
              >
                <Link to="/advisory" className="flex items-center gap-3">
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Asesoría personalizada
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <motion.div 
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm opacity-70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-semibold">
                      {i}
                    </div>
                  ))}
                </div>
                <span>+2,500 profesionales</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span>4.9/5 calificación promedio</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Empresas que confían en <span className="hero-title">Entributos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Más de 500 empresas ya han transformado su gestión tributaria con nosotros
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative overflow-hidden"
          >
            {/* Carousel Container */}
            <div className="flex animate-scroll space-x-12 items-center">
              {/* Duplicate logos for seamless loop */}
              {[
                { name: "Grupo Romero" },
                { name: "Backus" },
                { name: "Interbank" },
                { name: "Ripley" },
                { name: "Falabella" },
                { name: "Credicorp" },
                { name: "Alicorp" },
                { name: "Gloria" },
                { name: "Volkswagen" },
                { name: "Samsung" },
                { name: "Microsoft" },
                { name: "Google" },
                { name: "BCP" },
                { name: "Scotiabank" },
                { name: "Movistar" },
                { name: "Claro" },
                // Duplicate for seamless loop
                { name: "Grupo Romero" },
                { name: "Backus" },
                { name: "Interbank" },
                { name: "Ripley" },
                { name: "Falabella" },
                { name: "Credicorp" },
                { name: "Alicorp" },
                { name: "Gloria" },
                { name: "Volkswagen" },
                { name: "Samsung" },
                { name: "Microsoft" },
                { name: "Google" },
                { name: "BCP" },
                { name: "Scotiabank" },
                { name: "Movistar" },
                { name: "Claro" }
              ].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center group"
                >
                  <div className="w-24 h-12 opacity-40 group-hover:opacity-70 transition-all duration-300 grayscale hover:grayscale-0 hover:scale-105">
                    <CompanyLogo name={company.name} className="w-full h-full" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none"></div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Empresas confían en nosotros</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Satisfacción del cliente</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5 años</div>
              <div className="text-muted-foreground">De experiencia en el mercado</div>
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
