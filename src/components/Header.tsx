import { Heart, Home, Users, Image, FileText, Shield, BookOpen, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    user,
    loading
  } = useAuth();
  const navItems = [{
    name: 'Home',
    href: '#home',
    icon: Home
  }, {
    name: 'Biography',
    href: '#biography',
    icon: FileText
  }, {
    name: 'Gallery',
    href: '#gallery',
    icon: Image
  }, {
    name: 'Family Messages',
    href: '#messages',
    icon: Users
  }, {
    name: 'Guestbook',
    href: '#guestbook',
    icon: BookOpen
  }, {
    name: 'Will & Wishes',
    href: '/will',
    icon: Shield
  }];
  return <>
      <header className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-400" />
              <span className="font-serif text-xl font-semibold text-white">Legacy Archive</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map(item => <a key={item.name} href={item.href} className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.name}</span>
                </a>)}
              {!loading && (user ? <a href="/admin" className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors duration-200">
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </a> : <button onClick={() => setShowAuthModal(true)} className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors duration-200">
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </button>)}
            </nav>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`block h-0.5 w-6 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`block h-0.5 w-6 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-6 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && <nav className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4">
              {navItems.map(item => <a key={item.name} href={item.href} className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>)}
            </nav>}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={() => {
      setShowAuthModal(false);
      window.location.href = '/admin';
    }} />
    </>;
};
export default Header;