import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-tax-education.jpg';

export function HeroSection() {
  const stats = [
    { label: 'Estudiantes activos', value: '2,500+' },
    { label: 'Cursos disponibles', value: '50+' },
    { label: 'Satisfacción', value: '4.8/5' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional tax education" 
          className="w-full h-full object-cover opacity-30 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-card/70 to-background/80" />
      </div>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-8 relative z-20"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Sabio-IA
            </Badge>
          </motion.div>

          {/* Main headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Educación tributaria,
              </span>
              <br />
              <span className="text-foreground">clara y práctica</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Aprende tributación con cursos prácticos, asesorías personalizadas e 
              inteligencia artificial. Para profesionales que buscan excelencia.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero text-lg px-8 py-4" asChild>
              <Link to="/courses">
                Explorar cursos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/10" 
              asChild
            >
              <Link to="/advisory">
                Asesoría personalizada
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={itemVariants} className="pt-8">
            <p className="text-muted-foreground mb-6 font-medium">
              Trusted by professionals and students — join the community
            </p>
            <div className="flex items-center justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground font-medium">
                4.8/5 based on 1,200+ reviews
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 hidden lg:block z-5"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-3 bg-card/10 backdrop-blur-sm rounded-lg border border-border/20 shadow-lg">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-16 hidden lg:block z-5"
        animate={{
          y: [10, -10, 10],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-3 bg-card/10 backdrop-blur-sm rounded-lg border border-border/20 shadow-lg">
          <Users className="h-6 w-6 text-primary" />
        </div>
      </motion.div>
    </section>
  );
}