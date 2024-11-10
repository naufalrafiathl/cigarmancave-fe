// src/components/humidor/HumidorView.tsx
'use client';

import { useState } from 'react';
import { Box, Crown, Plus, ArrowLeft, Search, Star, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Cigar {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  imageUrl?: string;
}

interface Humidor {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  cigars: Cigar[];
  type: string;
}

// Pagination Controls Component
function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// Cigar Card Component
function CigarCard({ cigar }: { cigar: Cigar }) {
  return (
    <Card className="bg-[#2A2A2A] border-white/10 hover:border-[#EFA427]/50 transition-all">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          {cigar.brand}
          <span className="text-sm text-[#EFA427]">Qty: {cigar.quantity}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[#B9B9B9] mb-4">{cigar.name}</p>
        {cigar.imageUrl && (
          <div className="relative h-32 mb-4 rounded-md overflow-hidden">
            <img src={cigar.imageUrl} alt={cigar.name} className="object-cover w-full h-full" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <button
          onClick={() => console.log('Review:', cigar.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4A4A4A] transition-colors"
        >
          <Star size={16} />
          Review
        </button>
        <button
          onClick={() => console.log('Trade:', cigar.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4A4A4A] transition-colors"
        >
          <RefreshCw size={16} />
          Trade
        </button>
      </CardFooter>
    </Card>
  );
}

// CreateHumidorModal Component
function CreateHumidorModal({ onSubmit, onClose }: { 
  onSubmit: (data: { name: string; description: string; imageUrl?: string; }) => Promise<void>;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
      setFormData({ name: '', description: '', imageUrl: '' });
    } catch (error) {
      console.error('Failed to create humidor:', error);
    }
  };

  return (
    <DialogContent className="bg-[#222222] text-white border-white/10">
      <DialogHeader>
        <DialogTitle>Create New Humidor</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-[#2A2A2A] border-white/10 text-white"
            placeholder="My Humidor"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-[#2A2A2A] border-white/10 text-white"
            placeholder="Daily smokes collection..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
          <Input
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="bg-[#2A2A2A] border-white/10 text-white"
            placeholder="https://..."
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-[#2A2A2A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#EFA427] rounded-lg hover:bg-[#d89421] transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </DialogContent>
  );
}

// Main HumidorView Component
export function HumidorView() {
  const [selectedHumidor, setSelectedHumidor] = useState<Humidor | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHumidorPage, setCurrentHumidorPage] = useState(1);
  const [currentCigarPage, setCurrentCigarPage] = useState(1);
  
  // Example data - replace with your actual data
  const EXAMPLE_HUMIDORS = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Humidor ${i + 1}`,
    description: "Example humidor description",
    cigars: Array.from({ length: 20 }, (_, j) => ({
      id: j + 1,
      name: `Cigar ${j + 1}`,
      brand: "Sample Brand",
      quantity: Math.floor(Math.random() * 10) + 1,
    })),
    type: i % 3 === 0 ? "premium" : "regular"
  }));

  const ITEMS_PER_PAGE = 6;

  const getHumidorIcon = (type: string) => {
    switch (type) {
      case 'premium':
        return <Crown className="w-6 h-6" />;
      default:
        return <Box className="w-6 h-6" />;
    }
  };

  const handleCreateHumidor = async (data: {
    name: string;
    description: string;
    imageUrl?: string;
  }) => {
    // TODO: Implement API call to create humidor
    console.log('Creating humidor:', data);
    setIsCreateModalOpen(false);
  };

  // Pagination logic
  const paginateItems = <T extends any>(items: T[], page: number, perPage: number) => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  };

  // Filter cigars based on search query
  const filterCigars = (cigars: Cigar[]) => {
    if (!searchQuery) return cigars;
    return cigars.filter(cigar => 
      cigar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cigar.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Render individual humidor view
  if (selectedHumidor) {
    const filteredCigars = filterCigars(selectedHumidor.cigars);
    const totalCigarPages = Math.ceil(filteredCigars.length / ITEMS_PER_PAGE);
    const paginatedCigars = paginateItems(filteredCigars, currentCigarPage, ITEMS_PER_PAGE);

    return (
      <div className="p-4 text-[#B9B9B9] bg-[#222222]">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedHumidor(null)}
            className="text-white hover:text-[#EFA427] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">{selectedHumidor.name}</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search cigars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#2A2A2A] border-white/10 text-white w-full md:max-w-md"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#EFA427] text-white px-4 py-2 rounded-lg hover:bg-[#d89421] transition-colors">
            <Plus size={20} />
            Add Cigar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {paginatedCigars.map((cigar) => (
            <CigarCard key={cigar.id} cigar={cigar} />
          ))}
        </div>

        {totalCigarPages > 1 && (
          <div className="flex justify-center mt-6">
            <PaginationControls
              currentPage={currentCigarPage}
              totalPages={totalCigarPages}
              onPageChange={setCurrentCigarPage}
            />
          </div>
        )}
      </div>
    );
  }

  // Render humidor list view
  const paginatedHumidors = paginateItems(EXAMPLE_HUMIDORS, currentHumidorPage, ITEMS_PER_PAGE);
  const totalHumidorPages = Math.ceil(EXAMPLE_HUMIDORS.length / ITEMS_PER_PAGE);

  return (
    <div className="p-4 text-[#B9B9B9] bg-[#222222]">
      <h2 className="text-xl font-semibold text-white mb-4">My Humidors</h2>
      <p className="mb-6">Manage your humidors collection!</p>
      
      <div className="flex flex-wrap gap-6 mb-6">
        {paginatedHumidors.map((humidor) => (
          <div
            key={humidor.id}
            onClick={() => setSelectedHumidor(humidor)}
            className="h-48 w-36 bg-[#222222] rounded-lg p-4 text-[#EFA427] hover:bg-[#EFA427] hover:text-white transition-colors cursor-pointer flex flex-col justify-between group border border-white/10 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              {getHumidorIcon(humidor.type)}
              <span className="text-base opacity-80 text-white">
                {humidor.cigars.length}
              </span>
            </div>
            <div>
              <div className="text-lg font-medium group-hover:text-white">
                {humidor.name}
              </div>
              <div className="text-sm opacity-80 text-white">
                {humidor.cigars.length} cigars
              </div>
            </div>
          </div>
        ))}

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <div className="h-48 w-36 bg-[#222222] rounded-lg hover:bg-[#EFA427] transition-colors cursor-pointer flex flex-col items-center justify-center text-white group border border-white/10 shadow-lg hover:shadow-xl">
              <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-lg">Add New</span>
            </div>
          </DialogTrigger>
          <CreateHumidorModal 
            onSubmit={handleCreateHumidor}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </Dialog>
      </div>

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
  );
}