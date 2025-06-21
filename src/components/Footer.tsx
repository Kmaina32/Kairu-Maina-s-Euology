
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-legacy-900 text-legacy-100 py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-legacy-400" />
          <span className="font-serif text-lg">Legacy Archive</span>
        </div>
        
        <p className="text-legacy-300 mb-6 max-w-2xl mx-auto">
          This website was created to preserve memories, share love, and connect our family across generations. 
          May the stories and messages here continue to inspire and unite us for years to come.
        </p>
        
        <div className="border-t border-legacy-800 pt-6">
          <p className="text-legacy-400 text-sm">
            Created with love for my family • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
