
import { useState, useCallback } from 'react';
import { Note } from './useNotesMarketplace';

export const useNotesFilters = (allNotes: Note[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const getActiveFilters = useCallback(() => {
    const filters = [];
    if (searchTerm) filters.push(`Search: "${searchTerm}"`);
    if (selectedUniversity !== 'all') filters.push(`University: ${selectedUniversity}`);
    if (selectedSubject !== 'all') filters.push(`Subject: ${selectedSubject}`);
    if (priceRange !== 'all') filters.push(`Price: ₹${priceRange}`);
    if (selectedRating !== 'all') filters.push(`Rating: ${selectedRating}+ stars`);
    return filters;
  }, [searchTerm, selectedUniversity, selectedSubject, priceRange, selectedRating]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedUniversity('all');
    setSelectedSubject('all');
    setPriceRange('all');
    setSelectedRating('all');
    setSortBy('newest');
  }, []);

  const filterAndSortNotes = useCallback(() => {
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

    return filtered;
  }, [allNotes, searchTerm, selectedUniversity, selectedSubject, priceRange, selectedRating, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    selectedUniversity,
    setSelectedUniversity,
    selectedSubject,
    setSelectedSubject,
    priceRange,
    setPriceRange,
    selectedRating,
    setSelectedRating,
    sortBy,
    setSortBy,
    getActiveFilters,
    clearFilters,
    filterAndSortNotes
  };
};
