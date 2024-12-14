// components/humidor/modals/EditHumidorCigarModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Cigar {
  id: number;
  name: string;
  brand: string;
}

const formSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  purchasePrice: z.number().min(0, "Price must be positive").optional(),
  purchaseDate: z.string().optional(),
  purchaseLocation: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditHumidorCigarModalProps {
  humidorCigar?: {
    id?: number;
    quantity: number;
    purchasePrice?: number;
    purchaseDate?: string;
    purchaseLocation?: string;
    notes?: string;
  };
  cigar: Cigar;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}

export function EditHumidorCigarModal({
  humidorCigar,
  cigar,
  onSubmit,
  onClose,
}: EditHumidorCigarModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: humidorCigar?.quantity || 1,
      purchasePrice: humidorCigar?.purchasePrice,
      purchaseDate: humidorCigar?.purchaseDate,
      purchaseLocation: humidorCigar?.purchaseLocation || "",
      notes: humidorCigar?.notes || "",
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {humidorCigar ? "Edit Cigar in Humidor" : "Add Cigar to Humidor"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-lg font-medium">{cigar.name}</p>
          <p className="text-sm text-gray-600">{cigar.brand}</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              {...form.register("quantity", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.quantity && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <input
              type="number"
              step="0.01"
              {...form.register("purchasePrice", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.purchasePrice && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              {...form.register("purchaseDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.purchaseDate && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.purchaseDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Location
            </label>
            <input
              type="text"
              {...form.register("purchaseLocation")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...form.register("notes")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {humidorCigar ? "Save Changes" : "Add to Humidor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}