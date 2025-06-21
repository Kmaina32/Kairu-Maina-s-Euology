
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X, Trash2 } from 'lucide-react';

interface FamilyMessage {
  id: string;
  name: string;
  message: string;
  message_type: string;
  media_url: string | null;
  is_active: boolean;
}

const FamilyMessageManager = () => {
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState({
    name: '',
    message: '',
    message_type: 'text',
    media_url: '',
    is_active: true
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('family_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } else {
      setMessages(data || []);
    }
  };

  const handleSave = async (message: FamilyMessage) => {
    const { error } = await supabase
      .from('family_messages')
      .update({
        name: message.name,
        message: message.message,
        message_type: message.message_type,
        media_url: message.media_url || null,
        is_active: message.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', message.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message updated successfully",
      });
      setEditingId(null);
      fetchMessages();
    }
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('family_messages')
      .insert([{
        ...newMessage,
        media_url: newMessage.media_url || null
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create message",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message created successfully",
      });
      setShowNewForm(false);
      setNewMessage({
        name: '',
        message: '',
        message_type: 'text',
        media_url: '',
        is_active: true
      });
      fetchMessages();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('family_messages')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      fetchMessages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Family Messages</h2>
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Message
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Family Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Family member name"
              value={newMessage.name}
              onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
            />
            <Select
              value={newMessage.message_type}
              onValueChange={(value) => setNewMessage({ ...newMessage, message_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Message</SelectItem>
                <SelectItem value="video">Video Message</SelectItem>
                <SelectItem value="audio">Audio Message</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Message content"
              value={newMessage.message}
              onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
              rows={4}
            />
            {newMessage.message_type !== 'text' && (
              <Input
                placeholder="Media URL (YouTube, Vimeo, etc.)"
                value={newMessage.media_url}
                onChange={(e) => setNewMessage({ ...newMessage, media_url: e.target.value })}
              />
            )}
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Save</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Message for {message.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(editingId === message.id ? null : message.id)}
                  >
                    {editingId === message.id ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === message.id ? (
                <div className="space-y-4">
                  <Input
                    value={message.name}
                    onChange={(e) => {
                      const updated = messages.map((m) =>
                        m.id === message.id ? { ...m, name: e.target.value } : m
                      );
                      setMessages(updated);
                    }}
                  />
                  <Textarea
                    value={message.message}
                    onChange={(e) => {
                      const updated = messages.map((m) =>
                        m.id === message.id ? { ...m, message: e.target.value } : m
                      );
                      setMessages(updated);
                    }}
                    rows={4}
                  />
                  <Button onClick={() => handleSave(message)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">{message.message}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Type: {message.message_type}</span>
                    <span>Status: {message.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FamilyMessageManager;
