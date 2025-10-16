import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  BookOpen, 
  Calendar, 
  User, 
  LogOut,
  Bell,
  Award,
  Users,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useUIStore } from '@/lib/store/ui-store';
import { NavbarSearch } from '@/components/search/navbar-search';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { setSearchQuery } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const navigation = [
    { name: 'Cursos', href: '/courses', icon: BookOpen },
    { name: 'Asesorías', href: '/advisory', icon: Calendar },
    { name: 'Planes', href: '/pricing', icon: Award },
    { name: 'Nosotros', href: '/about', icon: Users },
    { name: 'Contacto', href: '/contact', icon: Mail },
    { name: 'Mi Panel', href: '/dashboard', icon: User, protected: true },
  ];

  const isActive = (href: string) => location.pathname.startsWith(href);

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsSubscribing(true);
    setSubscriptionMessage('');

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionMessage('¡Gracias! Te has suscrito correctamente.');
      setNewsletterEmail('');
    } catch (error) {
      setSubscriptionMessage('Error al suscribirse. Inténtalo de nuevo.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold hero-title">Entributos</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Cursos Dropdown */}
              <DropdownMenu open={coursesDropdownOpen} onOpenChange={setCoursesDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center space-x-1.5 px-3 py-2 h-9 text-sm font-medium transition-all duration-200",
                      (isActive('/courses') || isActive('/instructors'))
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Cursos</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200" style={{
                      transform: coursesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 mt-1">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Educación
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/courses" className="flex items-center space-x-3 w-full px-3 py-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Catálogo de Cursos</div>
                        <div className="text-xs text-muted-foreground">Explora todos los cursos</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/instructors" className="flex items-center space-x-3 w-full px-3 py-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Nuestros Instructores</div>
                        <div className="text-xs text-muted-foreground">Conoce a los expertos</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Other Navigation Items */}
              {navigation.slice(1).map((item) => {
                if (item.protected && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-1.5 px-3 py-2 h-9 text-sm font-medium transition-all duration-200 rounded-md",
                      isActive(item.href)
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Search */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-64">
                <NavbarSearch
                  placeholder="Buscar cursos..."
                  onSearch={(query) => setSearchQuery(query)}
                />
              </div>
              
              {/* Theme Switch */}
              <ThemeSwitch />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button className="btn-primary" asChild>
                    <Link to="/register">Registrarse</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="pb-4 border-b border-border">
                <NavbarSearch
                  placeholder="Buscar cursos..."
                  onSearch={(query) => {
                    setSearchQuery(query);
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
              
              {/* Mobile Theme Switch */}
              <div className="pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tema</span>
                  <ThemeSwitch />
                </div>
              </div>
              
              {/* Cursos Section in Mobile */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Educación
                </div>
                <Link
                  to="/courses"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive('/courses')
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Catálogo de Cursos</div>
                    <div className="text-xs text-muted-foreground">Explora todos los cursos</div>
                  </div>
                </Link>
                <Link
                  to="/instructors"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive('/instructors')
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Nuestros Instructores</div>
                    <div className="text-xs text-muted-foreground">Conoce a los expertos</div>
                  </div>
                </Link>
              </div>

              {/* Other Navigation Items */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Servicios
                </div>
                {navigation.slice(1).map((item) => {
                  if (item.protected && !isAuthenticated) return null;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "text-primary bg-primary/10 border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              {isAuthenticated ? (
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Hola, {user?.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border space-y-2">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button className="w-full btn-primary" asChild>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* WhatsApp Button */}
      <WhatsAppButton 
        phoneNumber="+51999888777"
        message="Hola! Me interesa conocer más sobre los cursos de tributación de Entributos. ¿Podrían ayudarme con información?"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold hero-title">Entributos</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                Educación tributaria clara y práctica para profesionales y empresas.
              </p>
              
              {/* Social Media */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Síguenos</h4>
                <div className="flex space-x-3">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Cursos Section */}
            <div>
              <h3 className="font-semibold mb-4">Cursos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/courses" className="hover:text-foreground transition-colors">Catálogo</Link></li>
                <li><Link to="/courses?level=basic" className="hover:text-foreground transition-colors">Básicos</Link></li>
                <li><Link to="/courses?level=advanced" className="hover:text-foreground transition-colors">Avanzados</Link></li>
                <li><Link to="/instructors" className="hover:text-foreground transition-colors">Instructores</Link></li>
              </ul>
            </div>

            {/* Categorías Populares */}
            <div>
              <h3 className="font-semibold mb-4">Más buscadas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/courses?category=iva" className="hover:text-foreground transition-colors">IVA</Link></li>
                <li><Link to="/courses?category=renta" className="hover:text-foreground transition-colors">Renta</Link></li>
                <li><Link to="/courses?category=empresas" className="hover:text-foreground transition-colors">Empresas</Link></li>
                <li><Link to="/courses?category=autonomos" className="hover:text-foreground transition-colors">Autónomos</Link></li>
                <li><Link to="/courses?category=contabilidad" className="hover:text-foreground transition-colors">Contabilidad</Link></li>
              </ul>
            </div>
            
            {/* Servicios Section */}
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/advisory" className="hover:text-foreground transition-colors">Asesorías 1:1</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Planes</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contacto</Link></li>
              </ul>
            </div>
            
            {/* Empresa Section */}
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">Nosotros</Link></li>
                <li>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center space-x-1"
                  >
                    <span>Powered by Tributin-IA</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-lg font-semibold mb-2">Mantente informado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Recibe las últimas novedades, cursos y actualizaciones fiscales directamente en tu correo.
              </p>
              <form onSubmit={handleNewsletterSubscription} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing || !newsletterEmail.trim()}
                  className="px-6"
                >
                  {isSubscribing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      <span>Suscribiendo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Suscribirse</span>
                    </div>
                  )}
                </Button>
              </form>
              {subscriptionMessage && (
                <p className={`text-sm mt-3 ${
                  subscriptionMessage.includes('Gracias') 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {subscriptionMessage}
                </p>
              )}
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Copyright */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
                <p>© 2025 Entributos. Todos los derechos reservados.</p>
                <div className="flex space-x-4">
                  <a href="/terms" className="hover:text-foreground transition-colors">Términos y Condiciones</a>
                  <a href="/privacy" className="hover:text-foreground transition-colors">Política de Privacidad</a>
                </div>
              </div>
              
              {/* Trust Badge */}
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Confiado por profesionales y estudiantes</span>
                </div>
                <span className="hidden sm:inline text-muted-foreground/50">—</span>
                <span className="sm:ml-0">Únete a la comunidad</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}