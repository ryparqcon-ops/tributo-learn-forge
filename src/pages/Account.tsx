import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { useUserStats } from '@/hooks/use-user-stats';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { cn } from '@/lib/utils';

const Account = () => {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { 
    profile, 
    isLoading: profileLoading, 
    updateProfile, 
    updatePassword, 
    deleteAccount,
    isUpdating,
    isUpdatingPassword,
    isDeleting
  } = useUserProfile();
  const { 
    preferences, 
    isLoading: preferencesLoading, 
    updatePreferences, 
    isUpdating: isUpdatingPreferences 
  } = useUserPreferences();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    position: '',
    website: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Actualizar formData cuando el perfil cambie
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        company: profile.company || '',
        position: profile.position || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  const handleSave = () => {
    // Filtrar el campo email ya que no existe en la tabla profiles
    const { email, ...profileData } = formData;
    updateProfile(profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        company: profile.company || '',
        position: profile.position || '',
        website: profile.website || '',
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordDialog(false);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    if (preferences) {
      updatePreferences({ [field]: value });
    }
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    if (preferences) {
      updatePreferences({ [field]: value });
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      deleteAccount();
    }
  };

  // Mostrar loading si los datos están cargando
  if (profileLoading || preferencesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando perfil...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">
              Gestiona tu información personal y preferencias
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isUpdating ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl">{profile?.full_name || 'Usuario'}</CardTitle>
                <p className="text-muted-foreground">{profile?.position || 'Sin cargo'}</p>
                <div className="mt-3 flex justify-center">
                  <Badge 
                    variant="outline" 
                    className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {profile?.role === 'student' ? 'Estudiante' : 
                     profile?.role === 'instructor' ? 'Instructor' : 
                     profile?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                    <Clock className="h-5 w-5" />
                    {statsLoading ? '...' : `${stats?.totalHoursStudied || 0}h`}
                  </div>
                  <p className="text-sm text-muted-foreground">Horas estudiadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                    <BookOpen className="h-5 w-5" />
                    {statsLoading ? '...' : stats?.coursesCompleted || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Cursos completados</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                    <TrendingUp className="h-5 w-5" />
                    {statsLoading ? '...' : `${stats?.averageProgress || 0}%`}
                  </div>
                  <p className="text-sm text-muted-foreground">Progreso promedio</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                    <Users className="h-5 w-5" />
                    {statsLoading ? '...' : stats?.completedAdvisorySessions || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Asesorías completadas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Detailed Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estadísticas Detalladas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {statsLoading ? '...' : stats?.totalEnrollments || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Cursos inscritos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {statsLoading ? '...' : stats?.totalAdvisorySessions || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Asesorías totales</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {statsLoading ? '...' : `${Math.round((stats?.completedAdvisorySessions || 0) / Math.max(stats?.totalAdvisorySessions || 1, 1) * 100)}%`}
                    </div>
                    <p className="text-sm text-muted-foreground">Asesorías completadas</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {statsLoading ? '...' : `${Math.round((stats?.coursesCompleted || 0) / Math.max(stats?.totalEnrollments || 1, 1) * 100)}%`}
                    </div>
                    <p className="text-sm text-muted-foreground">Cursos finalizados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={true}
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">El correo no se puede cambiar</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Cuéntanos sobre ti..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Información Profesional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio web</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://tu-sitio-web.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificaciones por correo</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones sobre tus cursos y asesorías
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences?.email_notifications || false}
                    onCheckedChange={(value) => handleNotificationChange('email_notifications', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Notificaciones push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones en tu navegador
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences?.push_notifications || false}
                    onCheckedChange={(value) => handleNotificationChange('push_notifications', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">Notificaciones SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe recordatorios por mensaje de texto
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences?.sms_notifications || false}
                    onCheckedChange={(value) => handleNotificationChange('sms_notifications', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe ofertas especiales y nuevos cursos
                    </p>
                  </div>
                  <Switch
                    id="marketing-notifications"
                    checked={preferences?.marketing_notifications || false}
                    onCheckedChange={(value) => handleNotificationChange('marketing_notifications', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-public">Perfil público</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros usuarios vean tu perfil
                    </p>
                  </div>
                  <Switch
                    id="profile-public"
                    checked={preferences?.profile_public || false}
                    onCheckedChange={(value) => handlePrivacyChange('profile_public', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Mostrar correo electrónico</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros vean tu correo electrónico
                    </p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={preferences?.show_email || false}
                    onCheckedChange={(value) => handlePrivacyChange('show_email', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone">Mostrar teléfono</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros vean tu número de teléfono
                    </p>
                  </div>
                  <Switch
                    id="show-phone"
                    checked={preferences?.show_phone || false}
                    onCheckedChange={(value) => handlePrivacyChange('show_phone', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-location">Mostrar ubicación</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros vean tu ubicación
                    </p>
                  </div>
                  <Switch
                    id="show-location"
                    checked={preferences?.show_location || false}
                    onCheckedChange={(value) => handlePrivacyChange('show_location', value)}
                    disabled={isUpdatingPreferences}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-600">Cambiar contraseña</h4>
                    <p className="text-sm text-muted-foreground">
                      Actualiza tu contraseña para mantener tu cuenta segura
                    </p>
                  </div>
                  <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Cambiar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Contraseña actual</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nueva contraseña</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handlePasswordSubmit}
                            disabled={isUpdatingPassword}
                          >
                            {isUpdatingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Cambiar Contraseña
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-600">Eliminar cuenta</h4>
                    <p className="text-sm text-muted-foreground">
                      Elimina permanentemente tu cuenta y todos los datos asociados
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
