
import { Card } from '@/components/ui/card';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* Subtle particle effect */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white text-shadow">
              A Life Well Lived
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Preserving memories, sharing wisdom, and connecting generations through the stories that matter most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#biography" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-center hover:scale-105 hover:shadow-lg"
              >
                Explore My Journey
              </a>
              <a 
                href="#messages" 
                className="inline-flex items-center px-6 py-3 border border-blue-400 text-blue-100 rounded-lg hover:bg-blue-900/30 transition-all duration-300 font-medium text-center hover:scale-105 hover:shadow-lg"
              >
                Family Messages
              </a>
            </div>
          </div>
          
          <div className="flex justify-center animate-scale-in">
            <Card className="p-2 shadow-2xl border-slate-700 hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <img 
                alt="Portrait" 
                className="w-full h-96 md:h-[500px] object-cover rounded-lg" 
                src="/lovable-uploads/d29f39f5-d508-4f35-9300-7008fdb99426.jpg" 
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
