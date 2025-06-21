
import { Card } from '@/components/ui/card';
import { Image, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
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
      file_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      title: "Wedding Day, 1975",
      description: "A beautiful moment captured on our wedding day",
      file_type: "image",
      album: "family",
      year: 1975
    },
    {
      id: "2",
      file_url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
      title: "Family Vacation, 1985",
      description: "Our memorable trip to the mountains",
      file_type: "image",
      album: "family",
      year: 1985
    },
    {
      id: "3",
      file_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      title: "First Grandchild, 2010",
      description: "The joy of becoming grandparents",
      file_type: "image",
      album: "family",
      year: 2010
    },
    {
      id: "4",
      file_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
      title: "Retirement Celebration",
      description: "Celebrating the end of a fulfilling career",
      file_type: "video",
      album: "career",
      year: 2015
    },
    {
      id: "5",
      file_url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
      title: "Teaching Memories",
      description: "Years of dedication to education",
      file_type: "image",
      album: "career",
      year: 2000
    },
    {
      id: "6",
      file_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      title: "Family Reunion, 2020",
      description: "Bringing everyone together",
      file_type: "image",
      album: "family",
      year: 2020
    }
  ];

  const photos = media.length > 0 ? media : fallbackPhotos;

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Photo & Video Gallery
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A visual journey through the moments that shaped my life and the memories I cherish most.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-12 animate-scale-in">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {photos.map((photo) => (
                <CarouselItem key={photo.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105">
                    <div 
                      className="relative aspect-[4/3] overflow-hidden"
                      onClick={() => setSelectedMedia(photo)}
                    >
                      <img
                        src={photo.file_url}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {photo.file_type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-white/90 rounded-full p-3 transition-transform duration-300 group-hover:scale-110">
                            <Play className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-medium">{photo.title}</h3>
                        {photo.year && (
                          <p className="text-white/80 text-sm">{photo.year} • {photo.album}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 hover:bg-white shadow-lg border-slate-200" />
            <CarouselNext className="bg-white/90 hover:bg-white shadow-lg border-slate-200" />
          </Carousel>
        </div>

        {/* Lightbox Modal */}
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
            {selectedMedia && (
              <div className="relative">
                {selectedMedia.file_type === 'video' ? (
                  <video
                    src={selectedMedia.file_url}
                    controls
                    className="w-full h-auto max-h-[80vh] object-contain"
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedMedia.file_url}
                    alt={selectedMedia.title}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                )}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {selectedMedia.title}
                  </h3>
                  {selectedMedia.description && (
                    <p className="text-slate-600 mb-2">{selectedMedia.description}</p>
                  )}
                  <p className="text-sm text-slate-500">
                    {selectedMedia.year} • {selectedMedia.album}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="text-center mt-12 animate-fade-in">
          <Card className="inline-block p-6 shadow-md border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Image className="h-6 w-6 text-blue-600" />
              <span className="text-slate-600">
                Click on any photo or video to view in full screen
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
