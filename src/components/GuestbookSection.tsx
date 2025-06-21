
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Heart, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GuestbookEntry {
  id: string;
  visitor_name: string;
  email: string | null;
  message: string;
  created_at: string;
}

const GuestbookSection = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [formData, setFormData] = useState({
    visitor_name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('guestbook_entries')
        .insert([{
          visitor_name: formData.visitor_name,
          email: formData.email || null,
          message: formData.message
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Thank you!",
        description: "Your message has been submitted and will appear after approval.",
      });

      setFormData({
        visitor_name: '',
        email: '',
        message: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Memory Guestbook
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Share your memories, thoughts, and messages. Your words will become part of this lasting tribute.
          </p>
        </div>

        {/* Submit Form */}
        <Card className="mb-12 shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Leave a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Your Name *
                  </label>
                  <Input
                    value={formData.visitor_name}
                    onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                    placeholder="Enter your name"
                    required
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Your Message *
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your memories, thoughts, or a message..."
                  rows={4}
                  required
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Entries Display */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Messages & Memories ({entries.length})
          </h3>

          {entries.length === 0 ? (
            <Card className="shadow-md border-slate-200">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No messages yet. Be the first to share a memory!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="shadow-md border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">{entry.visitor_name}</h4>
                        <p className="text-sm text-slate-600">
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{entry.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestbookSection;
