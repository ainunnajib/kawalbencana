"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapFilters } from "@/components/map/MapFilters";
import { RecoveryPointDetail } from "@/components/recovery/RecoveryPointDetail";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { mockRecoveryPoints } from "@/utils/data/mockRecoveryPoints";
import type {
  RecoveryPoint,
  InfrastructureCategory,
  RecoveryStatus,
  DamageLevel,
} from "@/types/recovery";
import { Menu, X, User, LogIn, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dynamically import the map component to avoid SSR issues
const RecoveryMap = dynamic(
  () => import("@/components/map/RecoveryMap").then((mod) => mod.RecoveryMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

interface FilterState {
  categories: InfrastructureCategory[];
  statuses: RecoveryStatus[];
  damageLevels: DamageLevel[];
}

export default function MapPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    statuses: [],
    damageLevels: [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<RecoveryPoint | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Filter recovery points based on active filters
  const filteredPoints = useMemo(() => {
    return mockRecoveryPoints.filter((point) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(point.category)
      ) {
        return false;
      }
      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(point.status)
      ) {
        return false;
      }
      if (
        filters.damageLevels.length > 0 &&
        !filters.damageLevels.includes(point.damage_level)
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const handlePointClick = (point: RecoveryPoint) => {
    setSelectedPoint(point);
    setDetailModalOpen(true);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">KawalBencana</h1>
            <p className="text-sm text-muted-foreground">
              Peta Pemulihan Aceh & Sumatera
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Auth Button */}
            {authLoading ? (
              <Button variant="ghost" size="sm" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user.email?.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Masuk
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full pt-[73px]">
        {/* Sidebar */}
        <div
          className={`absolute left-0 top-[73px] z-10 h-[calc(100vh-73px)] w-80 bg-background transition-transform md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <MapFilters
            filters={filters}
            onChange={setFilters}
            pointCount={filteredPoints.length}
          />
        </div>

        {/* Map Container */}
        <div className="flex-1">
          <RecoveryMap points={filteredPoints} onPointClick={handlePointClick} />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h3 className="mb-2 text-sm font-semibold">Status Pemulihan</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive"></div>
            <span>Belum Dimulai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>Dalam Proses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-secondary"></div>
            <span>Selesai</span>
          </div>
        </div>
      </div>

      {/* Recovery Point Detail Modal */}
      <RecoveryPointDetail
        point={selectedPoint}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
