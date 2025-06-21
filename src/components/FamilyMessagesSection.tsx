
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FamilyMessage {
  id: string;
  name: string;
  message: string;
  message_type: string;
  media_url: string | null;
}

const FamilyMessagesSection = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState<FamilyMessage | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [familyNames, setFamilyNames] = useState<string[]>([]);

  useEffect(() => {
    fetchFamilyNames();
  }, []);

  const fetchFamilyNames = async () => {
    const { data, error } = await supabase
      .from('family_messages')
      .select('name')
      .eq('is_active', true);

    if (!error && data) {
      setFamilyNames(data.map(item => item.name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // First try to find an exact match
      let { data, error } = await supabase
        .from('family_messages')
        .select('*')
        .eq('name', name.trim())
        .eq('is_active', true)
        .single();

      // If no exact match, try case-insensitive search
      if (error) {
        const { data: allMessages } = await supabase
          .from('family_messages')
          .select('*')
          .eq('is_active', true);

        if (allMessages) {
          const foundMessage = allMessages.find(msg => 
            msg.name.toLowerCase() === name.toLowerCase().trim()
          );
          if (foundMessage) {
            data = foundMessage;
            error = null;
          }
        }
      }

      if (!error && data) {
        setMessage(data);
        setShowMessage(true);
      } else {
        // Show default message
        setMessage({
          id: 'default',
          name: name,
          message: "My dear family member, though I may not have written a specific message for you, please know that you are loved beyond measure. You are part of a family legacy of love, strength, and kindness. Carry that with you always, and know that my love for you transcends time and space.",
          message_type: 'text',
          media_url: null
        });
        setShowMessage(true);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setMessage(null);
    setShowMessage(false);
  };

  return (
    <section id="messages" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Personal Messages for Family
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            I've prepared special messages for each member of our family. Enter your name below to receive your personal message.
          </p>
        </div>

        {!showMessage ? (
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-slate-900 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                Enter Your Name
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-700">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="text-lg border-slate-300 focus:border-blue-500"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  Receive My Message
                </Button>
              </form>
              
              {familyNames.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2 text-slate-700">
                    <User className="h-4 w-4" />
                    Family Members with Personal Messages:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-600">
                    {familyNames.map((familyName, index) => (
                      <span key={index}>• {familyName}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-slate-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-slate-900 flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                A Message for {message?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                <p className="text-lg leading-relaxed text-slate-800 italic">
                  "{message?.message}"
                </p>
                {message?.media_url && (
                  <div className="mt-4">
                    {message.message_type === 'video' && (
                      <div className="aspect-video">
                        <iframe
                          src={message.media_url}
                          className="w-full h-full rounded"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {message.message_type === 'audio' && (
                      <audio controls className="w-full">
                        <source src={message.media_url} />
                      </audio>
                    )}
                  </div>
                )}
                <div className="mt-4 text-right">
                  <span className="text-slate-600">— With all my love</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={resetForm} variant="outline" className="flex-1 border-slate-300">
                  View Another Message
                </Button>
                <Button 
                  onClick={() => window.print()} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Print This Message
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 text-center">
          <Card className="inline-block p-4 shadow-md border-slate-200">
            <p className="text-sm text-slate-600">
              Each message was written with love and reflects my hopes and dreams for you.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FamilyMessagesSection;
