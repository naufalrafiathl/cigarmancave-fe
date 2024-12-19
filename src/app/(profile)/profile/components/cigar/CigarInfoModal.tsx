import React, { useEffect } from "react";
import {
  X,
  Package,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
} from "lucide-react";

interface Cigar {
  id: number;
  name: string;
  brand: string;
  imageUrl?: string;
  length?: number | null;
  ringGauge?: number | null;
  country?: string | null;
  filler?: string | null;
  wrapper?: string | null;
  binder?: string | null;
  color?: string | null;
  strength?: string | null;
}

interface HumidorCigar {
  id: number;
  quantity: number;
  purchasePrice?: number | null;
  purchaseDate?: string | null;
  purchaseLocation?: string | null;
  notes?: string | null;
  cigar: Cigar;
}

interface CigarInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Cigar | HumidorCigar;
  mode?: "cigar" | "humidor";
}

const CigarInfoModal = ({
  isOpen,
  onClose,
  data,
  mode = "cigar",
}: CigarInfoModalProps) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const cigar: Cigar = "cigar" in data ? data.cigar : data;
  const humidorData = "cigar" in data ? data : null;

  const hasValue = (value: any): boolean => {
    return value !== null && value !== undefined && value !== "";
  };

  const cigarDetails = [
    { label: "Length", value: cigar.length },
    { label: "Ring Gauge", value: cigar.ringGauge },
    { label: "Country", value: cigar.country },
    { label: "Strength", value: cigar.strength },
  ].filter((detail) => hasValue(detail.value));

  const constructionDetails = [
    { label: "Wrapper", value: cigar.wrapper },
    { label: "Binder", value: cigar.binder },
    { label: "Filler", value: cigar.filler },
    { label: "Color", value: cigar.color },
  ].filter((detail) => hasValue(detail.value));

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="bg-[#2A2A2A] text-white rounded-xl w-full max-w-3xl p-6 max-h-[90vh] max-sm:p-3 max-sm:max-h-[75vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            <div className="relative flex justify-between items-start mb-4">
              <div className="pr-8">
                <h2 className="text-xl font-semibold break-words">
                  {cigar.name}
                </h2>
                <p className="text-sm text-[#B9B9B9] mt-1">{cigar.brand}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-[#EFA427] hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <div className="bg-[#222222] rounded-lg overflow-hidden aspect-square w-full">
                  {cigar.imageUrl ? (
                    <img
                      src={cigar.imageUrl}
                      alt={cigar.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-6">
                {cigarDetails.length > 0 && (
                  <section>
                    <h3 className="text-lg font-medium mb-3">Cigar Details</h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[#B9B9B9]">
                      {cigarDetails.map((detail) => (
                        <p key={detail.label}>
                          {detail.label}: {detail.value}
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {constructionDetails.length > 0 && (
                  <section>
                    <h3 className="text-lg font-medium mb-3">Construction</h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[#B9B9B9]">
                      {constructionDetails.map((detail) => (
                        <p key={detail.label}>
                          {detail.label}: {detail.value}
                        </p>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {mode === "humidor" && humidorData && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Inventory Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="bg-[#222222] p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-[#EFA427]">
                      <Package className="w-5 h-5" />
                      <span>Quantity</span>
                    </div>
                    <p className="mt-1 text-2xl font-semibold">
                      {humidorData.quantity}
                    </p>
                  </div>

                  {hasValue(humidorData.purchasePrice) && (
                    <div className="bg-[#222222] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-[#EFA427]">
                        <DollarSign className="w-5 h-5" />
                        <span>Purchase Price</span>
                      </div>
                      <p className="mt-1 text-2xl font-semibold">
                        ${humidorData.purchasePrice?.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {hasValue(humidorData.purchaseDate) && (
                    <div className="bg-[#222222] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-[#EFA427]">
                        <Calendar className="w-5 h-5" />
                        <span>Purchase Date</span>
                      </div>
                      <p className="mt-1 text-lg font-semibold">
                        {formatDate(humidorData.purchaseDate)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {hasValue(humidorData.purchaseLocation) && (
                    <div className="bg-[#222222] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-[#EFA427]">
                        <MapPin className="w-5 h-5" />
                        <span>Purchase Location</span>
                      </div>
                      <p className="mt-1">{humidorData.purchaseLocation}</p>
                    </div>
                  )}

                  {hasValue(humidorData.notes) && (
                    <div className="bg-[#222222] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-[#EFA427]">
                        <FileText className="w-5 h-5" />
                        <span>Notes</span>
                      </div>
                      <p className="mt-1">{humidorData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CigarInfoModal;
