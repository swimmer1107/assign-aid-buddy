
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, Star, Download, Eye, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

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
}

const NotesMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [universities, setUniversities] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchNotes();
    fetchFilterOptions();
  }, [searchTerm, selectedUniversity, selectedSubject, priceRange]);

  const fetchNotes = async () => {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
      }

      if (selectedUniversity) {
        query = query.eq('university', selectedUniversity);
      }

      if (selectedSubject) {
        query = query.eq('subject', selectedSubject);
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
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

      toast({
        title: "Purchase Successful",
        description: "Note has been added to your library",
      });
    } catch (error) {
      console.error('Error purchasing note:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Notes Marketplace</h1>
          <p className="text-xl text-gray-600">Find and purchase study notes from top students</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Universities</SelectItem>
                {universities.map(university => (
                  <SelectItem key={university} value={university}>{university}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Price</SelectItem>
                <SelectItem value="0-50">₹0 - ₹50</SelectItem>
                <SelectItem value="50-100">₹50 - ₹100</SelectItem>
                <SelectItem value="100-200">₹100 - ₹200</SelectItem>
                <SelectItem value="200">₹200+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BookOpen className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <Badge variant="secondary">₹{note.price}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{note.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{note.subject}</Badge>
                      <Badge variant="outline">{note.content_type.toUpperCase()}</Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>University:</strong> {note.university}</p>
                      {note.course_code && <p><strong>Course:</strong> {note.course_code}</p>}
                      {note.professor_name && <p><strong>Professor:</strong> {note.professor_name}</p>}
                      {note.semester && <p><strong>Semester:</strong> {note.semester}</p>}
                      {note.year && <p><strong>Year:</strong> {note.year}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{note.rating?.toFixed(1) || 'N/A'}</span>
                          <span className="ml-1">({note.reviews_count})</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          <span>{note.downloads_count}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {note.preview_available && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      )}
                      <Button 
                        onClick={() => handlePurchase(note.id, note.price)}
                        className="flex-1"
                        size="sm"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {notes.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notes found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesMarketplace;
