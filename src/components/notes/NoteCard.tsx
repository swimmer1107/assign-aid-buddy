
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Download, 
  Eye, 
  Heart, 
  Share2, 
  BookOpen, 
  Calendar,
  User,
  MapPin,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
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

interface NoteCardProps {
  note: Note;
  onPurchase: (noteId: string, price: number) => void;
  onPreview: (noteId: string) => void;
  onWishlist: (noteId: string) => void;
  isWishlisted?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onPurchase, 
  onPreview, 
  onWishlist, 
  isWishlisted = false 
}) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Note link copied to clipboard",
      });
    }
  };

  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 ${
        isHovered ? 'shadow-2xl scale-105' : 'shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-3 py-1"
            >
              ₹{note.price}
            </Badge>
            {note.downloads_count > 100 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWishlist(note.id)}
              className="p-2 hover:bg-red-50"
            >
              <Heart 
                className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 hover:bg-blue-50"
            >
              <Share2 className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
          {note.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-gray-600">
          {note.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Subject and Content Type */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <BookOpen className="h-3 w-3 mr-1" />
            {note.subject}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {note.content_type.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            {formatFileSize(note.file_size)}
          </Badge>
        </div>

        {/* University and Course Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">{note.university}</span>
          </div>
          {note.course_code && (
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
              <span>Course: {note.course_code}</span>
            </div>
          )}
          {note.professor_name && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span>Prof: {note.professor_name}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{note.semester} - {note.year}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeAgo(note.created_at)}
            </div>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
              <span className="text-sm font-medium">{note.rating?.toFixed(1) || 'N/A'}</span>
              <span className="text-xs text-gray-500 ml-1">({note.reviews_count})</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm">{note.downloads_count}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-600">Verified</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {note.preview_available && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => onPreview(note.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          )}
          <Button 
            onClick={() => onPurchase(note.id, note.price)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105"
            size="sm"
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
