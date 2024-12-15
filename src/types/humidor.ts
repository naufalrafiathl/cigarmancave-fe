// types/humidor.ts
export interface Cigar {
  id: number;
  name: string;
  brand: string;
  imageUrl?: string;
  length?: number;
  ringGauge?: number;
  country?: string;
  strength?: string;
}

export interface HumidorCigar {
  name:string;
  id: number;
  brand: string;
  cigarId: number;
  humidorId: number;
  quantity: number;
  purchasePrice?: number;
  purchaseDate?: string;
  purchaseLocation?: string;
  notes?: string;
  cigar: Cigar;
}

export interface Humidor {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  cigars: HumidorCigar[];
}

export interface CigarDisplay {
  id: number;
  name: string;
  brand: string;
  imageUrl?: string;
  quantity: number;
  purchasePrice?: number;
  purchaseDate?: string;
  purchaseLocation?: string;
  notes?: string;
}