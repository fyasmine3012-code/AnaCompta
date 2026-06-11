import React, { createContext, useContext, useState, useEffect } from 'react';
import { ERPState, RawMaterial, Product, Workshop, TrciRow } from '../types';

interface AppContextProps {
  state: ERPState;
  updateState: (newState: Partial<ERPState> | ((prev: ERPState) => ERPState)) => void;
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  updateRawMaterial: (id: string, material: Partial<RawMaterial>) => void;
  deleteRawMaterial: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addWorkshop: (workshop: Omit<Workshop, 'id'>) => void;
  updateWorkshop: (id: string, workshop: Partial<Workshop>) => void;
  deleteWorkshop: (id: string) => void;
  updateTrciRow: (accountCode: string, fields: Partial<TrciRow>) => void;
  addCustomTrciRow: (code: string, name: string) => void;
  resetToDefault: () => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
  confirmDialog: {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null;
  calculatedValues: {
    trciTotals: {
      initialSums: Record<string, number>;
      secondarySums: Record<string, number>;
      unitCosts: Record<string, number>;
    };
    rawMaterialCumps: Record<string, number>;
    finishedGoodsCumps: Record<string, number>;
    productCosts: Record<string, {
      rawMaterialCost: number;
      modCost: number;
      workshopCost: number;
      totalProductionCost: number;
      unitProductionCost: number;
    }>;
    netResults: Record<string, {
      costOfSales: number;
      distributionCost: number;
      directDistributionCost: number;
      totalCostPrice: number;
      revenue: number;
      analyticMarge: number;
    }>;
    corporateSummary: {
      totalSales: number;
      totalCostPrice: number;
      netProductResult: number;
      netCorporateProfit: number;
    };
  };
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const DEFAULT_WORKSHOPS: Workshop[] = [
  { id: "adm", name: "الإدارة / Administration", type: "aux", natureUO: "-", nombreUO: 1 },
  { id: "maint", name: "الصيانة / Maintenance", type: "aux", natureUO: "-", nombreUO: 1 },
  { id: "appro", name: "التموين / Approvisionnement", type: "main", natureUO: "كمية مشتراة", nombreUO: 10000 },
  { id: "atel1", name: "الورشة 1 / Atelier 1 (Triage)", type: "main", natureUO: "ساعة عمل مباشرة", nombreUO: 450 },
  { id: "atel2", name: "الورشة 2 / Atelier 2 (Assemblage)", type: "main", natureUO: "ساعة تشغيل الآلة", nombreUO: 600 },
  { id: "comm", name: "التجاري / Commercial", type: "main", natureUO: "كمية مباعة", nombreUO: 1750 }
];

const DEFAULT_MATERIALS: RawMaterial[] = [
  { id: "mat_bois", name: "خشب الزان / Bois de Hêtre", unit: "m³", initQ: 1500, initV: 450000, purchaseQ: 2000, purchaseP: 320, directExpenseType: "مصاريف شحن ونقل", directExpenseP: 25 },
  { id: "mat_plast", name: "بلاستيك خام / Plastique brut", unit: "kg", initQ: 5000, initV: 125000, purchaseQ: 8000, purchaseP: 40, directExpenseType: "حقوق الجمركة", directExpenseP: 2 }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_table",
    name: "طاولة خشبية / Table en bois",
    unit: "unité",
    initQ: 200,
    initV: 120000,
    consumedMaterials: { mat_bois: 0.1 }, // consumes 0.1 m³ per table
    modQ: 500,
    modP: 150,
    activeWorkshops: { atel1: true, atel2: true },
    workshopQ: { atel1: 120, atel2: 180 },
    productionVolume: 400,
    quantitySold: 350,
    sellingPrice: 2500
  },
  {
    id: "prod_chaise",
    name: "كرسي بلاستيكي / Chaise PVC",
    unit: "unité",
    initQ: 500,
    initV: 150000,
    consumedMaterials: { mat_plast: 2.5 }, // consumes 2.5kg per chaise
    modQ: 200,
    modP: 100,
    activeWorkshops: { atel2: true },
    workshopQ: { atel2: 100 },
    productionVolume: 1200,
    quantitySold: 1400,
    sellingPrice: 650
  }
];

const CHARTS_OF_ACCOUNTS = [
  { code: "600", name: "مشتريات البضاعة المباعة / Achats de Marchandises", type: "indirect", active: true, amount: 120000 },
  { code: "601", name: "المواد الأولية المستهلكة / Matières Premières Consommées", type: "direct", active: true, amount: 450000 },
  { code: "602", name: "التموينات الأخرى المستهلكة / Approvisionnements et Fournitures", type: "indirect", active: true, amount: 60000 },
  { code: "604", name: "مشتريات الدراسات والخدمات / Études et Prestations", type: "indirect", active: false, amount: 0 },
  { code: "605", name: "مشتريات المعدات والتجهيزات / Matériel et Travaux", type: "indirect", active: false, amount: 0 },
  { code: "607", name: "المشتريات غير المخزنة / Achats Non Stockés", type: "indirect", active: true, amount: 85000 },
  { code: "611", name: "التقاول العام (المقاولة بالباطن) / Sous-traitance", type: "indirect", active: false, amount: 0 },
  { code: "613", name: "الإيجارات / Loyers", type: "indirect", active: true, amount: 180000 },
  { code: "615", name: "الصيانة والتصليحات والرعاية / Entretien et Réparations", type: "indirect", active: true, amount: 95000 },
  { code: "616", name: "أقساط التأمينات / Primes d’assurances", type: "indirect", active: false, amount: 40000 },
  { code: "621", name: "العاملون الخارجيون / Personnel Extérieur", type: "indirect", active: false, amount: 0 },
  { code: "622", name: "أجور الوسطاء والأتعاب / Honoraires", type: "indirect", active: true, amount: 35000 },
  { code: "623", name: "الإشهار والنشر والعلاقات العمومية / Publicité", type: "indirect", active: false, amount: 0 },
  { code: "624", name: "نقل السلع والنقل الجماعي للمستخدمين / Transports", type: "indirect", active: true, amount: 110000 },
  { code: "631", name: "أجور المستخدمين / Salaires et Traitements", type: "direct", active: true, amount: 750000 },
  { code: "635", name: "الاشتراكات للهيئات الاجتماعية / Charges Sociales", type: "indirect", active: true, amount: 140000 },
  { code: "641", name: "الضرائب المماثلة على الأجور / Impôts sur Salaires", type: "indirect", active: false, amount: 0 },
  { code: "642", name: "الضرائب غير المسترجعة عن رقم الأعمال / Autres Impôts", type: "indirect", active: true, amount: 50000 },
  { code: "651", name: "الأتاوى المترتبة على الامتيازات / Redevances", type: "indirect", active: false, amount: 0 },
  { code: "656", name: "الغرامات والعقوبات والإعانات / Amendes et Dons", type: "indirect", active: false, amount: 0 },
  { code: "661", name: "أعباء الفوائد / Charges d'intérêts", type: "indirect", active: false, amount: 0 },
  { code: "681", name: "مخصصات الاهتلاكات للأصول / Dotations Amortissements", type: "indirect", active: true, amount: 320000 },
  { code: "685", name: "مخصصات الاهتلاكات للأصول الجارية / Provisions", type: "indirect", active: false, amount: 0 }
];

const INITIAL_TRCI_ROWS: TrciRow[] = CHARTS_OF_ACCOUNTS.map((acc, index) => {
  // Distribute percentages evenly or logically across default workshops
  const pcts: Record<string, number> = {};
  DEFAULT_WORKSHOPS.forEach((ws, i) => {
    // Generate some interesting percentage splits
    if (ws.id === 'adm') pcts[ws.id] = 10;
    else if (ws.id === 'maint') pcts[ws.id] = 10;
    else if (ws.id === 'appro') pcts[ws.id] = 20;
    else if (ws.id === 'atel1') pcts[ws.id] = 25;
    else if (ws.id === 'atel2') pcts[ws.id] = 25;
    else if (ws.id === 'comm') pcts[ws.id] = 10;
  });
  return {
    accountCode: acc.code,
    accountName: acc.name,
    isActive: acc.active,
    type: acc.type as 'indirect' | 'direct',
    totalAmount: acc.amount,
    pcts
  };
});

const DEFAULT_STATE: ERPState = {
  rawMaterials: DEFAULT_MATERIALS,
  products: DEFAULT_PRODUCTS,
  workshops: DEFAULT_WORKSHOPS,
  trciRows: INITIAL_TRCI_ROWS,
  globalSupp: 75000, // supplementary charges
  globalNonInc: 45000, // non-incorporable expenses
  language: 'ar'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ERPState>(() => {
    const saved = localStorage.getItem('anacompta_erp_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure language is a valid key
        if (!parsed.language) parsed.language = 'ar';
        return parsed;
      } catch (e) {
        console.error("Failed to parse local storage ERP state", e);
      }
    }
    return DEFAULT_STATE;
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      }
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  useEffect(() => {
    localStorage.setItem('anacompta_erp_state', JSON.stringify(state));
  }, [state]);

  const updateState = (newState: Partial<ERPState> | ((prev: ERPState) => ERPState)) => {
    setState(prev => {
      const updated = typeof newState === 'function' ? newState(prev) : { ...prev, ...newState };
      return updated;
    });
  };

  const addRawMaterial = (material: Omit<RawMaterial, 'id'>) => {
    const id = `mat_${Date.now()}`;
    updateState(prev => ({
      ...prev,
      rawMaterials: [...prev.rawMaterials, { ...material, id }]
    }));
  };

  const updateRawMaterial = (id: string, material: Partial<RawMaterial>) => {
    updateState(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map(m => m.id === id ? { ...m, ...material } : m)
    }));
  };

  const deleteRawMaterial = (id: string) => {
    updateState(prev => {
      return {
        ...prev,
        rawMaterials: prev.rawMaterials.filter(m => m.id !== id),
        // Clean up consumed references and active states in products
        products: prev.products.map(p => {
          const consumed = { ...p.consumedMaterials };
          delete consumed[id];

          const activeMat = p.activeMaterials ? { ...p.activeMaterials } : undefined;
          if (activeMat) {
            delete activeMat[id];
          }

          return { 
            ...p, 
            consumedMaterials: consumed,
            activeMaterials: activeMat
          };
        })
      };
    });
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const id = `prod_${Date.now()}`;
    updateState(prev => ({
      ...prev,
      products: [...prev.products, { ...product, id }]
    }));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    updateState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...product } : p)
    }));
  };

  const deleteProduct = (id: string) => {
    updateState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const addWorkshop = (workshop: Omit<Workshop, 'id'>) => {
    const id = `ws_${Date.now()}`;
    updateState(prev => {
      // Add workshop to trci pcts for all existing rows
      const updatedTrciRows = prev.trciRows.map(row => {
        const pcts = { ...row.pcts };
        pcts[id] = 0; // Initialize with 0%
        return { ...row, pcts };
      });

      // Find the index of the Commercial workshop ('comm') to insert BEFORE it
      const commIdx = prev.workshops.findIndex(w => w.id === 'comm');
      const updatedWorkshops = [...prev.workshops];
      if (commIdx !== -1) {
        updatedWorkshops.splice(commIdx, 0, { ...workshop, id });
      } else {
        updatedWorkshops.push({ ...workshop, id });
      }

      return {
        ...prev,
        workshops: updatedWorkshops,
        trciRows: updatedTrciRows
      };
    });
  };

  const updateWorkshop = (id: string, workshop: Partial<Workshop>) => {
    updateState(prev => ({
      ...prev,
      workshops: prev.workshops.map(w => w.id === id ? { ...w, ...workshop } : w)
    }));
  };

  const deleteWorkshop = (id: string) => {
    updateState(prev => ({
      ...prev,
      workshops: prev.workshops.filter(w => w.id !== id),
      // Remove from row allocations in TRCI
      trciRows: prev.trciRows.map(row => {
        const pcts = { ...row.pcts };
        delete pcts[id];
        return { ...row, pcts };
      }),
      // Remove workshop usage references in products
      products: prev.products.map(p => {
        const active = { ...p.activeWorkshops };
        const qSpent = { ...p.workshopQ };
        delete active[id];
        delete qSpent[id];
        return { ...p, activeWorkshops: active, workshopQ: qSpent };
      })
    }));
  };

  const updateTrciRow = (accountCode: string, fields: Partial<TrciRow>) => {
    updateState(prev => ({
      ...prev,
      trciRows: prev.trciRows.map(row => row.accountCode === accountCode ? { ...row, ...fields } : row)
    }));
  };

  const addCustomTrciRow = (code: string, name: string) => {
    updateState(prev => {
      // Ensure all current workshops get an entry of 0%
      const pcts: Record<string, number> = {};
      prev.workshops.forEach(w => {
        pcts[w.id] = 0;
      });
      const newRow: TrciRow = {
        accountCode: code,
        accountName: name,
        isActive: true,
        type: 'indirect',
        totalAmount: 0,
        pcts
      };
      return {
        ...prev,
        trciRows: [...prev.trciRows, newRow]
      };
    });
  };

  const resetToDefault = () => {
    setState(DEFAULT_STATE);
  };

  // ERP CALCULATIONS CENTRAL MODULE
  const getCalculatedValues = () => {
    // 1. TRCI Calculations
    const initialSums: Record<string, number> = {};
    state.workshops.forEach(w => {
      initialSums[w.id] = 0;
    });

    // Sum indirect rows allocated to each workshop
    let totalIndirectExpenses = 0;
    state.trciRows.forEach(row => {
      if (row.isActive && row.type === 'indirect') {
        totalIndirectExpenses += row.totalAmount;
        state.workshops.forEach(w => {
          const pct = row.pcts[w.id] || 0;
          initialSums[w.id] += (pct / 100) * row.totalAmount;
        });
      }
    });

    // Secondary distribution columns structure
    const secondarySums: Record<string, number> = {};
    const auxSections = state.workshops.filter(w => w.type === 'aux');
    const mainSections = state.workshops.filter(w => w.type === 'main');
    
    // Sum up auxiliary initial sums
    let auxSumTotal = 0;
    auxSections.forEach(aux => {
      auxSumTotal += initialSums[aux.id] || 0;
    });

    state.workshops.forEach(w => {
      if (w.type === 'aux') {
        secondarySums[w.id] = 0; // Cleared in secondary allocation
      } else {
        // Distribute aux totals equally to main sections as per business rules reference
        const originalVal = initialSums[w.id] || 0;
        const mainCount = mainSections.length || 1;
        secondarySums[w.id] = originalVal + (auxSumTotal / mainCount);
      }
    });

    // UO Cost Calculations
    const unitCosts: Record<string, number> = {};
    state.workshops.forEach(w => {
      if (w.type === 'aux') {
        unitCosts[w.id] = 0;
      } else {
        // Calculate Nombre UO automatically based on context elements to keep it synced, but fallback to custom/override value if specified
        let dynamicNombre = w.overrideNombreUO !== undefined ? w.overrideNombreUO : (w.nombreUO || 1);

        if (w.overrideNombreUO === undefined) {
          if (w.id === 'appro') {
            // Appro UO Nombre = Sum of purchase quantities of all raw materials
            const totalPrq = state.rawMaterials.reduce((acc, rm) => acc + rm.purchaseQ, 0);
            dynamicNombre = totalPrq > 0 ? totalPrq : (w.nombreUO || 1);
          } else if (w.id === 'comm') {
            // Comm UO Nombre = Sum of sold quantities of products
            const totalSld = state.products.reduce((acc, p) => acc + p.quantitySold, 0);
            dynamicNombre = totalSld > 0 ? totalSld : (w.nombreUO || 1);
          } else {
            // Workshops UO counts = sum of active workshop units used across products
            const totalWsUsage = state.products.reduce((acc, p) => {
              if (p.activeWorkshops[w.id]) {
                return acc + (p.workshopQ[w.id] || 0);
              }
              return acc;
            }, 0);
            dynamicNombre = totalWsUsage > 0 ? totalWsUsage : (w.nombreUO || 1);
          }
        }

        const secSum = secondarySums[w.id] || 0;
        unitCosts[w.id] = dynamicNombre > 0 ? (secSum / dynamicNombre) : 0;
      }
    });

    // 2. Cost of Purchases & Stocks (CUMP calculation per Materials)
    const rawMaterialCumps: Record<string, number> = {};
    const approUnitCost = unitCosts['appro'] || 0;

    state.rawMaterials.forEach(rm => {
      const basicAmt = rm.purchaseQ * rm.purchaseP;
      const unitDirectP = rm.directExpenseMode === 'percentage'
        ? rm.purchaseP * ((rm.directExpensePct || 0) / 100)
        : (rm.directExpenseP || 0);
      const directAmt = rm.purchaseQ * unitDirectP; // Unit direct charges
      const indirectAmt = rm.purchaseQ * approUnitCost;
      const totalPurchaseV = basicAmt + directAmt + indirectAmt;
      
      const combinedQ = rm.initQ + rm.purchaseQ;
      const combinedV = rm.initV + totalPurchaseV;
      
      rawMaterialCumps[rm.id] = combinedQ > 0 ? (combinedV / combinedQ) : 0;
    });

    // 3. Cost of Production & Stocks per Products
    const productCosts: Record<string, {
      rawMaterialCost: number;
      modCost: number;
      workshopCost: number;
      totalProductionCost: number;
      unitProductionCost: number;
    }> = {};

    const finishedGoodsCumps: Record<string, number> = {};

    state.products.forEach(p => {
      // Consumed raw materials
      let rawMaterialCost = 0;
      Object.entries(p.consumedMaterials).forEach(([matId, qty]) => {
        const isActive = p.activeMaterials ? p.activeMaterials[matId] !== false : true;
        if (isActive) {
          const cmup = rawMaterialCumps[matId] || 0;
          // The qty can represent either unit consumption or period total.
          // If the user inputs a small unit consumption (e.g. 0.1 m³ or 2.5kg per product)
          // the total consumed is qty * productionVolume! Let's follow standard math logic:
          // is qty a unit consumption? Yes! If qty is small (e.g. < 50), let's assume it is unit consumption, and total consumed = qty * productionVolume.
          // Let's multiply by productionVolume to get standard period cost!
          const totalMatQty = Number(qty) * p.productionVolume;
          rawMaterialCost += totalMatQty * cmup;
        }
      });

      // MOD
      const modCost = p.modQ * p.modP;

      // Workshops indirect expenses
      let workshopCost = 0;
      state.workshops.forEach(w => {
        if (p.activeWorkshops[w.id] && w.type === 'main' && w.id !== 'appro' && w.id !== 'comm') {
          const wq = p.workshopQ[w.id] || 0;
          const uCost = unitCosts[w.id] || 0;
          workshopCost += wq * uCost;
        }
      });

      const totalProductionCost = rawMaterialCost + modCost + workshopCost;
      const unitProductionCost = p.productionVolume > 0 ? (totalProductionCost / p.productionVolume) : 0;

      productCosts[p.id] = {
        rawMaterialCost,
        modCost,
        workshopCost,
        totalProductionCost,
        unitProductionCost
      };

      // Finished goods stock card
      const combQ = p.initQ + p.productionVolume;
      const combV = p.initV + totalProductionCost;
      finishedGoodsCumps[p.id] = combQ > 0 ? (combV / combQ) : 0;
    });

    // 4. Cost Price, Revenues, and Profit Margin per Product
    const netResults: Record<string, {
      costOfSales: number;
      distributionCost: number;
      directDistributionCost: number;
      totalCostPrice: number;
      revenue: number;
      analyticMarge: number;
    }> = {};

    let totalSales = 0;
    let totalCostPrice = 0;
    let netProductResult = 0;

    const commUnitCost = unitCosts['comm'] || 0;

    state.products.forEach(p => {
      const prodCmupOnSale = finishedGoodsCumps[p.id] || 0;
      
      const costOfSales = p.overrideCostOfSales !== undefined 
        ? p.overrideCostOfSales 
        : p.quantitySold * prodCmupOnSale;
      
      const directDistP = p.directDistP || 0;
      const directDistributionCost = p.overrideDirectDistAmt !== undefined
        ? p.overrideDirectDistAmt
        : p.quantitySold * directDistP;

      const distributionCost = p.overrideDistributionCost !== undefined 
        ? p.overrideDistributionCost 
        : p.quantitySold * commUnitCost;
      
      const totalCP = p.overrideTotalCostPrice !== undefined 
        ? p.overrideTotalCostPrice 
        : costOfSales + directDistributionCost + distributionCost;

      const revenue = p.overrideRevenue !== undefined 
        ? p.overrideRevenue 
        : p.quantitySold * p.sellingPrice;
      
      const analyticMarge = p.overrideAnalyticMarge !== undefined 
        ? p.overrideAnalyticMarge 
        : revenue - totalCP;

      netResults[p.id] = {
        costOfSales,
        distributionCost,
        directDistributionCost,
        totalCostPrice: totalCP,
        revenue,
        analyticMarge
      };

      totalSales += revenue;
      totalCostPrice += totalCP;
      netProductResult += analyticMarge;
    });

    const netCorporateProfit = netProductResult + state.globalSupp - state.globalNonInc;

    return {
      trciTotals: {
        initialSums,
        secondarySums,
        unitCosts
      },
      rawMaterialCumps,
      finishedGoodsCumps,
      productCosts,
      netResults,
      corporateSummary: {
        totalSales,
        totalCostPrice,
        netProductResult,
        netCorporateProfit
      }
    };
  };

  const calculatedValues = getCalculatedValues();

  return (
    <AppContext.Provider value={{
      state,
      updateState,
      addRawMaterial,
      updateRawMaterial,
      deleteRawMaterial,
      addProduct,
      updateProduct,
      deleteProduct,
      addWorkshop,
      updateWorkshop,
      deleteWorkshop,
      updateTrciRow,
      addCustomTrciRow,
      resetToDefault,
      showConfirm,
      closeConfirm,
      confirmDialog,
      calculatedValues
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
