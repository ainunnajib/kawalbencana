"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  InfrastructureCategory,
  RecoveryStatus,
  DamageLevel,
} from "@/types/recovery";
import { X } from "lucide-react";

interface FilterState {
  categories: InfrastructureCategory[];
  statuses: RecoveryStatus[];
  damageLevels: DamageLevel[];
}

interface MapFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  pointCount: number;
}

const categories: { value: InfrastructureCategory; label: string }[] = [
  { value: "bridge", label: "Jembatan" },
  { value: "road", label: "Jalan" },
  { value: "farm", label: "Sawah/Ladang" },
  { value: "market", label: "Pasar" },
  { value: "school", label: "Sekolah" },
  { value: "hospital", label: "Rumah Sakit" },
  { value: "house", label: "Perumahan" },
  { value: "worship_place", label: "Tempat Ibadah" },
  { value: "government_building", label: "Gedung Pemerintah" },
  { value: "water_system", label: "Sistem Air" },
  { value: "power_grid", label: "Jaringan Listrik" },
  { value: "other", label: "Lainnya" },
];

const statuses: { value: RecoveryStatus; label: string; variant: string }[] = [
  { value: "not_started", label: "Belum Dimulai", variant: "destructive" },
  { value: "in_progress", label: "Dalam Proses", variant: "default" },
  { value: "completed", label: "Selesai", variant: "secondary" },
];

const damageLevels: { value: DamageLevel; label: string }[] = [
  { value: "light", label: "Ringan" },
  { value: "moderate", label: "Sedang" },
  { value: "severe", label: "Parah" },
  { value: "total", label: "Hancur Total" },
];

export function MapFilters({ filters, onChange, pointCount }: MapFiltersProps) {
  const toggleCategory = (category: InfrastructureCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories: newCategories });
  };

  const toggleStatus = (status: RecoveryStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses: newStatuses });
  };

  const toggleDamageLevel = (level: DamageLevel) => {
    const newLevels = filters.damageLevels.includes(level)
      ? filters.damageLevels.filter((l) => l !== level)
      : [...filters.damageLevels, level];
    onChange({ ...filters, damageLevels: newLevels });
  };

  const clearFilters = () => {
    onChange({ categories: [], statuses: [], damageLevels: [] });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.statuses.length > 0 ||
    filters.damageLevels.length > 0;

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filter</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="mr-1 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {pointCount} titik pemulihan
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Filter */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Badge
                key={status.value}
                variant={
                  filters.statuses.includes(status.value)
                    ? (status.variant as never)
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleStatus(status.value)}
              >
                {status.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Damage Level Filter */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Tingkat Kerusakan</h3>
          <div className="flex flex-wrap gap-2">
            {damageLevels.map((level) => (
              <Badge
                key={level.value}
                variant={
                  filters.damageLevels.includes(level.value)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleDamageLevel(level.value)}
              >
                {level.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Kategori Infrastruktur</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={
                  filters.categories.includes(category.value)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
