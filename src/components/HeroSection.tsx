
import { Card } from '@/components/ui/card';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center hero-gradient pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary text-shadow">
              A Life Well Lived
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Preserving memories, sharing wisdom, and connecting generations through the stories that matter most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#biography" 
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Explore My Journey
              </a>
              <a 
                href="#messages" 
                className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
              >
                Family Messages
              </a>
            </div>
          </div>
          
          <div className="flex justify-center animate-scale-in">
            <Card className="p-2 card-hover">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=500&fit=crop&crop=face"
                alt="Portrait"
                className="w-full h-96 md:h-[500px] object-cover rounded-lg"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
