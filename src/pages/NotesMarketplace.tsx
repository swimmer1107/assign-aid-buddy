
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import FloatingShapes from '@/components/FloatingShapes';
import NotesFilters from '@/components/notes/NotesFilters';
import NotesStats from '@/components/notes/NotesStats';
import NotesGrid from '@/components/notes/NotesGrid';

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

const NotesMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [universities, setUniversities] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [wishlistedNotes, setWishlistedNotes] = useState<string[]>([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalSellers: 0,
    averageRating: 0,
    totalDownloads: 0
  });

  useEffect(() => {
    fetchNotes();
    fetchFilterOptions();
    fetchStats();
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortNotes();
  }, [searchTerm, selectedUniversity, selectedSubject, priceRange, selectedRating, sortBy, allNotes]);

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

  const filterAndSortNotes = () => {
    let filtered = [...allNotes];

    // Apply filters
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchLower) ||
        note.description.toLowerCase().includes(searchLower) ||
        note.subject.toLowerCase().includes(searchLower) ||
        note.professor_name?.toLowerCase().includes(searchLower) ||
        note.university.toLowerCase().includes(searchLower)
      );
    }

    if (selectedUniversity !== 'all') {
      filtered = filtered.filter(note => note.university === selectedUniversity);
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(note => note.price >= min && note.price <= max);
      } else {
        filtered = filtered.filter(note => note.price >= min);
      }
    }

    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(note => (note.rating || 0) >= minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'downloads':
        filtered.sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setNotes(filtered);
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm) filters.push(`Search: "${searchTerm}"`);
    if (selectedUniversity !== 'all') filters.push(`University: ${selectedUniversity}`);
    if (selectedSubject !== 'all') filters.push(`Subject: ${selectedSubject}`);
    if (priceRange !== 'all') filters.push(`Price: ₹${priceRange}`);
    if (selectedRating !== 'all') filters.push(`Rating: ${selectedRating}+ stars`);
    return filters;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUniversity('all');
    setSelectedSubject('all');
    setPriceRange('all');
    setSelectedRating('all');
    setSortBy('newest');
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

      // Update download count using the database function
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

      // Refresh notes to update download count
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
    // Implementation for preview functionality
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      <FloatingShapes />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notes Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium study notes from top students across universities. 
            Learn smarter, achieve better grades! 🚀
          </p>
        </div>

        <NotesStats
          totalNotes={stats.totalNotes}
          totalSellers={stats.totalSellers}
          averageRating={stats.averageRating}
          totalDownloads={stats.totalDownloads}
        />

        <NotesFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedUniversity={selectedUniversity}
          setSelectedUniversity={setSelectedUniversity}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
          universities={universities}
          subjects={subjects}
          activeFilters={getActiveFilters()}
          clearFilters={clearFilters}
        />

        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{notes.length}</span> of{' '}
            <span className="font-semibold">{allNotes.length}</span> notes
          </p>
        </div>

        <NotesGrid
          notes={notes}
          loading={loading}
          onPurchase={handlePurchase}
          onPreview={handlePreview}
          onWishlist={handleWishlist}
          wishlistedNotes={wishlistedNotes}
        />
      </div>
    </div>
  );
};

export default NotesMarketplace;
