
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FloatingShapes from '@/components/FloatingShapes';
import NotesFilters from '@/components/notes/NotesFilters';
import NotesStats from '@/components/notes/NotesStats';
import NotesGrid from '@/components/notes/NotesGrid';
import MarketplaceHeader from '@/components/notes/MarketplaceHeader';
import { useNotesMarketplace } from '@/hooks/useNotesMarketplace';
import { useNotesFilters } from '@/hooks/useNotesFilters';

const NotesMarketplace = () => {
  const {
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
  } = useNotesMarketplace();

  const {
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
  } = useNotesFilters(allNotes);

  useEffect(() => {
    fetchNotes();
    fetchFilterOptions();
    fetchStats();
    fetchWishlist();
  }, []);

  useEffect(() => {
    const filteredNotes = filterAndSortNotes();
    setNotes(filteredNotes);
  }, [searchTerm, selectedUniversity, selectedSubject, priceRange, selectedRating, sortBy, allNotes, filterAndSortNotes, setNotes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      <FloatingShapes />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <MarketplaceHeader />

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
