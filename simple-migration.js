// Script simple de migración - copiar y pegar en consola
// Ir a /test-supabase y ejecutar en consola del navegador

(function() {
  'use strict';
  
  // Obtener el cliente de Supabase
  const supabase = window.supabase || window.__supabase;
  
  if (!supabase) {
    console.error('❌ No se pudo encontrar el cliente de Supabase');
    return;
  }
  
  console.log('✅ Cliente de Supabase encontrado');
  
  // Función para migrar categorías
  async function migrateCategories() {
    console.log('🔄 Migrando categorías...');
    
    const categories = [
      {
        id: 'cat-1',
        name: 'Tributación Básica',
        slug: 'tributacion-basica',
        description: 'Fundamentos de la tributación empresarial',
        icon: '📚',
        color: '#3B82F6',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'cat-2',
        name: 'IVA',
        slug: 'iva',
        description: 'Impuesto al Valor Agregado',
        icon: '💰',
        color: '#10B981',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'cat-3',
        name: 'Impuesto a la Renta',
        slug: 'impuesto-renta',
        description: 'Impuesto a la Renta de Personas Naturales',
        icon: '📊',
        color: '#F59E0B',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'cat-4',
        name: 'Planillas',
        slug: 'planillas',
        description: 'Tributación laboral y planillas',
        icon: '👥',
        color: '#8B5CF6',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'cat-5',
        name: 'Fiscalización',
        slug: 'fiscalizacion',
        description: 'Defensa en fiscalizaciones SUNAT',
        icon: '🔍',
        color: '#EF4444',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'cat-6',
        name: 'Tributación Digital',
        slug: 'tributacion-digital',
        description: 'E-commerce y tributación digital',
        icon: '💻',
        color: '#06B6D4',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const category of categories) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert(category)
          .select()
          .single();
        
        if (error) {
          console.error('❌ Error creando categoría ' + category.name + ':', error);
          errorCount++;
        } else {
          console.log('✅ Categoría ' + category.name + ' creada correctamente');
          successCount++;
        }
      } catch (error) {
        console.error('❌ Error migrando categoría ' + category.name + ':', error);
        errorCount++;
      }
    }
    
    console.log('✅ Migración de categorías completada - Exitosos: ' + successCount + ', Errores: ' + errorCount);
    return { successCount: successCount, errorCount: errorCount };
  }
  
  // Función para verificar datos
  async function verifyData() {
    console.log('🔍 Verificando datos...');
    
    try {
      const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: instructorsCount } = await supabase.from('instructors').select('*', { count: 'exact', head: true });
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      const { count: lessonsCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true });
      
      console.log('📊 Categorías: ' + (categoriesCount || 0));
      console.log('👥 Perfiles: ' + (profilesCount || 0));
      console.log('👨‍🏫 Instructores: ' + (instructorsCount || 0));
      console.log('📚 Cursos: ' + (coursesCount || 0));
      console.log('🎥 Lecciones: ' + (lessonsCount || 0));
      
      return {
        categories: categoriesCount || 0,
        profiles: profilesCount || 0,
        instructors: instructorsCount || 0,
        courses: coursesCount || 0,
        lessons: lessonsCount || 0
      };
    } catch (error) {
      console.error('Error verificando datos:', error);
      throw error;
    }
  }
  
  // Función para probar inserción de perfil
  async function testProfile() {
    console.log('🧪 Probando inserción de perfil...');
    
    const profileData = {
      id: 'test-profile-123',
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error insertando perfil:', error);
        return false;
      }
      
      console.log('✅ Perfil insertado correctamente:', data);
      return true;
    } catch (err) {
      console.error('❌ Error en inserción de perfil:', err);
      return false;
    }
  }
  
  // Función para limpiar datos de prueba
  async function cleanup() {
    console.log('🧹 Limpiando datos de prueba...');
    
    try {
      await supabase.from('profiles').delete().eq('id', 'test-profile-123');
      console.log('✅ Datos de prueba limpiados');
    } catch (error) {
      console.error('❌ Error limpiando datos de prueba:', error);
    }
  }
  
  // Exportar funciones
  window.migration = {
    migrateCategories: migrateCategories,
    verifyData: verifyData,
    testProfile: testProfile,
    cleanup: cleanup
  };
  
  console.log('🔧 Funciones disponibles:');
  console.log('- migration.migrateCategories()');
  console.log('- migration.verifyData()');
  console.log('- migration.testProfile()');
  console.log('- migration.cleanup()');
  console.log('');
  console.log('🚀 Para empezar: migration.migrateCategories()');
  
})();
