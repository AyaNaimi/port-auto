import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Module {
  id: string;
  name: string;
  description: string | null;
  template_code: string;
  preview_image: string | null;
  is_free: boolean;
  price: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

export function ModuleManager() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_code: '',
    preview_image: '',
    is_free: true,
    price: 0,
    category: 'general',
    is_active: true,
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_modules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModules(data || []);
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      template_code: '',
      preview_image: '',
      is_free: true,
      price: 0,
      category: 'general',
      is_active: true,
    });
    setEditingModule(null);
  };

  const handleOpenDialog = (module?: Module) => {
    if (module) {
      setEditingModule(module);
      setFormData({
        name: module.name,
        description: module.description || '',
        template_code: module.template_code,
        preview_image: module.preview_image || '',
        is_free: module.is_free,
        price: module.price,
        category: module.category,
        is_active: module.is_active,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const moduleData = {
        ...formData,
        created_by: user.id,
      };

      if (editingModule) {
        const { error } = await supabase
          .from('portfolio_modules')
          .update(moduleData)
          .eq('id', editingModule.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Module updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('portfolio_modules')
          .insert([moduleData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Module created successfully',
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchModules();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Module deleted successfully',
      });
      fetchModules();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading modules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolio Modules</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingModule ? 'Edit Module' : 'Create New Module'}
              </DialogTitle>
              <DialogDescription>
                {editingModule
                  ? 'Update the module information below'
                  : 'Fill in the details to create a new portfolio module'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Module Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., modern, minimal, creative"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template_code">Template Code</Label>
                <Textarea
                  id="template_code"
                  value={formData.template_code}
                  onChange={(e) => setFormData({ ...formData, template_code: e.target.value })}
                  placeholder="Enter complete React component code"
                  rows={8}
                  required
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview_image">Preview Image URL</Label>
                <Input
                  id="preview_image"
                  value={formData.preview_image}
                  onChange={(e) => setFormData({ ...formData, preview_image: e.target.value })}
                  placeholder="https://example.com/image.png"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_free"
                  checked={formData.is_free}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked, price: checked ? 0 : formData.price })}
                />
                <Label htmlFor="is_free">Free Module</Label>
              </div>

              {!formData.is_free && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingModule ? 'Update' : 'Create'} Module
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {module.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(module)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(module.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {module.preview_image && (
                <img
                  src={module.preview_image}
                  alt={module.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <div className="flex flex-wrap gap-2">
                <Badge variant={module.is_free ? 'default' : 'secondary'}>
                  {module.is_free ? 'Free' : `$${module.price}`}
                </Badge>
                <Badge variant="outline">{module.category}</Badge>
                {module.is_active ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modules.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No modules found. Create your first module to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
