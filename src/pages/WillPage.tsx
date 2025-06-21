
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WillContent {
  id: string;
  title: string;
  content: string;
  file_url: string | null;
  access_password: string;
}

const WillPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [willContent, setWillContent] = useState<WillContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated in this session
    const sessionAuth = sessionStorage.getItem('will_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchWillContent();
    }
  }, []);

  const fetchWillContent = async () => {
    const { data, error } = await supabase
      .from('will_wishes')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .single();

    if (!error && data) {
      setWillContent(data);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('will_wishes')
        .select('*')
        .eq('access_password', password)
        .eq('is_published', true)
        .limit(1)
        .single();

      if (error || !data) {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
      } else {
        setIsAuthenticated(true);
        setWillContent(data);
        sessionStorage.setItem('will_authenticated', 'true');
        toast({
          title: "Access Granted",
          description: "Welcome to the private section.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setWillContent(null);
    sessionStorage.removeItem('will_authenticated');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-serif text-slate-800">
              Private Access Required
            </CardTitle>
            <p className="text-slate-600">
              This section contains final wishes and important documents for family members only.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Access Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter family password"
                  className="border-slate-300 focus:border-blue-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isLoading ? 'Verifying...' : 'Access Private Section'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <a 
                href="/" 
                className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Return to Main Site
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-serif font-bold">Final Wishes & Will</h1>
          </div>
          <div className="flex gap-4">
            <a 
              href="/" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Return Home
            </a>
            <button 
              onClick={handleLogout}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {willContent ? (
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-slate-900 text-center">
                {willContent.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {willContent.content && (
                <div className="prose max-w-none">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                      {willContent.content}
                    </p>
                  </div>
                </div>
              )}

              {willContent.file_url && (
                <Card className="bg-slate-50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Important Documents
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium text-slate-800">Legal Document</p>
                        <p className="text-sm text-slate-600">Official will and final wishes</p>
                      </div>
                      <Button asChild>
                        <a
                          href={willContent.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-amber-800 mb-2">Important Note</h3>
                  <p className="text-amber-700 text-sm">
                    This information is confidential and intended for family members only. 
                    Please handle with care and respect the privacy of these final wishes.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-serif text-slate-800 mb-2">No Content Available</h2>
              <p className="text-slate-600">The will and wishes content has not been set up yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WillPage;
