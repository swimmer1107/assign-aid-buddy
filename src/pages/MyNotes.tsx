
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Download, Star, Edit, Trash2, Eye, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  university: string;
  price: number;
  rating: number;
  reviews_count: number;
  downloads_count: number;
  status: string;
  created_at: string;
}

interface PurchasedNote extends Note {
  purchase_price: number;
  purchased_at: string;
}

const MyNotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [soldNotes, setSoldNotes] = useState<Note[]>([]);
  const [purchasedNotes, setPurchasedNotes] = useState<PurchasedNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSoldNotes();
      fetchPurchasedNotes();
    }
  }, [user]);

  const fetchSoldNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSoldNotes(data || []);
    } catch (error) {
      console.error('Error fetching sold notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your notes",
        variant: "destructive",
      });
    }
  };

  const fetchPurchasedNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('note_purchases')
        .select(`
          purchase_price,
          purchased_at,
          notes (*)
        `)
        .eq('buyer_id', user?.id)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(purchase => ({
        ...purchase.notes,
        purchase_price: purchase.purchase_price,
        purchased_at: purchase.purchased_at
      })) || [];
      
      setPurchasedNotes(formattedData);
    } catch (error) {
      console.error('Error fetching purchased notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch purchased notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId: string, title: string) => {
    try {
      // Get the file path from the note
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .select('file_path')
        .eq('id', noteId)
        .single();

      if (noteError) throw noteError;

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('notes-files')
        .createSignedUrl(noteData.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      // Create download link
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your file download has begun",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the file",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setSoldNotes(prev => prev.filter(note => note.id !== noteId));
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the note",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <BookOpen className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Notes</h1>
          <p className="text-xl text-gray-600">Manage your notes and purchases</p>
        </div>

        <Tabs defaultValue="purchased" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchased">Purchased Notes</TabsTrigger>
            <TabsTrigger value="selling">My Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="purchased" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                      <Badge variant="secondary">₹{note.purchase_price}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{note.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{note.subject}</Badge>
                        <Badge variant="outline">{note.university}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{note.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            <span>{note.downloads_count}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Purchased: {new Date(note.purchased_at).toLocaleDateString()}
                      </div>

                      <Button 
                        onClick={() => handleDownload(note.id, note.title)}
                        className="w-full"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {purchasedNotes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No purchased notes</h3>
                <p className="text-gray-500">Start browsing the marketplace to buy notes</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="selling" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="secondary">₹{note.price}</Badge>
                        <Badge variant={note.status === 'active' ? 'default' : 'secondary'}>
                          {note.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{note.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{note.subject}</Badge>
                        <Badge variant="outline">{note.university}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          </div>
                          <div className="text-sm font-medium">{note.rating?.toFixed(1) || '0'}</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="flex items-center justify-center">
                            <Download className="h-4 w-4 text-green-600 mr-1" />
                          </div>
                          <div className="text-sm font-medium">{note.downloads_count}</div>
                          <div className="text-xs text-gray-500">Downloads</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-purple-600 mr-1" />
                          </div>
                          <div className="text-sm font-medium">₹{(note.downloads_count * note.price).toFixed(0)}</div>
                          <div className="text-xs text-gray-500">Earned</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {soldNotes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No notes listed</h3>
                <p className="text-gray-500">Start selling your notes to earn money</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyNotes;
