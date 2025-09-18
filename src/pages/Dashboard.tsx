import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardHome = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-8">
            Bienvenido, {user?.name}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cursos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">2</div>
                <p className="text-muted-foreground">En progreso</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progreso Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">45%</div>
                <p className="text-muted-foreground">Completado</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Próxima Asesoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">28</div>
                <p className="text-muted-foreground">Sep, 4:00 PM</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      {/* Add more dashboard routes here */}
    </Routes>
  );
};

export default Dashboard;