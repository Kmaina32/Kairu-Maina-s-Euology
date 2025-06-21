
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2 } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  album: string;
  year: number;
  is_published: boolean;
}

const MediaManager = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch media",
        variant: "destructive",
      });
    } else {
      setMedia(data || []);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
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

      const fileType = file.type.startsWith('image/') ? 'image' : 'video';

      const { error: dbError } = await supabase
        .from('media_gallery')
        .insert([{
          title: file.name,
          description: '',
          file_url: publicUrl,
          file_type: fileType,
          album: 'general',
          year: new Date().getFullYear(),
          is_published: true
        }]);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      fetchMedia();
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

  const handleDelete = async (id: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      await supabase.storage
        .from('legacy-media')
        .remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from('media_gallery')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      
      fetchMedia();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Gallery</h2>
        <div>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <Button 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Media'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.file_url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>
              <h3 className="font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{item.album} • {item.year}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id, item.file_url)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;
