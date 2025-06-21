
import { Card } from '@/components/ui/card';
import { Image, Play } from 'lucide-react';
import { useState } from 'react';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      title: "Wedding Day, 1975",
      type: "photo"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
      title: "Family Vacation, 1985",
      type: "photo"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
      title: "First Grandchild, 2010",
      type: "photo"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      title: "Retirement Celebration",
      type: "video"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      title: "Teaching Memories",
      type: "photo"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      title: "Family Reunion, 2020",
      type: "photo"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-legacy-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
            Photo & Video Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A visual journey through the moments that shaped my life and the memories I cherish most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="group card-hover cursor-pointer overflow-hidden">
              <div 
                className="relative aspect-[4/3] overflow-hidden"
                onClick={() => setSelectedImage(photo.url)}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {photo.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-medium">{photo.title}</h3>
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
          <Card className="inline-block p-6 card-hover">
            <div className="flex items-center gap-3">
              <Image className="h-6 w-6 text-primary" />
              <span className="text-muted-foreground">
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
