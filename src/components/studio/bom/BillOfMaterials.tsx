'use client';

import React, { useMemo } from 'react';
import { 
  Calculator, 
  Download, 
  BatteryCharging, 
  DollarSign, 
  Weight, 
  Package, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useRobotStore } from '@/lib/store/robot-store';
import { ROBOT_PARTS_CATALOG } from '@/lib/constants/robot-parts';
import { BOMItem } from '@/lib/types/robot';

export function BillOfMaterials() {
  const parts = useRobotStore((state) => state.parts);
  const title = useRobotStore((state) => state.title);

  // Group placed parts into BOM list
  const bomItems: BOMItem[] = useMemo(() => {
    const itemMap = new Map<string, BOMItem>();

    parts.forEach((p) => {
      const catalog = ROBOT_PARTS_CATALOG.find((c) => c.id === p.partId);
      if (!catalog) return;

      if (itemMap.has(p.partId)) {
        const existing = itemMap.get(p.partId)!;
        existing.quantity += 1;
        existing.totalPrice = existing.quantity * existing.unitPrice;
      } else {
        itemMap.set(p.partId, {
          partId: p.partId,
          name: catalog.name,
          category: catalog.category,
          quantity: 1,
          unitPrice: catalog.approxPriceUsd,
          totalPrice: catalog.approxPriceUsd,
          specs: catalog.specs,
        });
      }
    });

    return Array.from(itemMap.values());
  }, [parts]);

  const totalCost = bomItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalPartsCount = parts.length;

  // Power budget estimate
  const estimatedCurrentIdleMa = useMemo(() => {
    return Math.round(totalPartsCount * 35 + 80);
  }, [totalPartsCount]);

  const estimatedCurrentLoadMa = useMemo(() => {
    return Math.round(totalPartsCount * 220 + 350);
  }, [totalPartsCount]);

  const estimatedBatteryLifeHours = useMemo(() => {
    // Assuming 2600mAh battery pack
    const avgDraw = (estimatedCurrentIdleMa + estimatedCurrentLoadMa) / 2;
    return (2600 / avgDraw).toFixed(1);
  }, [estimatedCurrentIdleMa, estimatedCurrentLoadMa]);

  const handleExportCSV = () => {
    let csv = 'Part Name,Category,Quantity,Unit Price ($),Total Price ($)\n';
    bomItems.forEach((item) => {
      csv += `"${item.name}","${item.category}",${item.quantity},${item.unitPrice.toFixed(2)},${item.totalPrice.toFixed(2)}\n`;
    });
    csv += `\n"Total Cost",,,,${totalCost.toFixed(2)}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_BOM.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white p-3 sm:p-6 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-400" />
              <span>Bill of Materials (BOM)</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono">
              Auto-generated component breakdown for &ldquo;{title}&rdquo;
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Est. Cost</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                ${totalCost.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Components</span>
              <div className="text-2xl font-bold text-sky-400 font-mono">
                {totalPartsCount} Parts ({bomItems.length} Unique)
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Est. Battery Runtime</span>
              <div className="text-2xl font-bold text-amber-400 font-mono">
                ~{estimatedBatteryLifeHours} Hours
              </div>
            </div>
          </div>
        </div>

        {/* BOM Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 font-mono">
              Hardware Component List
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {bomItems.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Key Specs</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bomItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No components placed on the workbench yet.
                    </td>
                  </tr>
                ) : (
                  bomItems.map((item) => (
                    <tr key={item.partId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-slate-100 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{item.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 uppercase text-[10px]">
                        {item.category}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {item.specs.voltage ? `⚡ ${item.specs.voltage}` : ''}{' '}
                        {item.specs.torque ? `⚙️ ${item.specs.torque}` : ''}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-sky-400">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-300">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-400">
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Power & Electrical Budget Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <BatteryCharging className="w-4 h-4" /> Electrical & Power Budget Calculation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Standby / Idle Current:</span>
                <span className="font-mono text-sky-400 font-bold">{estimatedCurrentIdleMa} mA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Load Current (Motors + Logic):</span>
                <span className="font-mono text-amber-400 font-bold">{estimatedCurrentLoadMa} mA</span>
              </div>
            </div>

            <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Power Source:</span>
                <span className="font-mono text-emerald-400 font-bold">2x 18650 Li-ion (7.4V)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Voltage Regulator Required:</span>
                <span className="font-mono text-slate-200">5V Step-Down (LM2596 / L298N)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
