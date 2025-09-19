"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/interceptor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stages = ["all", "designing", "printing", "shipping"];

export default function ReportsPage() {
  const [stage, setStage] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (selectedStage) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/v1/admin/reports${selectedStage !== "all" ? `?stage=${selectedStage}` : ""}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(stage);
  }, [stage]);

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Order Reports
          </h1>
          <p className="text-xs text-muted-foreground">
            Quick glance of orders across stages
          </p>
        </div>

        {/* Stage filters (pills) */}
        <div className="flex flex-wrap gap-2">
          {stages.map((s) => (
            <Button
              key={s}
              variant={stage === s ? "default" : "outline"}
              onClick={() => setStage(s)}
              disabled={loading}
              className={[
                "rounded-full",
                stage === s
                  ? "shadow-sm ring-1 ring-primary/30"
                  : "border-border hover:bg-muted/60",
              ].join(" ")}
              size="sm"
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-sm">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-muted" />
            Loading…
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="rounded-2xl border-border bg-card shadow-sm ring-1 ring-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Today</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight text-card-foreground">
                  {data.today}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm ring-1 ring-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight text-card-foreground">
                  {data.thisWeek}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm ring-1 ring-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight text-card-foreground">
                  {data.thisMonth}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data to display</p>
        )}
      </div>
    </div>
  );
}
