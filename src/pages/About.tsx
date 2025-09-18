import { motion } from 'framer-motion';
import { Users, Target, Award, Sparkles, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Claridad",
      description: "Simplificamos conceptos complejos para un aprendizaje efectivo"
    },
    {
      icon: Award,
      title: "Excelencia",
      description: "Contenido de la más alta calidad respaldado por expertos"
    },
    {
      icon: Users,
      title: "Accesibilidad",
      description: "Educación tributaria para profesionales de todos los niveles"
    },
    {
      icon: Sparkles,
      title: "Innovación",
      description: "Tecnología de vanguardia con inteligencia artificial"
    }
  ];

  const team = [
    {
      name: "Arash",
      role: "Fundador y CEO",
      description: "Experto en tributación con más de 15 años de experiencia",
      avatar: "https://i.pravatar.cc/150?u=arash"
    },
    {
      name: "Andrea",
      role: "Directora Académica",
      description: "Especialista en IVA y normativa tributaria empresarial",
      avatar: "https://i.pravatar.cc/150?u=andrea"
    }
  ];

  const stats = [
    { label: "Estudiantes activos", value: "2,500+" },
    { label: "Cursos disponibles", value: "50+" },
    { label: "Horas de contenido", value: "200+" },
    { label: "Satisfacción", value: "4.8/5" }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Revolucionando la <span className="hero-title">educación tributaria</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            En Entributos creemos que la educación tributaria debe ser clara, práctica y accesible. 
            Combinamos la experiencia de expertos certificados con la innovación de la inteligencia artificial 
            para ofrecerte la mejor experiencia de aprendizaje.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-subtle border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Democratizar el acceso a la educación tributaria de calidad, proporcionando herramientas 
                prácticas y conocimiento actualizado que empodere a profesionales y empresas para tomar 
                decisiones financieras informadas y cumplir con sus obligaciones fiscales con confianza.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Partnership with Sabio-IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Powered by Sabio-IA</h2>
              <p className="text-xl mb-6 opacity-90">
                Nuestra alianza estratégica con Sabio-IA nos permite ofrecer contenido enriquecido 
                con inteligencia artificial, proporcionando insights personalizados y actualizaciones 
                en tiempo real de la normativa tributaria.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                asChild
              >
                <a 
                  href="https://sabio-ia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Conocer más sobre Sabio-IA
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para comenzar tu transformación profesional?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de profesionales que ya confían en Entributos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link to="/courses">
                <BookOpen className="h-5 w-5 mr-2" />
                Explorar Cursos
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/advisory">
                <Calendar className="h-5 w-5 mr-2" />
                Reservar Asesoría
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;