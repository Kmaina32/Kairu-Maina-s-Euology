
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X, Trash2 } from 'lucide-react';

interface BiographyContent {
  id: string;
  section_type: string;
  title: string;
  content: string;
  order_index: number;
  is_published: boolean;
}

const BiographyManager = () => {
  const [content, setContent] = useState<BiographyContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    section_type: 'biography',
    title: '',
    content: '',
    order_index: 0,
    is_published: true
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('biography_content')
      .select('*')
      .order('section_type', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    } else {
      setContent(data || []);
    }
  };

  const handleSave = async (item: BiographyContent) => {
    const { error } = await supabase
      .from('biography_content')
      .update({
        title: item.title,
        content: item.content,
        section_type: item.section_type,
        order_index: item.order_index,
        is_published: item.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      setEditingId(null);
      fetchContent();
    }
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('biography_content')
      .insert([newItem]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      setShowNewForm(false);
      setNewItem({
        section_type: 'biography',
        title: '',
        content: '',
        order_index: 0,
        is_published: true
      });
      fetchContent();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('biography_content')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      fetchContent();
    }
  };

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.section_type]) {
      acc[item.section_type] = [];
    }
    acc[item.section_type].push(item);
    return acc;
  }, {} as Record<string, BiographyContent[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Biography & Life Content</h2>
          <p className="text-slate-600">Manage all biography sections including milestones</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Content
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={newItem.section_type}
              onValueChange={(value) => setNewItem({ ...newItem, section_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="biography">Biography</SelectItem>
                <SelectItem value="achievements">Achievements</SelectItem>
                <SelectItem value="declaration">Declaration</SelectItem>
                <SelectItem value="milestone">Life Milestone</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Textarea
              placeholder="Content"
              value={newItem.content}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              rows={4}
            />
            <Input
              type="number"
              placeholder="Order Index"
              value={newItem.order_index}
              onChange={(e) => setNewItem({ ...newItem, order_index: parseInt(e.target.value) || 0 })}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">Save</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.entries(groupedContent).map(([sectionType, items]) => (
        <div key={sectionType} className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 capitalize border-b pb-2">
            {sectionType === 'milestone' ? 'Life Milestones' : sectionType}
          </h3>
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-slate-800">{item.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                      >
                        {editingId === item.id ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingId === item.id ? (
                    <div className="space-y-4">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const updated = content.map((c) =>
                            c.id === item.id ? { ...c, title: e.target.value } : c
                          );
                          setContent(updated);
                        }}
                        placeholder="Title"
                      />
                      <Textarea
                        value={item.content}
                        onChange={(e) => {
                          const updated = content.map((c) =>
                            c.id === item.id ? { ...c, content: e.target.value } : c
                          );
                          setContent(updated);
                        }}
                        rows={4}
                        placeholder="Content"
                      />
                      <div className="flex gap-4">
                        <Input
                          type="number"
                          value={item.order_index}
                          onChange={(e) => {
                            const updated = content.map((c) =>
                              c.id === item.id ? { ...c, order_index: parseInt(e.target.value) || 0 } : c
                            );
                            setContent(updated);
                          }}
                          placeholder="Order Index"
                          className="w-32"
                        />
                        <Select
                          value={item.section_type}
                          onValueChange={(value) => {
                            const updated = content.map((c) =>
                              c.id === item.id ? { ...c, section_type: value } : c
                            );
                            setContent(updated);
                          }}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="biography">Biography</SelectItem>
                            <SelectItem value="achievements">Achievements</SelectItem>
                            <SelectItem value="declaration">Declaration</SelectItem>
                            <SelectItem value="milestone">Life Milestone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={() => handleSave(item)} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-600 mb-2">{item.content}</p>
                      <div className="flex justify-between items-center text-sm text-slate-500">
                        <span>Order: {item.order_index}</span>
                        <span>Status: {item.is_published ? 'Published' : 'Draft'}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BiographyManager;
