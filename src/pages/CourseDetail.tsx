import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${slug}`);
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return <div>Curso no encontrado</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{course.summary}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: course.currency,
                }).format(course.price_cents / 100)}
              </div>
              <Button size="lg" className="btn-primary">
                Inscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;