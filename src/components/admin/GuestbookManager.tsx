
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Trash2 } from 'lucide-react';

interface GuestbookEntry {
  id: string;
  visitor_name: string;
  email: string | null;
  message: string;
  is_approved: boolean;
  created_at: string;
}

const GuestbookManager = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch guestbook entries",
        variant: "destructive",
      });
    } else {
      setEntries(data || []);
    }
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('guestbook_entries')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Entry approved successfully",
      });
      fetchEntries();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('guestbook_entries')
      .update({ is_approved: false })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Entry rejected successfully",
      });
      fetchEntries();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('guestbook_entries')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      });
      fetchEntries();
    }
  };

  const pendingEntries = entries.filter(entry => !entry.is_approved);
  const approvedEntries = entries.filter(entry => entry.is_approved);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Guestbook Management</h2>

      {pendingEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval ({pendingEntries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{entry.visitor_name}</h4>
                      {entry.email && (
                        <p className="text-sm text-gray-600">{entry.email}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(entry.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700">{entry.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Approved Entries ({approvedEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvedEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{entry.visitor_name}</h4>
                    {entry.email && (
                      <p className="text-sm text-gray-600">{entry.email}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(entry.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700">{entry.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestbookManager;
