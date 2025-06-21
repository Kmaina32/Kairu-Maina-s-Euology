
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, User } from 'lucide-react';
import { useState } from 'react';

const FamilyMessagesSection = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // Predefined messages for family members
  const familyMessages: Record<string, string> = {
    'sarah': "My dearest Sarah, you have always been my ray of sunshine. Your laughter could brighten the darkest days, and your compassion for others never ceases to amaze me. Remember that you carry within you the strength of generations of strong women. Chase your dreams fearlessly, love deeply, and never forget how proud I am to be your parent.",
    'michael': "Michael, my wonderful son, you have grown into such a remarkable man. Your sense of humor and your dedication to your family fill my heart with pride. Remember that being a good father and husband is the greatest achievement any man can have. Your children are lucky to have you, just as I was lucky to raise you.",
    'jennifer': "Sweet Jennifer, my baby girl who grew up too fast. You have such a beautiful heart and an incredible talent for bringing people together. Never doubt your worth or your abilities. You are capable of achieving anything you set your mind to, and I will always be cheering you on from wherever I am.",
    'david': "David, my son-in-law who became a true son to me. Thank you for loving my daughter so completely and for giving me such beautiful grandchildren. You are a man of integrity and kindness, and I'm grateful that you became part of our family.",
    'emily': "Emily, my precious granddaughter, you remind me so much of myself at your age. You have such curiosity about the world and such a kind heart. Study hard, be brave, and remember that your grandmother believes you can change the world.",
    'default': "My dear family member, though I may not have written a specific message for you, please know that you are loved beyond measure. You are part of a family legacy of love, strength, and kindness. Carry that with you always, and know that my love for you transcends time and space."
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const nameKey = name.toLowerCase().trim();
      const personalMessage = familyMessages[nameKey] || familyMessages['default'];
      setMessage(personalMessage);
      setShowMessage(true);
    }
  };

  const resetForm = () => {
    setName('');
    setMessage('');
    setShowMessage(false);
  };

  return (
    <section id="messages" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
            Personal Messages for Family
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I've prepared special messages for each member of our family. Enter your name below to receive your personal message.
          </p>
        </div>

        {!showMessage ? (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-primary flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Enter Your Name
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="text-lg"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Receive My Message
                </Button>
              </form>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Family Members with Personal Messages:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <span>• Sarah</span>
                  <span>• Michael</span>
                  <span>• Jennifer</span>
                  <span>• David</span>
                  <span>• Emily</span>
                  <span>• And others...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-hover animate-fade-in">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-primary flex items-center gap-2">
                <Heart className="h-6 w-6" />
                A Message for {name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-legacy-50 p-6 rounded-lg border-l-4 border-primary">
                <p className="text-lg leading-relaxed text-foreground italic">
                  "{message}"
                </p>
                <div className="mt-4 text-right">
                  <span className="text-muted-foreground">— With all my love</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={resetForm} variant="outline" className="flex-1">
                  View Another Message
                </Button>
                <Button 
                  onClick={() => window.print()} 
                  className="flex-1"
                >
                  Print This Message
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 text-center">
          <Card className="inline-block p-4">
            <p className="text-sm text-muted-foreground">
              Each message was written with love and reflects my hopes and dreams for you.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FamilyMessagesSection;
