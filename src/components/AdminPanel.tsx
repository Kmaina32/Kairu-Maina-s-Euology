
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Users, FileText, Image, MessageSquare, LogOut } from 'lucide-react';
import BiographyManager from './admin/BiographyManager';
import MediaManager from './admin/MediaManager';
import FamilyMessageManager from './admin/FamilyMessageManager';
import WillManager from './admin/WillManager';
import GuestbookManager from './admin/GuestbookManager';

const AdminPanel = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="biography" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="biography" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Biography
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Family Messages
            </TabsTrigger>
            <TabsTrigger value="will" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Will & Wishes
            </TabsTrigger>
            <TabsTrigger value="guestbook" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Guestbook
            </TabsTrigger>
          </TabsList>

          <TabsContent value="biography">
            <BiographyManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaManager />
          </TabsContent>

          <TabsContent value="messages">
            <FamilyMessageManager />
          </TabsContent>

          <TabsContent value="will">
            <WillManager />
          </TabsContent>

          <TabsContent value="guestbook">
            <GuestbookManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
