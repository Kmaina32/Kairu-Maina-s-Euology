
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BiographySection from '@/components/BiographySection';
import GallerySection from '@/components/GallerySection';
import FamilyMessagesSection from '@/components/FamilyMessagesSection';
import GuestbookSection from '@/components/GuestbookSection';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <HeroSection />
      <BiographySection />
      <GallerySection />
      <FamilyMessagesSection />
      <GuestbookSection />
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default Index;
