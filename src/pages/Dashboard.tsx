import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';
import { BookOpen, Calendar, User, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { DashboardCourses } from '@/components/dashboard/dashboard-courses';
import { DashboardMeetings } from '@/components/dashboard/dashboard-meetings';
import CoursePlayer from './CoursePlayer';
import { cn } from '@/lib/utils';

const DashboardHome = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-muted-foreground mb-8">
          Continúa tu aprendizaje y revisa tu progreso
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2</div>
              <p className="text-xs text-muted-foreground">En progreso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">47%</div>
              <p className="text-xs text-muted-foreground">Completado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Asesoría</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">20</div>
              <p className="text-xs text-muted-foreground">Ene, 4:00 PM</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Estudiadas</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">24h</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto p-4 flex flex-col items-center space-y-2 btn-primary" asChild>
                <Link to="/dashboard/courses">
                  <BookOpen className="h-6 w-6" />
                  <span>Continuar Aprendiendo</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                <Link to="/dashboard/advisory">
                  <Calendar className="h-6 w-6" />
                  <span>Mis Asesorías</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                <Link to="/courses">
                  <BookOpen className="h-6 w-6" />
                  <span>Explorar Cursos</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const sidebarItems = [
    { name: 'Panel General', href: '/dashboard', icon: BarChart3 },
    { name: 'Mis Cursos', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Asesorías', href: '/dashboard/advisory', icon: Calendar },
    { name: 'Mi Perfil', href: '/dashboard/account', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen py-6 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-xl border p-4 lg:p-6 shadow-sm">
                <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 text-foreground">Navegación</h3>
                <nav className="space-y-2 lg:space-y-3">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "group flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 lg:p-2 rounded-lg transition-colors flex-shrink-0",
                        isActive(item.href)
                          ? "bg-primary-foreground/20"
                          : "bg-muted group-hover:bg-muted/80"
                      )}>
                        <item.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                      <span className="font-medium truncate">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="courses" element={<DashboardCourses />} />
        <Route path="advisory" element={<DashboardMeetings />} />
        <Route path="account" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Configuración de Cuenta</h2><p className="text-muted-foreground">Próximamente...</p></div>} />
        <Route path="course/:courseId" element={<CoursePlayer />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;