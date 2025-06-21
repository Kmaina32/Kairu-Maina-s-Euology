
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Music, Play, Pause, Volume2, RotateCcw } from 'lucide-react';

interface MusicItem {
  id: string;
  title: string;
  file_url: string;
  order_index: number;
  is_active: boolean;
}

interface MusicSettings {
  autoplay: boolean;
  loop: boolean;
  default_volume: number;
}

const MusicManager = () => {
  const [music, setMusic] = useState<MusicItem[]>([]);
  const [settings, setSettings] = useState<MusicSettings>({
    autoplay: false,
    loop: true,
    default_volume: 50
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMusic();
    loadSettings();
  }, []);

  const fetchMusic = async () => {
    // For now, we'll use a simple state-based approach
    // In a real implementation, you'd fetch from a music_playlist table
    console.log('Fetching music playlist...');
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('musicSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async (newSettings: MusicSettings) => {
    setSettings(newSettings);
    localStorage.setItem('musicSettings', JSON.stringify(newSettings));
    toast({
      title: "Success",
      description: "Music settings saved",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Error",
        description: "Please select an audio file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `music-${Date.now()}.${fileExt}`;
    const filePath = `music/${fileName}`;

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

      const newMusicItem: MusicItem = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        file_url: publicUrl,
        order_index: music.length,
        is_active: true
      };

      setMusic([...music, newMusicItem]);

      toast({
        title: "Success",
        description: "Music file uploaded successfully",
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

  const handleDelete = (id: string) => {
    setMusic(music.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Music file removed",
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newMusic = [...music];
    [newMusic[index], newMusic[index - 1]] = [newMusic[index - 1], newMusic[index]];
    setMusic(newMusic);
  };

  const moveDown = (index: number) => {
    if (index === music.length - 1) return;
    const newMusic = [...music];
    [newMusic[index], newMusic[index + 1]] = [newMusic[index + 1], newMusic[index]];
    setMusic(newMusic);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Background Music</h2>
          <p className="text-slate-600">Manage background music and audio settings</p>
        </div>
        <div>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="music-upload"
          />
          <Button 
            onClick={() => document.getElementById('music-upload')?.click()}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Music'}
          </Button>
        </div>
      </div>

      {/* Music Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Playback Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Autoplay</label>
              <p className="text-xs text-slate-600">Start music automatically when visitors arrive</p>
            </div>
            <Switch
              checked={settings.autoplay}
              onCheckedChange={(checked) => saveSettings({ ...settings, autoplay: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Loop Playlist</label>
              <p className="text-xs text-slate-600">Repeat playlist when it reaches the end</p>
            </div>
            <Switch
              checked={settings.loop}
              onCheckedChange={(checked) => saveSettings({ ...settings, loop: checked })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Volume: {settings.default_volume}%</label>
            <Slider
              value={[settings.default_volume]}
              onValueChange={([value]) => saveSettings({ ...settings, default_volume: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Music Playlist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Music Playlist ({music.length} songs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {music.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No music files uploaded yet</p>
              <p className="text-sm">Upload your first audio file to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {music.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-slate-600">Track {index + 1}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === music.length - 1}
                    >
                      ↓
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicManager;
