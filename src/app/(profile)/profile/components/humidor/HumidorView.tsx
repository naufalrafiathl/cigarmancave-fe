"use client";
import { useState } from "react";
import { Plus, ArrowLeft, Search, LayoutGrid, List } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CigarCard } from "./CigarCard";
import { HumidorCard } from "./HumidorCard";
import { CreateHumidorModal } from "./CreateHumidorModal";
import { PaginationControls } from "./PaginationControls";
import { Humidor, Cigar, EXAMPLE_HUMIDORS } from "@/types/humidor";
import { paginateItems } from "@/utils/humidor";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = {
  humidors: {
    mobile: 4,
    tablet: 6,
    desktop: 8,
  },
  cigars: {
    mobile: 4,
    tablet: 6,
    desktop: 6,
  },
};

const ViewToggle = ({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}) => (
  <div className="flex gap-2 bg-[#2A2A2A] rounded-lg p-1">
    <button
      onClick={() => setViewMode("grid")}
      className={`p-2 rounded-md transition-colors ${
        viewMode === "grid"
          ? "bg-[#EFA427] text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
      aria-label="Grid view"
    >
      <LayoutGrid size={20} />
    </button>
    <button
      onClick={() => setViewMode("list")}
      className={`p-2 rounded-md transition-colors ${
        viewMode === "list"
          ? "bg-[#EFA427] text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
      aria-label="List view"
    >
      <List size={20} />
    </button>
  </div>
);

export function HumidorView() {
  const [selectedHumidor, setSelectedHumidor] = useState<Humidor | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHumidorPage, setCurrentHumidorPage] = useState(1);
  const [currentCigarPage, setCurrentCigarPage] = useState(1);
  const [humidorViewMode, setHumidorViewMode] = useState<"grid" | "list">(
    "grid"
  );
  const [cigarViewMode, setCigarViewMode] = useState<"grid" | "list">("grid");

  const handleCreateHumidor = async (data: {
    name: string;
    description: string;
    imageUrl?: string;
  }) => {
    console.log("Creating humidor:", data);
    setIsCreateModalOpen(false);
  };

  const filterCigars = (cigars: Cigar[]) => {
    if (!searchQuery) return cigars;
    return cigars.filter(
      (cigar) =>
        cigar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cigar.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Individual humidor view (Cigars page)
  if (selectedHumidor) {
    const filteredCigars = filterCigars(selectedHumidor.cigars);
    const totalCigarPages = Math.ceil(
      filteredCigars.length / ITEMS_PER_PAGE.cigars.desktop
    );
    const paginatedCigars = paginateItems(
      filteredCigars,
      currentCigarPage,
      ITEMS_PER_PAGE.cigars.desktop
    );

    return (
      <div className="h-full">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-[#222222] border-b border-white/10 px-4 py-3 pt-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedHumidor(null)}
                className="text-white hover:text-[#EFA427] transition-colors p-2 rounded-lg hover:bg-white/5"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                {selectedHumidor.name}
              </h2>
            </div>
            <ViewToggle
              viewMode={cigarViewMode}
              setViewMode={setCigarViewMode}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search and Actions Bar */}
          <div className="mb-5 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search cigars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#2A2A2A] border-white/10 text-white w-full h-12"
                />
              </div>
            </div>
            <button className="h-12 px-6 bg-[#EFA427] text-white rounded-lg hover:bg-[#d89421] transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus size={20} />
              <span>Add Cigar</span>
            </button>
          </div>

          {/* Cigars Container */}
          <div
            className={`${
              cigarViewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            } mb-8`}
          >
            {paginatedCigars.map((cigar) => (
              <CigarCard
                key={cigar.id}
                cigar={cigar}
                viewMode={cigarViewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalCigarPages > 1 && (
            <div className="flex justify-center">
              <PaginationControls
                currentPage={currentCigarPage}
                totalPages={totalCigarPages}
                onPageChange={setCurrentCigarPage}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Humidors list view
  const paginatedHumidors = paginateItems(
    EXAMPLE_HUMIDORS,
    currentHumidorPage,
    ITEMS_PER_PAGE.humidors.desktop
  );
  const totalHumidorPages = Math.ceil(
    EXAMPLE_HUMIDORS.length / ITEMS_PER_PAGE.humidors.desktop
  );

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="bg-[#222222] border-b border-white/10 px-4 pt-5 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">My Humidors</h2>
              <p className="text-[#B9B9B9]">Manage your humidors collection!</p>
            </div>
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#EFA427] hover:bg-[#d89421] text-white h-10">
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add New Humidor</span>
                    <span className="sm:hidden">Add New</span>
                  </Button>
                </DialogTrigger>
                <CreateHumidorModal
                  onSubmit={handleCreateHumidor}
                  onClose={() => setIsCreateModalOpen(false)}
                />
              </Dialog>
              <ViewToggle
                viewMode={humidorViewMode}
                setViewMode={setHumidorViewMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Humidors Container */}
        <div
          className={`${
            humidorViewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          } mb-8`}
        >
          {/* Humidor Cards */}
          {paginatedHumidors.map((humidor) => (
            <HumidorCard
              key={humidor.id}
              humidor={humidor}
              onClick={() => setSelectedHumidor(humidor)}
              viewMode={humidorViewMode}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalHumidorPages > 1 && (
          <div className="flex justify-center">
            <PaginationControls
              currentPage={currentHumidorPage}
              totalPages={totalHumidorPages}
              onPageChange={setCurrentHumidorPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
