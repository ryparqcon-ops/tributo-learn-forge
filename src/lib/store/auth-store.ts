import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, type User as SupabaseUser } from '../supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  enrolled?: string[];
  progress?: Record<string, number>;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  company?: string;
  position?: string;
  website?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          console.log('🔐 Intentando login con:', email);
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('❌ Error en login:', error);
            throw error;
          }

          console.log('✅ Login exitoso:', data.user?.email);

          if (data.user) {
            // Obtener datos del usuario desde la base de datos
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) {
              console.error('❌ Error obteniendo perfil:', profileError);
              // Crear usuario básico como fallback
              const user: User = {
                id: data.user.id,
                name: data.user.user_metadata?.full_name || 'Usuario',
                email: data.user.email!,
                role: 'student',
                enrolled: [],
                progress: {},
                avatar: data.user.user_metadata?.avatar_url,
              };
              set({ 
                user, 
                token: data.session?.access_token || null, 
                isAuthenticated: true,
                isLoading: false 
              });
              return;
            }

            // Obtener inscripciones del usuario
            const { data: enrollments, error: enrollmentsError } = await supabase
              .from('enrollments')
              .select('course_id, progress_percentage')
              .eq('student_id', data.user.id)
              .eq('is_active', true);

            if (enrollmentsError) {
              console.error('❌ Error obteniendo inscripciones:', enrollmentsError);
            }

            // Crear objeto de progreso
            const progress: Record<string, number> = {};
            const enrolled: string[] = [];
            
            if (enrollments) {
              enrollments.forEach(enrollment => {
                enrolled.push(enrollment.course_id);
                progress[enrollment.course_id] = enrollment.progress_percentage || 0;
              });
            }

            const user: User = {
              id: data.user.id,
              name: profile.full_name || data.user.user_metadata?.full_name || 'Usuario',
              email: data.user.email!,
              role: 'student',
              enrolled,
              progress,
              avatar: profile.avatar_url || data.user.user_metadata?.avatar_url,
              phone: profile.phone,
              bio: profile.bio,
            };

            console.log('👤 Usuario creado con datos reales:', user);
            set({ 
              user, 
              token: data.session?.access_token || null, 
              isAuthenticated: true,
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('❌ Error en login:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          console.log('📝 Intentando registro con:', email);
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
              }
            }
          });

          if (error) {
            console.error('❌ Error en registro:', error);
            throw error;
          }

          console.log('✅ Registro exitoso:', data.user?.email);
          
          // Crear perfil del usuario en la base de datos
          if (data.user) {
            console.log('👤 Creando perfil para usuario:', data.user.id);
            console.log('📧 Email del usuario:', email);
            console.log('👤 Nombre del usuario:', name);
            
            const profileData = {
              id: data.user.id,
              full_name: name,
              email: email,
              role: 'student',
              enrolled_courses: [],
              course_progress: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            console.log('📋 Datos del perfil:', profileData);
            
            const { data: insertedData, error: profileError } = await supabase
              .from('profiles')
              .insert(profileData)
              .select();

            if (profileError) {
              console.error('❌ Error creating profile:', profileError);
              console.error('❌ Detalles del error:', profileError.message);
              console.error('❌ Código del error:', profileError.code);
            } else {
              console.log('✅ Perfil creado correctamente:', insertedData);
            }
          } else {
            console.log('❌ No hay usuario en la respuesta');
          }
        } catch (error) {
          console.error('❌ Error en registro:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error during logout:', error);
        } finally {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      updateUser: async (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          try {
            // Actualizar en Supabase
            const { error } = await supabase
              .from('profiles')
              .update({
                full_name: userData.name,
                phone: userData.phone,
                location: userData.location,
                bio: userData.bio,
                company: userData.company,
                position: userData.position,
                website: userData.website,
                avatar_url: userData.avatar,
                updated_at: new Date().toISOString(),
              })
              .eq('id', currentUser.id);

            if (error) throw error;

            // Actualizar en el store
            set({ 
              user: { ...currentUser, ...userData }
            });
          } catch (error) {
            console.error('Error updating user:', error);
            throw error;
          }
        }
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          console.log('🔍 Verificando sesión con Supabase...');
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Error obteniendo sesión:', error);
            set({ isLoading: false });
            return;
          }
          
          console.log('📋 Sesión encontrada:', session ? 'Sí' : 'No');
          
          if (session?.user) {
            console.log('👤 Usuario encontrado:', session.user.email);
            
            // Obtener datos del usuario desde la base de datos
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('❌ Error obteniendo perfil:', profileError);
              // Crear usuario básico como fallback
              const user: User = {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || 'Usuario',
                email: session.user.email!,
                role: 'student',
                enrolled: [],
                progress: {},
                avatar: session.user.user_metadata?.avatar_url,
              };
              set({ user, token: session.access_token, isAuthenticated: true, isLoading: false });
              return;
            }

            // Obtener inscripciones del usuario
            const { data: enrollments, error: enrollmentsError } = await supabase
              .from('enrollments')
              .select('course_id, progress_percentage')
              .eq('student_id', session.user.id)
              .eq('is_active', true);

            if (enrollmentsError) {
              console.error('❌ Error obteniendo inscripciones:', enrollmentsError);
            }

            // Crear objeto de progreso
            const progress: Record<string, number> = {};
            const enrolled: string[] = [];
            
            if (enrollments) {
              enrollments.forEach(enrollment => {
                enrolled.push(enrollment.course_id);
                progress[enrollment.course_id] = enrollment.progress_percentage || 0;
              });
            }

            const user: User = {
              id: session.user.id,
              name: profile.full_name || session.user.user_metadata?.full_name || 'Usuario',
              email: session.user.email!,
              role: 'student',
              enrolled,
              progress,
              avatar: profile.avatar_url || session.user.user_metadata?.avatar_url,
              phone: profile.phone,
              bio: profile.bio,
            };

            console.log('✅ Usuario configurado con datos reales:', user);
            set({ 
              user, 
              token: session.access_token, 
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            console.log('ℹ️ No hay sesión activa');
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('❌ Error checking session:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'entributos-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);