"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RecoveryPoint } from "@/types/recovery";

// Category colors for markers
const categoryColors: Record<string, string> = {
  bridge: "#ef4444",
  road: "#f97316",
  farm: "#84cc16",
  market: "#06b6d4",
  school: "#3b82f6",
  hospital: "#ec4899",
  house: "#a855f7",
  worship_place: "#eab308",
  government_building: "#6366f1",
  water_system: "#0ea5e9",
  power_grid: "#f59e0b",
  other: "#6b7280",
};

// Custom marker icons by category
function getCategoryIcon(category: string): L.Icon {
  const color = categoryColors[category] || categoryColors.other;
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.125 12.5 28.125S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}

interface RecoveryMapProps {
  points: RecoveryPoint[];
  onPointClick?: (point: RecoveryPoint) => void;
}

export function RecoveryMap({ points, onPointClick }: RecoveryMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default center (Aceh region)
  const defaultCenter: [number, number] = [3.5952, 97.3];
  const defaultZoom = 7;

  useEffect(() => {
    // Skip if already initialized or no container
    if (mapInstanceRef.current || !containerRef.current) {
      setMapReady(true);
      return;
    }

    // Check if container already has a map (from previous mount in strict mode)
    const container = containerRef.current;
    if ((container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) {
      // Container already has a map, skip initialization
      setMapReady(true);
      return;
    }

    // Create new map instance
    const map = L.map(container).setView(defaultCenter, defaultZoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    points.forEach((point) => {
      const marker = L.marker([point.latitude, point.longitude], {
        icon: getCategoryIcon(point.category),
      }).addTo(map);

      // Create popup content
      const popupContent = document.createElement("div");
      popupContent.className = "p-2";
      popupContent.innerHTML = `
        <h3 class="mb-2 text-lg font-semibold">${point.name}</h3>
        <p class="mb-3 text-sm text-muted-foreground">${point.description}</p>
        <div class="mb-3 text-xs text-muted-foreground">
          <p>${point.address}</p>
          ${point.estimated_cost ? `<p class="mt-1"><strong>Estimasi:</strong> Rp ${(point.estimated_cost / 1000000000).toFixed(1)} M</p>` : ""}
        </div>
      `;

      if (onPointClick) {
        const button = document.createElement("button");
        button.className = "w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90";
        button.textContent = "Lihat Detail";
        button.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          onPointClick(point);
        });
        popupContent.appendChild(button);
      }

      marker.bindPopup(popupContent, { maxWidth: 300 });
    });

    // Fit bounds if points exist
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, onPointClick, mapReady]);

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    />
  );
}
