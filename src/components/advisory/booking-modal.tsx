import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  X, 
  CheckCircle,
  AlertCircle,
  CreditCard,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store/auth-store';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    duration: string;
    price: string;
    description: string;
    features: string[];
  };
}

const BookingModal = ({ isOpen, onClose, service }: BookingModalProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    subject: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    paymentMethod: '',
    specialRequirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const paymentMethods = [
    { value: 'paypal', label: 'PayPal', icon: '💳' },
    { value: 'stripe', label: 'Tarjeta de Crédito', icon: '💳' },
    { value: 'yape', label: 'Yape', icon: '📱' },
    { value: 'plin', label: 'Plin', icon: '📱' },
    { value: 'transfer', label: 'Transferencia Bancaria', icon: '🏦' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simular envío de reserva
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Cerrar modal después de 3 segundos
    setTimeout(() => {
      onClose();
      setStep(1);
      setIsSuccess(false);
    }, 3000);
  };

  const formatPrice = (price: string) => {
    return price.replace('S/ ', '');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Reservar Asesoría</h2>
              <p className="text-sm text-muted-foreground">{service.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= stepNumber 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      step > stepNumber ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Información</span>
              <span>Horario</span>
              <span>Confirmación</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">¡Reserva Confirmada!</h3>
                <p className="text-muted-foreground mb-4">
                  Te hemos enviado un email de confirmación con los detalles de tu asesoría.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h4 className="font-medium mb-2">Detalles de la reserva:</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Servicio:</strong> {service.title}</p>
                    <p><strong>Fecha:</strong> {formData.preferredDate}</p>
                    <p><strong>Hora:</strong> {formData.preferredTime}</p>
                    <p><strong>Duración:</strong> {service.duration}</p>
                    <p><strong>Precio:</strong> {service.price}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Step 1: Información Personal */}
                {step === 1 && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nombre completo *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="tu@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Teléfono *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+51 999 999 999"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Empresa (opcional)</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Nombre de tu empresa"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Detalles de la consulta</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Asunto de la consulta *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="Ej: Consulta sobre IGV en exportaciones"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descripción detallada *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe tu consulta con el mayor detalle posible..."
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Selección de Horario */}
                {step === 2 && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Selecciona tu horario</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="date">Fecha preferida *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Hora preferida *</Label>
                          <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una hora" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Método de pago</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {paymentMethods.map((method) => (
                          <Button
                            key={method.value}
                            variant={formData.paymentMethod === method.value ? "default" : "outline"}
                            className="h-auto p-3 flex flex-col items-center space-y-1"
                            onClick={() => handleInputChange('paymentMethod', method.value)}
                          >
                            <span className="text-lg">{method.icon}</span>
                            <span className="text-xs">{method.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="requirements">Requisitos especiales (opcional)</Label>
                      <Textarea
                        id="requirements"
                        value={formData.specialRequirements}
                        onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                        placeholder="Algún requerimiento especial para la sesión..."
                        rows={3}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmación */}
                {step === 3 && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Confirma tu reserva</h3>
                      
                      {/* Resumen del servicio */}
                      <Card className="mb-6">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Duración:</span>
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Precio:</span>
                            <span className="font-semibold text-primary">{service.price}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Detalles de la reserva */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Fecha:</span>
                            <p className="font-medium">{formData.preferredDate}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hora:</span>
                            <p className="font-medium">{formData.preferredTime}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <span className="text-muted-foreground">Asunto:</span>
                          <p className="font-medium">{formData.subject}</p>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Método de pago:</span>
                          <p className="font-medium">
                            {paymentMethods.find(m => m.value === formData.paymentMethod)?.label}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">Importante:</p>
                            <p>Te enviaremos un email de confirmación con el enlace de la videollamada 24 horas antes de tu cita.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={step === 1 ? onClose : handleBack}
                    disabled={isSubmitting}
                  >
                    {step === 1 ? 'Cancelar' : 'Anterior'}
                  </Button>
                  
                  {step < 3 ? (
                    <Button onClick={handleNext} disabled={!formData.name || !formData.email || !formData.phone}>
                      Siguiente
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting || !formData.preferredDate || !formData.preferredTime || !formData.paymentMethod}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        'Confirmar Reserva'
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;


