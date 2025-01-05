export const calculateAgingDays = (purchaseDate: string | null | undefined): number | null => {
    if (!purchaseDate) return null;
    
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const diffTime = today.getTime() - purchase.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };