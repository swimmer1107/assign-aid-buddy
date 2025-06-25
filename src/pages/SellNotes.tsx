
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, BookOpen, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const SellNotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    university: '',
    course_code: '',
    professor_name: '',
    semester: '',
    year: '',
    price: '',
    content_type: '',
    preview_available: false
  });
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('notes-files')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to sell notes",
        variant: "destructive",
      });
      return;
    }

    if (!mainFile) {
      toast({
        title: "File Required",
        description: "Please upload your notes file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload main file
      const mainFilePath = await handleFileUpload(mainFile, 'main');
      
      // Upload preview file if provided
      let previewFilePath = null;
      if (previewFile && formData.preview_available) {
        previewFilePath = await handleFileUpload(previewFile, 'preview');
      }

      // Insert note record
      const { error } = await supabase
        .from('notes')
        .insert({
          seller_id: user.id,
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          university: formData.university,
          course_code: formData.course_code || null,
          professor_name: formData.professor_name || null,
          semester: formData.semester || null,
          year: formData.year ? parseInt(formData.year) : null,
          content_type: formData.content_type,
          file_path: mainFilePath,
          file_size: mainFile.size,
          price: parseFloat(formData.price),
          preview_available: formData.preview_available,
          preview_file_path: previewFilePath,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your notes have been uploaded successfully",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        university: '',
        course_code: '',
        professor_name: '',
        semester: '',
        year: '',
        price: '',
        content_type: '',
        preview_available: false
      });
      setMainFile(null);
      setPreviewFile(null);

    } catch (error) {
      console.error('Error uploading notes:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sell Your Notes</h1>
          <p className="text-xl text-gray-600">Share your knowledge and earn money</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              Upload Notes
            </CardTitle>
            <CardDescription>
              Fill in the details about your notes to help students find them easily
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Complete Data Structures Notes"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 99"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what's covered in these notes..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    placeholder="e.g., Delhi University"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="course_code">Course Code</Label>
                  <Input
                    id="course_code"
                    value={formData.course_code}
                    onChange={(e) => handleInputChange('course_code', e.target.value)}
                    placeholder="e.g., CS101"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    placeholder="e.g., 3rd"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="professor_name">Professor Name</Label>
                  <Input
                    id="professor_name"
                    value={formData.professor_name}
                    onChange={(e) => handleInputChange('professor_name', e.target.value)}
                    placeholder="e.g., Dr. John Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content_type">Content Type *</Label>
                  <Select value={formData.content_type} onValueChange={(value) => handleInputChange('content_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">Document</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mainFile">Upload Notes File *</Label>
                  <Input
                    id="mainFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
                    onChange={(e) => setMainFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preview_available"
                    checked={formData.preview_available}
                    onCheckedChange={(checked) => handleInputChange('preview_available', checked as boolean)}
                  />
                  <Label htmlFor="preview_available">Provide a preview file</Label>
                </div>

                {formData.preview_available && (
                  <div className="space-y-2">
                    <Label htmlFor="previewFile">Upload Preview File</Label>
                    <Input
                      id="previewFile"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm text-gray-500">
                      Upload a sample or preview of your notes (recommended for better sales)
                    </p>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Notes
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellNotes;
