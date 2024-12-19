"use client";
import { useState, useEffect } from "react";
import { Plus, ArrowLeft, Search } from "lucide-react";
import { Humidor, HumidorCigar, Cigar, CigarDisplay } from "@/types/humidor";
import { ViewToggle } from "./humidor/ViewToggle";
import { CigarCard } from "./humidor/CigarCard";
import { HumidorCard } from "./humidor/HumidorCard";
import { EditHumidorModal } from "./humidor/components/modals/EditHumidorModal";
import EditHumidorCigarModal from "./humidor/components/modals/EditHumidorCigarModal";
import { PaginationControls } from "./humidor/PaginationControls";
import { useHumidorOperations } from "@/hooks/useHumidorOperations";
import CigarInfoModal from "./cigar/CigarInfoModal";

const ITEMS_PER_PAGE = {
  humidors: 8,
  cigars: 6,
};

export function HumidorView() {
  const [selectedHumidor, setSelectedHumidor] = useState<Humidor | null>(null);
  const [editingHumidor, setEditingHumidor] = useState<Partial<Humidor> | null>(
    null
  );
  const [humidors, setHumidors] = useState<Humidor[]>([]);
  const [isLoadingHumidors, setIsLoadingHumidors] = useState(true);
  const [editingHumidorCigar, setEditingHumidorCigar] = useState<{
    humidorCigar?: HumidorCigar;
    cigar: Cigar;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCigars, setFilteredCigars] = useState<HumidorCigar[]>([]);
  const [currentCigarPage, setCurrentCigarPage] = useState(1);
  const [humidorViewMode, setHumidorViewMode] = useState<"grid" | "list">(
    "grid"
  );
  const [cigarViewMode, setCigarViewMode] = useState<"grid" | "list">("grid");
  const [selectedCigarForView, setSelectedCigarForView] =
    useState<HumidorCigar | null>(null);

  const {
    isLoading,
    error,
    createHumidor,
    updateHumidor,
    deleteHumidor,
    addCigarToHumidor,
    updateHumidorCigar,
    removeCigarFromHumidor,
    getHumidors,
  } = useHumidorOperations();

  const refreshSelectedHumidor = async (humidorId: number) => {
    try {
      const updatedHumidors = (await getHumidors()) as Humidor[];
      setHumidors(updatedHumidors);

      if (humidorId) {
        const updatedSelectedHumidor = updatedHumidors.find(
          (h) => h.id === humidorId
        );
        setSelectedHumidor(updatedSelectedHumidor || null);
      }
    } catch (err) {
      console.error("Failed to refresh humidor data:", err);
    }
  };

  const refreshHumidorState = async () => {
    try {
      const updatedHumidors = (await getHumidors()) as Humidor[];
      setHumidors(updatedHumidors);

      if (selectedHumidor) {
        const updatedSelectedHumidor = updatedHumidors.find(
          (h) => h.id === selectedHumidor.id
        );
        setSelectedHumidor(updatedSelectedHumidor || null);
      }
    } catch (err) {
      console.error("Failed to refresh humidor state:", err);
    }
  };

  useEffect(() => {
    const loadHumidors = async () => {
      try {
        setIsLoadingHumidors(true);
        const fetchedHumidors = (await getHumidors()) as Humidor[];
        setHumidors(fetchedHumidors);
      } catch (err) {
        console.error("Failed to load humidors:", err);
      } finally {
        setIsLoadingHumidors(false);
      }
    };

    loadHumidors();
  }, []);

  useEffect(() => {});
  const transformToCigarDisplay = (
    humidorCigar: HumidorCigar
  ): CigarDisplay => {
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

  const handleCreateHumidor = async (data: {
    name: string;
    description?: string;
    imageUrl?: string;
  }) => {
    try {
      const result = await createHumidor(data);
      const updatedHumidors = (await getHumidors()) as Humidor[];
      setHumidors(updatedHumidors);
      setEditingHumidor(null);
    } catch (err) {
      console.error("Failed to create humidor:", err);
    }
  };

  const handleUpdateHumidor = async (data: Partial<Humidor>) => {
    if (!editingHumidor?.id) return;
    try {
      await updateHumidor(editingHumidor.id, data);
      await refreshHumidorState();
      setEditingHumidor(null);
    } catch (err) {
      console.error("Failed to update humidor:", err);
    }
  };
  const handleAddCigarToHumidor = async (data: {
    cigarId: number;
    quantity: number;
    purchasePrice?: number;
    purchaseDate?: string;
    purchaseLocation?: string;
    notes?: string;
  }) => {
    if (!selectedHumidor || !editingHumidorCigar) return;
    try {
      await addCigarToHumidor(selectedHumidor.id, {
        cigarId: data.cigarId,
        quantity: data.quantity,
        purchasePrice: data.purchasePrice,
        purchaseDate: data.purchaseDate,
        purchaseLocation: data.purchaseLocation,
        notes: data.notes,
      });
      await refreshSelectedHumidor(selectedHumidor.id);
      setEditingHumidorCigar(null);
    } catch (err) {
      console.error("Failed to add cigar:", err);
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
      console.error("Failed to update cigar:", err);
    }
  };

  const handleDeleteCigar = async (cigarDisplay: CigarDisplay) => {
    if (!selectedHumidor) return;
    try {
      await removeCigarFromHumidor(selectedHumidor.id, cigarDisplay.id);
      await refreshSelectedHumidor(selectedHumidor.id);
    } catch (err) {
      console.error("Failed to delete cigar:", err);
    }
  };

  const filterCigars = (cigars: HumidorCigar[]) => {
    if (!searchQuery) return cigars;
    return cigars.filter(
      (humidorCigar) =>
        humidorCigar.cigar.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        humidorCigar.cigar.brand
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  if (selectedHumidor) {
    const filteredCigars = filterCigars(selectedHumidor.cigars);
    const paginatedCigars = filterCigars(selectedHumidor.cigars).slice(
      (currentCigarPage - 1) * ITEMS_PER_PAGE.cigars,
      currentCigarPage * ITEMS_PER_PAGE.cigars
    );
    const totalCigarPages = Math.ceil(
      filteredCigars.length / ITEMS_PER_PAGE.cigars
    );

    return (
      <div className="h-full">
        <div className="sticky top-0 z-10 bg-[#222222] border-b border-white/10 px-4 py-3 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
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

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setEditingHumidorCigar({
                      cigar: { id: 0, name: "", brand: "", imageUrl: "" },
                    })
                  }
                  className="h-10 px-4 bg-[#EFA427] text-white rounded-lg hover:bg-[#d89421] transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add New Cigar</span>
                  <span className="sm:hidden">Add New</span>
                </button>
                <ViewToggle
                  viewMode={cigarViewMode}
                  setViewMode={setCigarViewMode}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* <div className="mb-5 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search cigar in humidor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full h-12 bg-[#2A2A2A] border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          </div> */}

          {/* Cigars Grid/List */}
          <div
            className={
              cigarViewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {/* Cigar Info Modal */}
            {selectedCigarForView && (
              <CigarInfoModal
              isOpen={!!selectedCigarForView}
              onClose={() => setSelectedCigarForView(null)}
              data={selectedCigarForView}
              mode="humidor"
            />
            )}
            {paginatedCigars.map((humidorCigar) => (
              <CigarCard
                key={humidorCigar.id}
                cigar={transformToCigarDisplay(humidorCigar)}
                viewMode={cigarViewMode}
                onView={() => setSelectedCigarForView(humidorCigar)}
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
                onDelete={handleDeleteCigar}
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
            humidorCigar={
              editingHumidorCigar.humidorCigar
                ? {
                    cigarId: editingHumidorCigar.humidorCigar.id,
                    quantity: editingHumidorCigar.humidorCigar.quantity,
                    purchasePrice:
                      editingHumidorCigar.humidorCigar.purchasePrice,
                    purchaseDate: editingHumidorCigar.humidorCigar.purchaseDate,
                    purchaseLocation:
                      editingHumidorCigar.humidorCigar.purchaseLocation,
                    notes: editingHumidorCigar.humidorCigar.notes,
                  }
                : undefined
            }
            onSubmit={async (data) => {
              if (editingHumidorCigar.humidorCigar) {
                await handleUpdateHumidorCigar(data as Partial<HumidorCigar>);
              } else {
                await handleAddCigarToHumidor(
                  data as {
                    cigarId: number;
                    quantity: number;
                    purchasePrice?: number;
                    purchaseDate?: string;
                    purchaseLocation?: string;
                    notes?: string;
                  }
                );
              }
            }}
            onClose={() => setEditingHumidorCigar(null)}
          />
        )}
      </div>
    );
  }

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
                onClick={() =>
                  setEditingHumidor({ name: "", description: "", imageUrl: "" })
                }
                className="h-10 px-4 bg-[#EFA427] text-white rounded-lg hover:bg-[#d89421] transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add New Humidor</span>
                <span className="sm:hidden">Add New</span>
              </button>
              <ViewToggle
                viewMode={humidorViewMode}
                setViewMode={setHumidorViewMode}
              />
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
          {isLoadingHumidors ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-white/60">Loading humidors...</div>
            </div>
          ) : humidors.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-12">
              <p className="text-white/60 mb-4">No humidors yet</p>
              <button
                onClick={() =>
                  setEditingHumidor({ name: "", description: "", imageUrl: "" })
                }
                className="px-4 py-2 bg-[#EFA427] text-white rounded-lg hover:bg-[#d89421] transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span>Create Your First Humidor</span>
              </button>
            </div>
          ) : (
            humidors.map((humidor) => (
              <HumidorCard
                key={humidor.id}
                onView={() => setSelectedHumidor(humidor)}
                viewMode={humidorViewMode}
                onSelect={() => setSelectedHumidor(humidor)}
                humidor={humidor}
                onEdit={() => setEditingHumidor(humidor)}
                onDelete={async () => {
                  try {
                    await deleteHumidor(humidor.id);
                    // Refresh the list after deletion
                    const updatedHumidors = (await getHumidors()) as Humidor[];
                    setHumidors(updatedHumidors);
                  } catch (err) {
                    console.error("Failed to delete humidor:", err);
                  }
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {editingHumidor && (
        <EditHumidorModal
          humidor={editingHumidor.id ? (editingHumidor as Humidor) : undefined}
          onSubmit={
            editingHumidor.id ? handleUpdateHumidor : handleCreateHumidor
          }
          onClose={() => setEditingHumidor(null)}
        />
      )}
    </div>
  );
}
