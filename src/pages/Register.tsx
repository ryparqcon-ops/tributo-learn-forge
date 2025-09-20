import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/hooks/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'professional', 'company']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      console.log('📝 Iniciando registro...');
      // Usar el método register del auth store que ahora usa Supabase
      const { register } = useAuthStore.getState();
      await register(data.email, data.password, data.name);
      
      console.log('✅ Registro completado en el formulario');
      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente. Revisa tu email para confirmar tu cuenta.",
      });
    } catch (error: any) {
      console.error('❌ Error en el formulario:', error);
      toast({
        title: "Error",
        description: error?.message || "No se pudo crear la cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold hero-title">Entributos</span>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
              <CardDescription>
                Únete a nuestra comunidad de profesionales tributarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre completo"
                    {...register('name')}
                    className="form-input"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email')}
                    className="form-input"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de cuenta</Label>
                  <Select onValueChange={(value) => setValue('role', value as any)}>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Selecciona tu tipo de cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="professional">Profesional</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className="form-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      className="form-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border border-border"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      términos y condiciones
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>

              <div className="text-center mt-6">
                <span className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Iniciar sesión
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;