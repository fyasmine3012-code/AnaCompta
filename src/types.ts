export interface RawMaterial {
  id: string;
  name: string;
  unit: string;
  initQ: number; // Quantité Stock Initial
  initV: number; // Valeur Stock Initial
  purchaseQ: number; // Quantité Achetée
  purchaseP: number; // Prix Unitaire d'Achat
  directExpenseType: string; // Nature charge directe (transport, douane, etc.)
  directExpenseP: number; // Charge Directe unitaire
  directExpenseMode?: 'amount' | 'percentage';
  directExpensePct?: number; 
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  initQ: number; // Stock Initial produit fini Quantité
  initV: number; // Stock Initial produit fini Valeur
  consumedMaterials: Record<string, number>; // rawMaterialId -> Quantité consommée
  modQ: number; // MOD heures
  modP: number; // MOD tarif horaire
  activeWorkshops: Record<string, boolean>; // workshopId -> activé (true/false)
  activeMaterials?: Record<string, boolean>; // rawMaterialId -> activated (true/false)
  workshopQ: Record<string, number>; // workshopId -> Quantité d'œuvre consommée (Q)
  productionVolume: number; // Quantité produite totale (Q)
  quantitySold: number; // Quantité vendue
  sellingPrice: number; // Prix de vente unitaire
  overrideCostOfSales?: number;
  overrideDistributionCost?: number;
  overrideTotalCostPrice?: number;
  overrideRevenue?: number;
  overrideAnalyticMarge?: number;
  standardUnitCost?: number; // Target Budgeted Cost for Variance Analysis
  wastePercentage?: number; // Waste/Loss Percentage per Product
}

export interface Workshop {
  id: string;
  name: string;
  type: 'aux' | 'main';
  natureUO: string; // Nature de l'unité d'œuvre
  nombreUO: number; // Nombre de l'unité d'œuvre
  overrideNombreUO?: number; // Optional user override of the count
}

export interface TrciRow {
  accountCode: string;
  accountName: string;
  isActive: boolean;
  type: 'indirect' | 'direct';
  totalAmount: number;
  pcts: Record<string, number>; // workshopId -> percentage
}

export interface ERPState {
  rawMaterials: RawMaterial[];
  products: Product[];
  workshops: Workshop[];
  trciRows: TrciRow[];
  globalSupp: number; // Supplementary expenses
  globalNonInc: number; // Non-incorporable expenses
  language: 'ar' | 'fr' | 'en';
}
