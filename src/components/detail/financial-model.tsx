"use client";

import { useState } from "react";
import type { Deal, FinanceStrategy, Scenario } from "@/types/deal";
import { formatGBP } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export function FinancialModel({ deal }: { deal: Deal }) {
  const [scenario, setScenario] = useState<Scenario>("base");
  const [strategy, setStrategy] = useState<FinanceStrategy>("bridge_brrr");

  const model =
    strategy === "bridge_brrr"
      ? deal.layers.financial.bridgeBrrr[scenario]
      : deal.layers.financial.cashRefi[scenario];

  const chartData = (["best", "base", "worst"] as Scenario[]).map((s) => {
    const b = deal.layers.financial.bridgeBrrr[s];
    const c = deal.layers.financial.cashRefi[s];
    return {
      name: s.charAt(0).toUpperCase() + s.slice(1),
      "Bridge stuck": b.capitalStuck,
      "Cash stuck": c.capitalStuck,
      "Bridge cash-in": b.cashIn,
      "Cash cash-in": c.cashIn,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["best", "base", "worst"] as Scenario[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScenario(s)}
            className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
              scenario === s
                ? "border-emerald-600 bg-emerald-50 font-medium text-emerald-900"
                : "hover:bg-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Tabs value={strategy} onValueChange={(v) => setStrategy(v as FinanceStrategy)}>
        <TabsList>
          <TabsTrigger value="bridge_brrr">Bridge BRRR</TabsTrigger>
          <TabsTrigger value="cash_refi">Cash + refi</TabsTrigger>
        </TabsList>
        <TabsContent value="bridge_brrr" className="mt-3">
          <ModelGrid model={model} note="SPV bridge 70% LTV · 1%/mo · 9 months · refi at 75% GDV" />
        </TabsContent>
        <TabsContent value="cash_refi" className="mt-3">
          <ModelGrid model={model} note="All-cash purchase + refurb, then refinance at 75% GDV" />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scenario comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis tickFormatter={(v) => `£${Math.round(v / 1000)}k`} fontSize={12} />
              <Tooltip formatter={(v) => formatGBP(Number(v))} />
              <Legend />
              <Bar dataKey="Bridge stuck" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cash stuck" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function ModelGrid({
  model,
  note,
}: {
  model: Deal["layers"]["financial"]["bridgeBrrr"]["base"];
  note: string;
}) {
  const rows = [
    ["Purchase price", model.purchasePrice],
    ["Refurb", model.refurb],
    ["Purchase costs", model.purchaseCosts],
    ...(model.bridgeInterest != null ? [["Bridge interest", model.bridgeInterest] as const] : []),
    ...(model.bridgeFees != null ? [["Bridge fees", model.bridgeFees] as const] : []),
    ["Cash-in", model.cashIn],
    ["GDV", model.gdv],
    ["Refinance (75% LTV)", model.refinanceAmount],
    ["Cash-out / recovered", model.cashOut],
    ["Capital stuck", model.capitalStuck],
  ] as const;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{note}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
              label === "Capital stuck" ? "border-emerald-200 bg-emerald-50/50 font-semibold" : ""
            }`}
          >
            <span className="text-muted-foreground">{label}</span>
            <span>{formatGBP(value)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm sm:col-span-2">
          <span className="text-muted-foreground">% pull-out</span>
          <span className="font-medium">{model.pullOutPct}%</span>
        </div>
      </div>
    </div>
  );
}
