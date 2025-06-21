
import { Card } from '@/components/ui/card';
import { Image, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  album: string;
  year: number;
}

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .eq('is_published', true)
      .order('year', { ascending: false });

    if (!error && data) {
      setMedia(data);
    }
  };

  // Fallback photos if no media in database
  const fallbackPhotos = [
    {
      id: "1",
      file_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      title: "Wedding Day, 1975",
      file_type: "image",
      album: "family",
      year: 1975
    },
    {
      id: "2",
      file_url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
      title: "Family Vacation, 1985",
      file_type: "image",
      album: "family",
      year: 1985
    },
    {
      id: "3",
      file_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
      title: "First Grandchild, 2010",
      file_type: "image",
      album: "family",
      year: 2010
    },
    {
      id: "4",
      file_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      title: "Retirement Celebration",
      file_type: "video",
      album: "career",
      year: 2015
    },
    {
      id: "5",
      file_url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      title: "Teaching Memories",
      file_type: "image",
      album: "career",
      year: 2000
    },
    {
      id: "6",
      file_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      title: "Family Reunion, 2020",
      file_type: "image",
      album: "family",
      year: 2020
    }
  ];

  const photos = media.length > 0 ? media : fallbackPhotos;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Photo & Video Gallery
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A visual journey through the moments that shaped my life and the memories I cherish most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="group shadow-lg border-slate-200 hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
              <div 
                className="relative aspect-[4/3] overflow-hidden"
                onClick={() => setSelectedImage(photo.file_url)}
              >
                <img
                  src={photo.file_url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {photo.file_type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-medium">{photo.title}</h3>
                  {photo.year && (
                    <p className="text-white/80 text-sm">{photo.year} • {photo.album}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Card className="inline-block p-6 shadow-md border-slate-200">
            <div className="flex items-center gap-3">
              <Image className="h-6 w-6 text-blue-600" />
              <span className="text-slate-600">
                Click on any photo to view full size
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
