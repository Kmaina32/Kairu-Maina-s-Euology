
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Users, FileText, Image, MessageSquare, LogOut, Music } from 'lucide-react';
import BiographyManager from './admin/BiographyManager';
import MediaManager from './admin/MediaManager';
import FamilyMessageManager from './admin/FamilyMessageManager';
import WillManager from './admin/WillManager';
import GuestbookManager from './admin/GuestbookManager';
import MusicManager from './admin/MusicManager';

const AdminPanel = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-blue-100">Manage your legacy website content</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 animate-scale-in">
          <CardContent className="p-6">
            <Tabs defaultValue="biography" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-700">
                <TabsTrigger 
                  value="biography" 
                  className="flex items-center gap-2 text-slate-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Biography</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="flex items-center gap-2 text-slate-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Media</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="messages" 
                  className="flex items-center gap-2 text-slate-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="will" 
                  className="flex items-center gap-2 text-slate-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Will</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="guestbook" 
                  className="flex items-center gap-2 text-slate-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Guestbook</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="music" 
                  className="flex items-center gap-2 text-slate-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Music className="h-4 w-4" />
                  <span className="hidden sm:inline">Music</span>
                </TabsTrigger>
              </TabsList>

              <div className="bg-white rounded-lg p-6 shadow-xl">
                <TabsContent value="biography" className="mt-0">
                  <BiographyManager />
                </TabsContent>

                <TabsContent value="media" className="mt-0">
                  <MediaManager />
                </TabsContent>

                <TabsContent value="messages" className="mt-0">
                  <FamilyMessageManager />
                </TabsContent>

                <TabsContent value="will" className="mt-0">
                  <WillManager />
                </TabsContent>

                <TabsContent value="guestbook" className="mt-0">
                  <GuestbookManager />
                </TabsContent>

                <TabsContent value="music" className="mt-0">
                  <MusicManager />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
