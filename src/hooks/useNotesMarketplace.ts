
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  university: string;
  course_code: string;
  professor_name: string;
  semester: string;
  year: number;
  price: number;
  rating: number;
  reviews_count: number;
  downloads_count: number;
  content_type: string;
  preview_available: boolean;
  created_at: string;
  seller_id: string;
  file_size?: number;
}

interface MarketplaceStats {
  totalNotes: number;
  totalSellers: number;
  averageRating: number;
  totalDownloads: number;
}

export const useNotesMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [wishlistedNotes, setWishlistedNotes] = useState<string[]>([]);
  const [stats, setStats] = useState<MarketplaceStats>({
    totalNotes: 0,
    totalSellers: 0,
    averageRating: 0,
    totalDownloads: 0
  });

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllNotes(data || []);
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const { data: universityData } = await supabase
        .from('notes')
        .select('university')
        .eq('status', 'active');

      const { data: subjectData } = await supabase
        .from('notes')
        .select('subject')
        .eq('status', 'active');

      const uniqueUniversities = [...new Set(universityData?.map(n => n.university) || [])];
      const uniqueSubjects = [...new Set(subjectData?.map(n => n.subject) || [])];

      setUniversities(uniqueUniversities);
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: notesData } = await supabase
        .from('notes')
        .select('rating, downloads_count, seller_id')
        .eq('status', 'active');

      if (notesData) {
        const totalNotes = notesData.length;
        const totalSellers = new Set(notesData.map(note => note.seller_id)).size;
        const averageRating = notesData.reduce((acc, note) => acc + (note.rating || 0), 0) / totalNotes;
        const totalDownloads = notesData.reduce((acc, note) => acc + (note.downloads_count || 0), 0);

        setStats({
          totalNotes,
          totalSellers,
          averageRating,
          totalDownloads
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('note_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistedNotes(data?.map(item => item.note_id) || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handlePurchase = async (noteId: string, price: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase notes",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('note_purchases')
        .insert({
          buyer_id: user.id,
          note_id: noteId,
          purchase_price: price,
          payment_status: 'completed'
        });

      if (error) throw error;

      const { error: incrementError } = await supabase.rpc('increment_downloads', { 
        note_id: noteId 
      });

      if (incrementError) {
        console.error('Error incrementing downloads:', incrementError);
      }

      toast({
        title: "Purchase Successful! 🎉",
        description: "Note has been added to your library",
      });

      fetchNotes();
    } catch (error) {
      console.error('Error purchasing note:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = async (noteId: string) => {
    toast({
      title: "Preview Opening",
      description: "Note preview will open shortly",
    });
  };

  const handleWishlist = async (noteId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const isWishlisted = wishlistedNotes.includes(noteId);
      
      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('note_id', noteId);

        if (error) throw error;
        setWishlistedNotes(prev => prev.filter(id => id !== noteId));
        toast({
          title: "Removed from Wishlist",
          description: "Note removed from your wishlist",
        });
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            note_id: noteId
          });

        if (error) throw error;
        setWishlistedNotes(prev => [...prev, noteId]);
        toast({
          title: "Added to Wishlist ❤️",
          description: "Note added to your wishlist",
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  return {
    notes,
    allNotes,
    loading,
    universities,
    subjects,
    wishlistedNotes,
    stats,
    setNotes,
    fetchNotes,
    fetchFilterOptions,
    fetchStats,
    fetchWishlist,
    handlePurchase,
    handlePreview,
    handleWishlist
  };
};

export type { Note, MarketplaceStats };
