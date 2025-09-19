import { useState } from 'react';
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
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

const Account = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    company: user?.company || '',
    position: user?.position || '',
    website: user?.website || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showLocation: false,
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      company: user?.company || '',
      position: user?.position || '',
      website: user?.website || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

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
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
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
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user?.name?.charAt(0) || 'U'}
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
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <p className="text-muted-foreground">{user?.position}</p>
                <div className="mt-3 flex justify-center">
                  <Badge 
                    variant="outline" 
                    className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {user?.role === 'student' ? 'Estudiante' : 
                     user?.role === 'instructor' ? 'Instructor' : 
                     user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24h</div>
                  <p className="text-sm text-muted-foreground">Horas estudiadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <p className="text-sm text-muted-foreground">Cursos completados</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <p className="text-sm text-muted-foreground">Progreso promedio</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
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
                      disabled={!isEditing}
                    />
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
                    checked={notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
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
                    checked={notifications.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
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
                    checked={notifications.sms}
                    onCheckedChange={(value) => handleNotificationChange('sms', value)}
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
                    checked={notifications.marketing}
                    onCheckedChange={(value) => handleNotificationChange('marketing', value)}
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
                    checked={privacy.profilePublic}
                    onCheckedChange={(value) => handlePrivacyChange('profilePublic', value)}
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
                    checked={privacy.showEmail}
                    onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
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
                    checked={privacy.showPhone}
                    onCheckedChange={(value) => handlePrivacyChange('showPhone', value)}
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
                    checked={privacy.showLocation}
                    onCheckedChange={(value) => handlePrivacyChange('showLocation', value)}
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
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    Cambiar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-600">Eliminar cuenta</h4>
                    <p className="text-sm text-muted-foreground">
                      Elimina permanentemente tu cuenta y todos los datos asociados
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
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
