import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, Edit, Trash2, Download } from 'lucide-react';

interface Portfolio {
  id: string;
  full_name: string;
  specialty: string;
  slug: string;
  is_published: boolean;
  created_at: string;
  profile_image: string | null;
}

export default function MyPortfoliosPage() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation('/login');
      } else {
        fetchPortfolios();
      }
    }
  }, [user, authLoading]);

  const fetchPortfolios = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_portfolios')
        .select('id, full_name, specialty, slug, is_published, created_at, profile_image')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      const { error } = await supabase
        .from('user_portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Portfolio deleted successfully',
      });
      fetchPortfolios();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_portfolios')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Portfolio ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });
      fetchPortfolios();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Portfolios</h1>
          <p className="text-muted-foreground">
            Manage and view all your portfolios
          </p>
        </div>
        <Button onClick={() => setLocation('/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Portfolio
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't created any portfolios yet
            </p>
            <Button onClick={() => setLocation('/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="overflow-hidden">
              {portfolio.profile_image && (
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={portfolio.profile_image}
                    alt={portfolio.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{portfolio.full_name}</CardTitle>
                    <CardDescription>{portfolio.specialty}</CardDescription>
                  </div>
                  <Badge variant={portfolio.is_published ? 'default' : 'secondary'}>
                    {portfolio.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Created {new Date(portfolio.created_at).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLocation(`/portfolio/${portfolio.slug}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish(portfolio.id, portfolio.is_published)}
                  >
                    {portfolio.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(portfolio.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
