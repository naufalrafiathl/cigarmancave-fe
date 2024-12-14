"use client"
import { useState } from 'react';
import { Plus, ArrowLeft, Search } from 'lucide-react';
import { Humidor, HumidorCigar, Cigar, CigarDisplay } from '@/types/humidor';
import { ViewToggle } from './humidor/ViewToggle';
import { CigarCard } from './humidor/CigarCard';
import { HumidorCard } from './humidor/HumidorCard';
import { EditHumidorModal } from './humidor/components/modals/EditHumidorModal';
import { EditHumidorCigarModal } from './humidor/components/modals/EditHumidorCigarModal';
import { PaginationControls } from './humidor/PaginationControls';
import { useHumidorOperations } from '@/hooks/useHumidorOperations';

const ITEMS_PER_PAGE = {
  humidors: 8,
  cigars: 6,
};

export function HumidorView() {
  // State management
  const [selectedHumidor, setSelectedHumidor] = useState<Humidor | null>(null);
  const [editingHumidor, setEditingHumidor] = useState<Partial<Humidor> | null>(null);
  const [editingHumidorCigar, setEditingHumidorCigar] = useState<{
    humidorCigar?: HumidorCigar;
    cigar: Cigar;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHumidorPage, setCurrentHumidorPage] = useState(1);
  const [currentCigarPage, setCurrentCigarPage] = useState(1);
  const [humidorViewMode, setHumidorViewMode] = useState<"grid" | "list">("grid");
  const [cigarViewMode, setCigarViewMode] = useState<"grid" | "list">("grid");

  // Hook for API operations
  const {
    isLoading,
    error,
    createHumidor,
    updateHumidor,
    deleteHumidor,
    addCigarToHumidor,
    updateHumidorCigar,
    removeCigarFromHumidor,
  } = useHumidorOperations();

  // Transform HumidorCigar to CigarDisplay
  const transformToCigarDisplay = (humidorCigar: HumidorCigar): CigarDisplay => {
    return {
      id: humidorCigar.id,
      name: humidorCigar.cigar.name,
      brand: humidorCigar.cigar.brand,
      imageUrl: humidorCigar.cigar.imageUrl,
      quantity: humidorCigar.quantity,
      purchasePrice: humidorCigar.purchasePrice,
      purchaseDate: humidorCigar.purchaseDate,
      purchaseLocation: humidorCigar.purchaseLocation,
      notes: humidorCigar.notes,
    };
  };

  // Handlers
  const handleCreateHumidor = async (data: { name: string; description?: string; imageUrl?: string }) => {
    try {
      await createHumidor({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      });
      setEditingHumidor(null);
    } catch (err) {
      console.error('Failed to create humidor:', err);
    }
  };

  const handleUpdateHumidor = async (data: Partial<Humidor>) => {
    if (!editingHumidor?.id) return;
    try {
      await updateHumidor(editingHumidor.id, data);
      setEditingHumidor(null);
    } catch (err) {
      console.error('Failed to update humidor:', err);
    }
  };

  const handleAddCigarToHumidor = async (data: { 
    quantity: number;
    purchasePrice?: number;
    purchaseDate?: string;
    purchaseLocation?: string;
    notes?: string;
  }) => {
    if (!selectedHumidor || !editingHumidorCigar) return;
    try {
      await addCigarToHumidor(selectedHumidor.id, {
        cigarId: editingHumidorCigar.cigar.id,
        quantity: data.quantity,
        purchasePrice: data.purchasePrice,
        purchaseDate: data.purchaseDate,
        purchaseLocation: data.purchaseLocation,
        notes: data.notes,
      });
      setEditingHumidorCigar(null);
    } catch (err) {
      console.error('Failed to add cigar:', err);
    }
  };

  const handleUpdateHumidorCigar = async (data: Partial<HumidorCigar>) => {
    if (!selectedHumidor || !editingHumidorCigar?.humidorCigar?.id) return;
    try {
      await updateHumidorCigar(
        selectedHumidor.id,
        editingHumidorCigar.humidorCigar.id,
        data
      );
      setEditingHumidorCigar(null);
    } catch (err) {
      console.error('Failed to update cigar:', err);
    }
  };

  // Filter cigars based on search query
  const filterCigars = (cigars: HumidorCigar[]) => {
    if (!searchQuery) return cigars;
    return cigars.filter(
      (humidorCigar) =>
        humidorCigar.cigar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        humidorCigar.cigar.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Individual humidor view (Cigars page)
  if (selectedHumidor) {
    const filteredCigars = filterCigars(selectedHumidor.cigars);
    const paginatedCigars = filterCigars(selectedHumidor.cigars).slice(
      (currentCigarPage - 1) * ITEMS_PER_PAGE.cigars,
      currentCigarPage * ITEMS_PER_PAGE.cigars
    );
    const totalCigarPages = Math.ceil(filteredCigars.length / ITEMS_PER_PAGE.cigars);

    return (
      <div className="h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#222222] border-b border-white/10 px-4 py-3 pt-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedHumidor(null)}
                className="text-white hover:text-[#EFA427] transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                {selectedHumidor.name}
              </h2>
            </div>
            <ViewToggle viewMode={cigarViewMode} setViewMode={setCigarViewMode} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search and Actions */}
          <div className="mb-5 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search cigars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full h-12 bg-[#2A2A2A] border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
            <button
              onClick={() => setEditingHumidorCigar({ cigar: { id: 0, name: '', brand: '' } as Cigar })}
              className="h-12 px-6 bg-[#EFA427] text-white rounded-lg hover:bg-[#d89421] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              <span>Add Cigar</span>
            </button>
          </div>

          {/* Cigars Grid/List */}
          <div
            className={
              cigarViewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {paginatedCigars.map((humidorCigar) => (
              <CigarCard
                key={humidorCigar.id}
                cigar={transformToCigarDisplay(humidorCigar)}
                viewMode={cigarViewMode}
                onEdit={(cigarDisplay) => {
                  const originalHumidorCigar = selectedHumidor.cigars.find(
                    (hc) => hc.id === cigarDisplay.id
                  );
                  if (originalHumidorCigar) {
                    setEditingHumidorCigar({
                      humidorCigar: originalHumidorCigar,
                      cigar: originalHumidorCigar.cigar,
                    });
                  }
                }}
                onDelete={(cigarDisplay) => 
                  removeCigarFromHumidor(selectedHumidor.id, cigarDisplay.id)
                }
              />
            ))}
          </div>

          {/* Pagination */}
          {totalCigarPages > 1 && (
            <div className="mt-6 flex justify-center">
              <PaginationControls
                currentPage={currentCigarPage}
                totalPages={totalCigarPages}
                onPageChange={setCurrentCigarPage}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        {editingHumidorCigar && (
          <EditHumidorCigarModal
            humidorCigar={editingHumidorCigar.humidorCigar}
            cigar={editingHumidorCigar.cigar}
            onSubmit={editingHumidorCigar.humidorCigar ? handleUpdateHumidorCigar : handleAddCigarToHumidor}
            onClose={() => setEditingHumidorCigar(null)}
          />
        )}
      </div>
    );
  }

  // Humidors list view
  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-[#222222] border-b border-white/10 px-4 pt-5 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">My Humidors</h2>
              <p className="text-[#B9B9B9]">Manage your humidors collection</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEditingHumidor({ name: '', description: '', imageUrl: '' })}
                className="h-10 px-4 bg-[#EFA427] text-white rounded-lg hover:bg-[#d89421] transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add New Humidor</span>
                <span className="sm:hidden">Add New</span>
              </button>
              <ViewToggle viewMode={humidorViewMode} setViewMode={setHumidorViewMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Humidors Grid/List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div
          className={
            humidorViewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {/* Here you would map through your humidors data */}
        </div>
      </div>

      {/* Modals */}
      {editingHumidor && (
        <EditHumidorModal
          humidor={editingHumidor.id ? editingHumidor as Humidor : undefined}
          onSubmit={editingHumidor.id ? handleUpdateHumidor : handleCreateHumidor}
          onClose={() => setEditingHumidor(null)}
        />
      )}
    </div>
  );
}