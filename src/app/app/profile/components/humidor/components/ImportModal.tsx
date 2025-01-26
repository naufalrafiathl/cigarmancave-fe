import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, X, Loader2, Check, Crown, Lock } from "lucide-react";
import {
  useImportOperations,
  ImportResult,
  ImportConfirmation,
  ImportedCigar,
} from "@/hooks/useImportOperations";
import { validateFile } from "@/utils/validateFIle";
import { QuotaWarningModal } from "./QuotaWarningModal";
import { useAssistOperations } from "@/hooks/useAssistantOperations";
import Link from "next/link";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  humidorId: number;
  onSuccess: () => void;
}

interface Styles {
  input: string;
  label: string;
  card: string;
  cardHeader: string;
  cardTitle: string;
  cardSubtitle: string;
  section: string;
  sectionTitle: string;
  gridContainer: string;
  removeButton: string;
  inputGroup: string;
  uploadArea: string;
  button: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

const styles: Styles = {
  input:
    "w-full bg-[#363636] rounded-lg px-3 py-2 text-white border border-white/10 focus:border-[#EFA427] focus:outline-none transition-colors",
  label: "block text-sm font-medium text-white/80 mb-1",
  card: "bg-[#2A2A2A] rounded-lg p-4 border border-white/10 hover:border-[#EFA427] transition-duration-200",
  cardHeader: "flex justify-between items-start mb-4",
  cardTitle: "font-medium text-[#E25931]",
  cardSubtitle: "text-sm text-white/60",
  section: "space-y-4",
  sectionTitle: "text-lg font-medium text-white",
  gridContainer: "grid grid-cols-2 gap-4",
  removeButton: "p-1.5 hover:bg-white/5 rounded-full transition-colors",
  inputGroup: "space-y-1",
  uploadArea:
    "flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-[#EFA427] transition-colors cursor-pointer",
  button: {
    primary:
      "px-4 flex py-2 rounded-lg font-medium bg-[#EFA427] text-black hover:bg-[#E25931] transition-colors flex items-center gap-2",
    secondary:
      "px-4 py-2 rounded-lg font-medium bg-[#363636] text-white hover:bg-[#404040] transition-colors",
    disabled:
      "px-4 py-2 rounded-lg font-medium bg-[#363636] text-white/60 cursor-not-allowed",
  },
};

export const ImportModal = ({
  isOpen,
  onClose,
  humidorId,
  onSuccess,
}: ImportModalProps) => {
  const [step, setStep] = useState<"upload" | "processing" | "review">(
    "upload"
  );
  const [showQuotaWarning, setShowQuotaWarning] = useState(false);
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selections, setSelections] = useState<
    Record<string, ImportConfirmation>
  >({});
  const [showLimitsInfo, setShowLimitsInfo] = useState(false);

  const { isPremium, isLoadingPremium } = useAssistOperations();
  const { processImport, confirmImport, isProcessing, isConfirming, getQuota } =
    useImportOperations();
  const [isShowPremiumMessage, setShowPremiumMessage] = useState(isLoadingPremium?isPremium:true)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        validateFile(file);
        setFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Invalid file");
      }
    }
  };

  useEffect(()=>{
    setShowPremiumMessage(!isPremium)
  },[isLoadingPremium])

  const handleProcess = async () => {
    if (!file) return;
    setStep("processing");

    try {
      const quotaResult = await getQuota();
      const remaining = quotaResult.data.images.remaining;

      if (remaining < 1) {
        setShowQuotaWarning(true);
        setTimeout(() => {
          onClose();
        }, 1000);
      }

      const result = await processImport(file);
      setImportResult(result.data);

      const initialSelections: Record<string, ImportConfirmation> = {};

      result.data.matches.exactMatches.forEach((match) => {
        initialSelections[
          `${match.importData.brand}-${match.importData.name}`
        ] = {
          matchType: "exact",
          selectedCigarId: match.existingCigar.id,
          addToHumidor: true,
          humidorId,
          humidorData: {
            quantity: match.importData.quantity,
            purchasePrice: match.importData.purchasePrice || undefined,
          },
        };
      });

      result.data.matches.possibilities.forEach((match) => {
        initialSelections[
          `${match.importData.brand}-${match.importData.name}`
        ] = {
          matchType: "possible",
          selectedCigarId: match.possibleMatches[0]?.id,
          addToHumidor: true,
          humidorId,
          humidorData: {
            quantity: match.importData.quantity,
            purchasePrice: match.importData.purchasePrice || undefined,
          },
        };
      });

      result.data.matches.newEntries.forEach((entry) => {
        initialSelections[`${entry.brand}-${entry.name}`] = {
          matchType: "new",
          importData: entry,
          addToHumidor: true,
          humidorId,
          humidorData: {
            quantity: entry.quantity,
            purchasePrice: entry.purchasePrice || undefined,
          },
        };
      });

      setSelections(initialSelections);
      setStep("review");
    } catch (error) {
      alert(
        "Failed to process import. Please make sure file is not too big, and keep a maximum of 10 cigars in a single upload."
      );
      setStep("upload");
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmImport(Object.values(selections));
      onSuccess();
      onClose();
    } catch (error) {
      alert("Failed to confirm import");
    }
  };

  const updateSelection = (key: string, data: Partial<ImportConfirmation>) => {
    setSelections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...data,
      },
    }));
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <label htmlFor="import-upload" className="block">
        <div className={styles.uploadArea}>
          {previewUrl ? (
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src={previewUrl}
                alt="Upload preview"
                fill
                className="rounded-lg object-contain"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                  setPreviewUrl("");
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/75"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <>
              <Camera className="w-12 h-12 text-white/60 mb-4" />
              <p className="text-white/60 mb-2">
                Upload a photo of your receipt or list
              </p>
              <p className="text-sm text-white/40">
                Supported formats: JPEG, PNG, WebP
              </p>
            </>
          )}
        </div>
      </label>
      <input
        type="file"
        id="import-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />

      <div className="flex justify-end">
        <button
          onClick={handleProcess}
          disabled={!file}
          className={file ? styles.button.primary : styles.button.disabled}
        >
          Process
          {/* <ArrowRight className="w-4 h-4" /> */}
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-[#EFA427] animate-spin mb-4" />
      <p className="text-white/60">Processing your import...</p>
      <p className="text-sm text-white/40 mt-2">This might take a minute</p>
    </div>
  );
  const renderReviewStep = () => {
    if (!importResult) return null;

    return (
      <div className="space-y-6">
        {/* Exact Matches */}
        {importResult.matches.exactMatches.length > 0 && (
          <div className={styles.section}>
            <h3 className="text-xl mt-5">Exact Matches</h3>
            <p className="text-justify text-gray-500 pb-2">
              We found exact match of your cigar(s) in our database. Please
              confirm the quantity and purchase price.
            </p>
            {importResult.matches.exactMatches.map((match) => {
              const key = `${match.importData.brand}-${match.importData.name}`;
              return (
                <div key={key} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h4 className={styles.cardTitle}>
                        {match.existingCigar.brand.name}{" "}
                        {match.existingCigar.name}
                      </h4>
                      <p className={styles.cardSubtitle}>
                        Exact match found in database
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const { [key]: _, ...rest } = selections;
                        setSelections(rest);
                      }}
                      className={styles.removeButton}
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  <div className={styles.gridContainer}>
                    <div className={styles.inputGroup}>
                      <label
                        htmlFor={`quantity-${key}`}
                        className={styles.label}
                      >
                        Quantity
                      </label>
                      <input
                        id={`quantity-${key}`}
                        type="number"
                        value={selections[key]?.humidorData?.quantity || ""}
                        onChange={(e) =>
                          updateSelection(key, {
                            humidorData: {
                              ...selections[key]?.humidorData,
                              quantity: parseInt(e.target.value) || 1,
                            },
                          })
                        }
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor={`price-${key}`} className={styles.label}>
                        Price/stick
                      </label>
                      <input
                        id={`price-${key}`}
                        type="number"
                        step="0.01"
                        value={
                          selections[key]?.humidorData?.purchasePrice || ""
                        }
                        onChange={(e) =>
                          updateSelection(key, {
                            humidorData: {
                              ...selections[key]?.humidorData,
                              purchasePrice: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {importResult.matches.possibilities.length > 0 && (
          <div className={styles.section}>
            <h3 className="text-xl mt-16">Possible Matches</h3>
            <p className="text-justify text-gray-500 pb-2">
              We have not found exact matches of these cigars in our database.
              Please use the dropdown to select from possible matches, or select{" "}
              <span className="text-[#EFA427]">Use Recognition Data</span> from
              the dropdown and let us add the cigar to our database for you.
            </p>
            {importResult.matches.possibilities.map((match) => {
              const key = `${match.importData.brand}-${match.importData.name}`;
              const selection = selections[key];

              return (
                <div key={key} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h4 className={styles.cardTitle}>
                        {match.importData.brand} {match.importData.name}
                      </h4>
                      <p className={styles.cardSubtitle}>
                        Choose the best match
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const { [key]: _, ...rest } = selections;
                        setSelections(rest);
                      }}
                      className={styles.removeButton}
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className={styles.inputGroup}>
                      <label htmlFor={`match-${key}`} className={styles.label}>
                        Select Match
                      </label>
                      <select
                        id={`match-${key}`}
                        value={selection?.selectedCigarId || "import"}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "import") {
                            updateSelection(key, {
                              matchType: "new",
                              importData: match.importData,
                              selectedCigarId: undefined,
                            });
                          } else {
                            updateSelection(key, {
                              matchType: "possible",
                              selectedCigarId: parseInt(value),
                              importData: undefined,
                            });
                          }
                        }}
                        className={styles.input}
                      >
                        <option value="import" className="!text-[#EFA427]">
                          Use Recognition Data
                        </option>
                        {match.possibleMatches.map((possible) => (
                          <option key={possible.id} value={possible.id}>
                            {possible.brand.name} {possible.name} (
                            {Math.round(match.scores[0]?.similarity * 100)}%
                            match)
                          </option>
                        ))}
                      </select>
                    </div>

                    {selection?.importData && (
                      <div className={styles.gridContainer}>
                        <div className={styles.inputGroup}>
                          <label
                            htmlFor={`brand-${key}`}
                            className={styles.label}
                          >
                            Brand
                          </label>
                          <input
                            id={`brand-${key}`}
                            type="text"
                            value={selection?.importData?.brand || ""}
                            onChange={(e) =>
                              updateSelection(key, {
                                importData: {
                                  ...selection?.importData,
                                  brand: e.target.value,
                                } as ImportedCigar,
                              })
                            }
                            className={styles.input}
                            disabled={selection?.selectedCigarId !== undefined}
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label
                            htmlFor={`name-${key}`}
                            className={styles.label}
                          >
                            Name
                          </label>
                          <input
                            id={`name-${key}`}
                            type="text"
                            value={selection?.importData?.name || ""}
                            onChange={(e) =>
                              updateSelection(key, {
                                importData: {
                                  ...selection?.importData,
                                  name: e.target.value,
                                } as ImportedCigar,
                              })
                            }
                            className={styles.input}
                            disabled={selection?.selectedCigarId !== undefined}
                          />
                        </div>
                      </div>
                    )}

                    <div className={styles.gridContainer}>
                      <div className={styles.inputGroup}>
                        <label
                          htmlFor={`quantity-${key}`}
                          className={styles.label}
                        >
                          Quantity
                        </label>
                        <input
                          id={`quantity-${key}`}
                          type="number"
                          value={selection?.humidorData?.quantity || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              humidorData: {
                                ...selection?.humidorData,
                                quantity: parseInt(e.target.value) || 1,
                              },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label
                          htmlFor={`price-${key}`}
                          className={styles.label}
                        >
                          Price
                        </label>
                        <input
                          id={`price-${key}`}
                          type="number"
                          step="0.01"
                          value={selection?.humidorData?.purchasePrice || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              humidorData: {
                                ...selection?.humidorData,
                                purchasePrice: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {importResult.matches.newEntries.length > 0 && (
          <div className={styles.section}>
            <h3 className="text-xl mt-16">New Cigars</h3>
            <p className="text-justify text-gray-500 pb-2">
              These cigars were not found in our database. We've extracted the
              information from your upload, but feel free to review and adjust
              the details before we add them to our collection.
            </p>
            {importResult.matches.newEntries.map((entry) => {
              const key = `${entry.brand}-${entry.name}`;
              const selection = selections[key];

              return (
                <div key={key} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h4 className={styles.cardTitle}>
                        {entry.brand} {entry.name}
                      </h4>
                      <p className={styles.cardSubtitle}>New cigar to add</p>
                    </div>
                    <button
                      onClick={() => {
                        const { [key]: _, ...rest } = selections;
                        setSelections(rest);
                      }}
                      className={styles.removeButton}
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className={styles.gridContainer}>
                      <div className={styles.inputGroup}>
                        <label
                          htmlFor={`brand-${key}`}
                          className={styles.label}
                        >
                          Brand
                        </label>
                        <input
                          id={`brand-${key}`}
                          type="text"
                          value={selection?.importData?.brand || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              importData: {
                                ...selection?.importData,
                                brand: e.target.value,
                              } as ImportedCigar,
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`name-${key}`} className={styles.label}>
                          Name
                        </label>
                        <input
                          id={`name-${key}`}
                          type="text"
                          value={selection?.importData?.name || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              importData: {
                                ...selection?.importData,
                                name: e.target.value,
                              } as ImportedCigar,
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.gridContainer}>
                      <div className={styles.inputGroup}>
                        <label
                          htmlFor={`quantity-${key}`}
                          className={styles.label}
                        >
                          Quantity
                        </label>
                        <input
                          id={`quantity-${key}`}
                          type="number"
                          value={selection?.humidorData?.quantity || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              humidorData: {
                                ...selection?.humidorData,
                                quantity: parseInt(e.target.value) || 1,
                              },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label
                          htmlFor={`price-${key}`}
                          className={styles.label}
                        >
                          Price
                        </label>
                        <input
                          id={`price-${key}`}
                          type="number"
                          step="0.01"
                          value={selection?.humidorData?.purchasePrice || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              humidorData: {
                                ...selection?.humidorData,
                                purchasePrice: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.gridContainer}>
                      <div className={styles.inputGroup}>
                        <label
                          htmlFor={`length-${key}`}
                          className={styles.label}
                        >
                          Length
                        </label>
                        <input
                          id={`length-${key}`}
                          type="number"
                          step="0.25"
                          value={selection?.importData?.length || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              importData: {
                                ...selection?.importData,
                                length: parseFloat(e.target.value) || undefined,
                              } as ImportedCigar,
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label
                          htmlFor={`ring-gauge-${key}`}
                          className={styles.label}
                        >
                          Ring Gauge
                        </label>
                        <input
                          id={`ring-gauge-${key}`}
                          type="number"
                          step="0.5"
                          value={selection?.importData?.ringGauge || ""}
                          onChange={(e) =>
                            updateSelection(key, {
                              importData: {
                                ...selection?.importData,
                                ringGauge:
                                  parseFloat(e.target.value) || undefined,
                              } as ImportedCigar,
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className={styles.button.secondary}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={Object.keys(selections).length === 0 || isConfirming}
            className={
              Object.keys(selections).length > 0 && !isConfirming
                ? styles.button.primary
                : styles.button.disabled
            }
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-black" />
                Confirm Import
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  if(isLoadingPremium) {
    return null
  }

  if (isShowPremiumMessage) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#1A1A1A] text-white sm:max-w-[600px] border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-[#EFA427] text-2xl flex items-center gap-2">
              {isLoadingPremium ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              Premium Feature
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-8">
            <Crown className="w-12 h-12 text-[#EFA427] mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">
              Digital Twin Of Your Humidor
            </h3>
            <p className="text-white/60 mb-6">
              Upload receipts and lists to quickly add cigars to your humidor.
            </p>
            <Link
              href="/app/profile?tab=subscription"
              className="inline-flex items-center px-6 py-3 bg-[#EFA427] text-black rounded-lg 
                hover:bg-[#E25931] transition-colors font-medium gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Premium
            </Link>
            <div onClick={()=>{setShowPremiumMessage(false)}} className="mt-5 hover:text-[#EFA427] cursor-pointer">
              <p>Or try it first</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="bg-[#1A1A1A] text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto border border-white/10">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-[#EFA427] text-2xl">
            Import Cigars
          </DialogTitle>
          <button
            onClick={() => setShowLimitsInfo(true)}
            className="text-sm text-[#B9B9B9] hover:text-[#EFA427] transition-colors flex items-center gap-1"
          >
            <span>How many cigars can I import?</span>
          </button>
        </div>
      </DialogHeader>

      {/* Limits Info Overlay */}
      {showLimitsInfo && (
        <div className="absolute inset-0 z-50 bg-[#1A1A1A] flex flex-col">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-[#EFA427]">Import Limits During Beta</h3>
              <button
                onClick={() => setShowLimitsInfo(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-4 text-[#B9B9B9] text-justify">
              <p>
                While we're in beta, we've set some friendly guidelines to keep things running smoothly for everyone.
              </p>
              
              <p>
                For the best experience, try to keep your image <span className="text-[#EFA427]">under 5MB and only import up to 20 different cigars</span> at once. If your receipt has more cigars, a quick crop before uploading does the trick! <span className="italic">(psst.. you can screenshot your excel/sheets aswell)</span> 
              </p>
              
              <p>
                Don't worry though - our premium users can still use this feature to <span className="text-[#EFA427]">import over 300 cigars monthly</span>, which is... well, quite a collection! We've just set these temporary limits to make sure our systems can handle everyone's imports without breaking a sweat.
              </p>
              
              <p>
                We're working hard behind the scenes to make importing even better, smoother, and more enjoyable for our growing community. Stay tuned for updates!
              </p>
              <p>
                <span className="text-[#EFA427]">To our non premium users:</span> Dont worry, you can try this feature once before you susbscribe, and we're sure you'll love it!
              </p>

              <p>
                <span className="text-[#EFA427]">Quick note:</span> Our system can make mistakes, please double check the cigars before you add them to your humidor!
              </p>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowLimitsInfo(false)}
                className="px-4 py-2 bg-[#EFA427] text-black rounded-lg font-medium hover:bg-[#EFA427]/90 transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "upload" && renderUploadStep()}
      {step === "processing" && renderProcessingStep()}
      {step === "review" && renderReviewStep()}
      <QuotaWarningModal
        isOpen={showQuotaWarning}
        onClose={() => {
          setShowQuotaWarning(false);
        }}
        remaining={quotaRemaining || 0}
        isPremium={isPremium}
      />
    </DialogContent>
  </Dialog>
  );
};
