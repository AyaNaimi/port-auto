import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { StripeCheckout } from '@/components/payment/StripeCheckout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ModulePaymentPage() {
  const [, params] = useRoute('/payment/:moduleId');
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation('/login');
      } else if (params?.moduleId) {
        fetchModule(params.moduleId);
      }
    }
  }, [user, authLoading, params]);

  const fetchModule = async (moduleId: string) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_modules')
        .select('*')
        .eq('id', moduleId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setLocation('/create');
        return;
      }

      setModule(data);
    } catch (error) {
      console.error('Error fetching module:', error);
      setLocation('/create');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setLocation('/create');
  };

  const handleCancel = () => {
    setLocation('/create');
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!module) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => setLocation('/create')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Purchase Module</h1>
          <p className="text-muted-foreground">
            Complete your purchase to unlock this premium template
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{module.name}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {module.preview_image && (
                <img
                  src={module.preview_image}
                  alt={module.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{module.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-lg">${module.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <StripeCheckout
            moduleId={module.id}
            moduleName={module.name}
            amount={module.price}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
