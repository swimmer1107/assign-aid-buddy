
import React from 'react';
import NoteCard from './NoteCard';
import { BookOpen } from 'lucide-react';

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

interface NotesGridProps {
  notes: Note[];
  loading: boolean;
  onPurchase: (noteId: string, price: number) => void;
  onPreview: (noteId: string) => void;
  onWishlist: (noteId: string) => void;
  wishlistedNotes: string[];
}

const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  loading,
  onPurchase,
  onPreview,
  onWishlist,
  wishlistedNotes
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <BookOpen className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-500 animate-pulse">Loading amazing notes...</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">No notes found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or explore different subjects
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onPurchase={onPurchase}
          onPreview={onPreview}
          onWishlist={onWishlist}
          isWishlisted={wishlistedNotes.includes(note.id)}
        />
      ))}
    </div>
  );
};

export default NotesGrid;
