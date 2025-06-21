
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload } from 'lucide-react';

interface WillWish {
  id: string;
  title: string;
  content: string;
  file_url: string | null;
  access_password: string;
  is_published: boolean;
}

const WillManager = () => {
  const [willContent, setWillContent] = useState<WillWish | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWillContent();
  }, []);

  const fetchWillContent = async () => {
    const { data, error } = await supabase
      .from('will_wishes')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to fetch will content",
        variant: "destructive",
      });
    } else if (data) {
      setWillContent(data);
    } else {
      // Create initial will entry
      const { data: newWill, error: createError } = await supabase
        .from('will_wishes')
        .insert([{
          title: 'My Final Wishes',
          content: '',
          access_password: 'family2024',
          is_published: true
        }])
        .select()
        .single();

      if (createError) {
        toast({
          title: "Error",
          description: "Failed to create will entry",
          variant: "destructive",
        });
      } else {
        setWillContent(newWill);
      }
    }
  };

  const handleSave = async () => {
    if (!willContent) return;

    const { error } = await supabase
      .from('will_wishes')
      .update({
        title: willContent.title,
        content: willContent.content,
        access_password: willContent.access_password,
        is_published: willContent.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', willContent.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update will content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Will content updated successfully",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !willContent) return;

    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `will-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('legacy-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('legacy-media')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('will_wishes')
        .update({ file_url: publicUrl })
        .eq('id', willContent.id);

      if (updateError) {
        throw updateError;
      }

      setWillContent({ ...willContent, file_url: publicUrl });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!willContent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Will & Final Wishes</h2>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
      <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={willContent.title}
              onChange={(e) => setWillContent({ ...willContent, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Access Password</label>
            <Input
              value={willContent.access_password}
              onChange={(e) => setWillContent({ ...willContent, access_password: e.target.value })}
              placeholder="Password for family access"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea
              value={willContent.content}
              onChange={(e) => setWillContent({ ...willContent, content: e.target.value })}
              rows={10}
              placeholder="Write your final wishes, important information, or instructions..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Attached Document</label>
            {willContent.file_url && (
              <div className="mb-2">
                <a
                  href={willContent.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Current Document
                </a>
              </div>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="will-file-upload"
            />
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                onClick={() => document.getElementById('will-file-upload')?.click()}
                disabled={uploading}
                className="flex-shrink-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
              <Button onClick={handleSave} className="flex-shrink-0">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Family members can access the will and wishes page at:
          </p>
          <code className="block p-2 bg-gray-100 rounded text-sm">
            {window.location.origin}/will
          </code>
          <p className="text-sm text-gray-600 mt-2">
            They will need to enter the password: <strong>{willContent.access_password}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WillManager;
