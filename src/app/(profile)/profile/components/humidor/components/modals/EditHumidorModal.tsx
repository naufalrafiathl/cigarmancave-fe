import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditHumidorModalProps {
  humidor?: {
    id?: number;
    name: string;
    description?: string;
    imageUrl?: string;
  };
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}

export function EditHumidorModal({
  humidor,
  onSubmit,
  onClose,
}: EditHumidorModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: humidor?.name || "",
      description: humidor?.description || "",
    },
  });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-[#2A2A2A] rounded-lg p-6 mx-4 w-full max-w-md border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {humidor ? "Edit Humidor" : "Create New Humidor"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
              Name
            </label>
            <input
              {...form.register("name")}
              className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-lg 
                text-white placeholder-gray-400 
                focus:outline-none focus:ring-1 focus:ring-[#EFA427] focus:border-[#EFA427]
                transition-colors"
              placeholder="Enter humidor name"
            />
            {form.formState.errors.name && (
              <p className="mt-1.5 text-sm text-red-400">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
              Description
            </label>
            <textarea
              {...form.register("description")}
              className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-lg 
                text-white placeholder-gray-400 
                focus:outline-none focus:ring-1 focus:ring-[#EFA427] focus:border-[#EFA427]
                transition-colors min-h-[100px] resize-none"
              placeholder="Enter description (optional)"
            />
            {form.formState.errors.description && (
              <p className="mt-1.5 text-sm text-red-400">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#B9B9B9] bg-transparent 
                border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#EFA427] 
                rounded-lg hover:bg-[#d89421] disabled:opacity-50 transition-colors"
            >
              {humidor ? "Save Changes" : "Create Humidor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
