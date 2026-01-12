import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import {
  MapPin,
  Users,
  Building2,
  ChevronRight,
  X,
  Navigation,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

// Leaflet imports
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ============================================
// TYPES
// ============================================
export interface MapLocation {
  id: string;
  name: string;
  nameAr?: string;
  city: string;
  employeeCount: number;
  coordinates: { lat: number; lng: number };
  isHeadquarters?: boolean;
  departments?: string[];
  address?: string;
}

export interface InteractiveMapProps {
  locations: MapLocation[];
  onLocationClick?: (location: MapLocation) => void;
  className?: string;
  height?: string;
  showLegend?: boolean;
  showTotalEmployees?: boolean;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

// ============================================
// CUSTOM MARKER ICONS
// ============================================
const createCustomIcon = (isHeadquarters: boolean, employeeCount: number) => {
  const bgColor = isHeadquarters ? "#10B981" : "#2E3192";
  const glowColor = isHeadquarters
    ? "rgba(16, 185, 129, 0.4)"
    : "rgba(46, 49, 146, 0.4)";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, ${bgColor}, ${isHeadquarters ? "#059669" : "#0E2841"});
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px ${glowColor}, 0 0 30px ${glowColor};
          border: 3px solid white;
          animation: ${isHeadquarters ? "pulse 2s infinite" : "none"};
        ">
          <svg 
            style="transform: rotate(45deg); width: 18px; height: 18px; color: white;" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          background: ${isHeadquarters ? "#059669" : "#6366F1"};
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        ">
          ${employeeCount}
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

// ============================================
// MAP CONTROL COMPONENT
// ============================================
interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

// ============================================
// MAIN INTERACTIVE MAP COMPONENT
// ============================================
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  onLocationClick,
  className,
  height = "400px",
  showLegend = true,
  showTotalEmployees = true,
  centerLat = 24.0,
  centerLng = 44.0,
  zoom = 5,
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";

  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null,
  );
  const mapRef = useRef<L.Map | null>(null);

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
    onLocationClick?.(location);
  };

  const flyToLocation = (location: MapLocation) => {
    if (mapRef.current) {
      mapRef.current.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        10,
        {
          duration: 1.5,
        },
      );
    }
  };

  const totalEmployees = locations.reduce(
    (sum, loc) => sum + loc.employeeCount,
    0,
  );

  // Map tile URL based on theme
  const getTileUrl = () => {
    if (isDark || isGlass) {
      return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    }
    return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  };

  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      {/* Map Container */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "border shadow-xl",
          isGlass && "border-white/20",
          !isGlass && isDark && "border-gray-700",
          !isGlass && !isDark && "border-gray-200",
        )}
        style={{ height }}
      >
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={mapRef}
          className="rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={getTileUrl()}
          />
          <ZoomControl position="bottomright" />
          <MapController center={[centerLat, centerLng]} zoom={zoom} />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.coordinates.lat, location.coordinates.lng]}
              icon={createCustomIcon(
                location.isHeadquarters || false,
                location.employeeCount,
              )}
              eventHandlers={{
                click: () => {
                  handleLocationClick(location);
                  flyToLocation(location);
                },
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        location.isHeadquarters
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                          : "bg-gradient-to-br from-[#2E3192] to-[#0E2841]",
                      )}
                    >
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {location.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {location.city}, Saudi Arabia
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <Users className="w-4 h-4 text-[#2E3192] mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-800">
                        {location.employeeCount}
                      </p>
                      <p className="text-[10px] text-gray-500">Employees</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <MapPin className="w-4 h-4 text-[#2E3192] mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-800">
                        {location.isHeadquarters ? "HQ" : "Branch"}
                      </p>
                      <p className="text-[10px] text-gray-500">Type</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLocationClick(location)}
                    className="w-full py-2 bg-gradient-to-r from-[#2E3192] to-[#0E2841] text-white text-sm rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        {showLegend && (
          <div
            className={cn(
              "absolute bottom-16 left-4 z-[1000] rounded-xl p-3 border",
              isGlass && "bg-black/40 backdrop-blur-xl border-white/20",
              !isGlass &&
                isDark &&
                "bg-gray-800/90 backdrop-blur-md border-gray-700",
              !isGlass &&
                !isDark &&
                "bg-white/90 backdrop-blur-md border-gray-200 shadow-lg",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-4 text-xs",
                isGlass || isDark ? "text-white" : "text-gray-700",
              )}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                <span>Headquarters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2E3192] shadow-lg shadow-[#2E3192]/30" />
                <span>Branch Office</span>
              </div>
            </div>
          </div>
        )}

        {/* Total Employees Card */}
        {showTotalEmployees && (
          <div
            className={cn(
              "absolute top-4 right-4 z-[1000] rounded-xl p-4 border",
              isGlass && "bg-black/40 backdrop-blur-xl border-white/20",
              !isGlass &&
                isDark &&
                "bg-gray-800/90 backdrop-blur-md border-gray-700",
              !isGlass &&
                !isDark &&
                "bg-white/90 backdrop-blur-md border-gray-200 shadow-lg",
            )}
          >
            <div className="text-center">
              <p
                className={cn(
                  "text-xs uppercase tracking-wide mb-1",
                  isGlass
                    ? "text-cyan-300"
                    : isDark
                      ? "text-cyan-400"
                      : "text-[#2E3192]",
                )}
              >
                Total Employees
              </p>
              <p
                className={cn(
                  "text-3xl font-bold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                {totalEmployees}
              </p>
              <p
                className={cn(
                  "text-xs mt-1",
                  isGlass || isDark ? "text-white/60" : "text-gray-500",
                )}
              >
                {locations.length} Locations
              </p>
            </div>
          </div>
        )}

        {/* Navigation Hint */}
        <div
          className={cn(
            "absolute top-4 left-4 z-[1000] rounded-xl px-3 py-2 border",
            "flex items-center gap-2 text-xs",
            isGlass &&
              "bg-black/40 backdrop-blur-xl border-white/20 text-white/70",
            !isGlass &&
              isDark &&
              "bg-gray-800/90 backdrop-blur-md border-gray-700 text-gray-400",
            !isGlass &&
              !isDark &&
              "bg-white/90 backdrop-blur-md border-gray-200 text-gray-500 shadow-lg",
          )}
        >
          <Navigation className="w-3 h-3" />
          <span>Click markers for details</span>
        </div>
      </div>

      {/* Selected Location Detail Panel */}
      {selectedLocation && (
        <div
          className={cn(
            "mt-4 rounded-2xl p-6 shadow-lg border animate-in fade-in slide-in-from-bottom-4 duration-300",
            isGlass && "bg-white/10 backdrop-blur-xl border-white/20",
            !isGlass && isDark && "bg-gray-800 border-gray-700",
            !isGlass && !isDark && "bg-white border-gray-100",
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  selectedLocation.isHeadquarters
                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                    : "bg-gradient-to-br from-[#2E3192] to-[#0E2841]",
                )}
              >
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3
                  className={cn(
                    "text-xl font-bold",
                    isGlass || isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  {selectedLocation.name}
                </h3>
                <p
                  className={cn(
                    isGlass || isDark ? "text-white/60" : "text-gray-500",
                  )}
                >
                  {selectedLocation.city}, Saudi Arabia
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isGlass && "hover:bg-white/10 text-white/60",
                !isGlass && isDark && "hover:bg-gray-700 text-gray-400",
                !isGlass && !isDark && "hover:bg-gray-100 text-gray-400",
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div
              className={cn(
                "rounded-xl p-4 text-center",
                isGlass && "bg-white/10",
                !isGlass && isDark && "bg-gray-700/50",
                !isGlass && !isDark && "bg-gray-50",
              )}
            >
              <Users
                className={cn(
                  "w-6 h-6 mx-auto mb-2",
                  isGlass
                    ? "text-cyan-300"
                    : isDark
                      ? "text-cyan-400"
                      : "text-[#2E3192]",
                )}
              />
              <p
                className={cn(
                  "text-2xl font-bold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                {selectedLocation.employeeCount}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isGlass || isDark ? "text-white/60" : "text-gray-500",
                )}
              >
                Employees
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl p-4 text-center",
                isGlass && "bg-white/10",
                !isGlass && isDark && "bg-gray-700/50",
                !isGlass && !isDark && "bg-gray-50",
              )}
            >
              <Building2
                className={cn(
                  "w-6 h-6 mx-auto mb-2",
                  isGlass
                    ? "text-cyan-300"
                    : isDark
                      ? "text-cyan-400"
                      : "text-[#2E3192]",
                )}
              />
              <p
                className={cn(
                  "text-2xl font-bold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                {selectedLocation.departments?.length || 5}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isGlass || isDark ? "text-white/60" : "text-gray-500",
                )}
              >
                Departments
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl p-4 text-center",
                isGlass && "bg-white/10",
                !isGlass && isDark && "bg-gray-700/50",
                !isGlass && !isDark && "bg-gray-50",
              )}
            >
              <MapPin
                className={cn(
                  "w-6 h-6 mx-auto mb-2",
                  isGlass
                    ? "text-cyan-300"
                    : isDark
                      ? "text-cyan-400"
                      : "text-[#2E3192]",
                )}
              />
              <p
                className={cn(
                  "text-lg font-bold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                {selectedLocation.isHeadquarters ? "HQ" : "Branch"}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isGlass || isDark ? "text-white/60" : "text-gray-500",
                )}
              >
                Type
              </p>
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-gradient-to-r from-[#2E3192] to-[#0E2841] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
            View Location Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Custom CSS for Leaflet */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4), 0 0 30px rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 4px 25px rgba(16, 185, 129, 0.6), 0 0 50px rgba(16, 185, 129, 0.5);
          }
        }
        
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 0 !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        
        .leaflet-popup-tip {
          background: white !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }
        
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          color: #374151 !important;
          font-size: 18px !important;
          border: none !important;
        }
        
        .leaflet-control-zoom a:hover {
          background-color: #f3f4f6 !important;
        }
        
        .dark .leaflet-control-zoom a,
        .glass .leaflet-control-zoom a {
          background-color: rgba(31, 41, 55, 0.9) !important;
          color: white !important;
        }
        
        .dark .leaflet-control-zoom a:hover,
        .glass .leaflet-control-zoom a:hover {
          background-color: rgba(55, 65, 81, 0.9) !important;
        }
      `}</style>
    </div>
  );
};

// ============================================
// LOCATION LIST COMPONENT
// ============================================
export interface LocationListProps {
  locations: MapLocation[];
  onLocationSelect?: (location: MapLocation) => void;
  className?: string;
}

export const LocationList: React.FC<LocationListProps> = ({
  locations,
  onLocationSelect,
  className,
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";

  return (
    <div className={cn("space-y-3", className)}>
      {locations.map((location) => (
        <div
          key={location.id}
          className={cn(
            "rounded-xl p-4 cursor-pointer",
            "border transition-all duration-300",
            "hover:-translate-y-0.5",
            isGlass && [
              "bg-white/10 backdrop-blur-xl border-white/20",
              "hover:bg-white/20 hover:border-white/30",
            ],
            !isGlass &&
              isDark && [
                "bg-gray-800 border-gray-700",
                "hover:bg-gray-700 hover:border-gray-600",
              ],
            !isGlass &&
              !isDark && [
                "bg-white border-gray-100",
                "shadow-sm hover:shadow-md hover:border-[#80D1E9]/30",
              ],
          )}
          onClick={() => onLocationSelect?.(location)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  location.isHeadquarters
                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                    : isGlass
                      ? "bg-white/20"
                      : isDark
                        ? "bg-[#2E3192]/30"
                        : "bg-gradient-to-br from-[#2E3192]/10 to-[#0E2841]/10",
                )}
              >
                <MapPin
                  className={cn(
                    "w-5 h-5",
                    location.isHeadquarters
                      ? "text-white"
                      : isGlass || isDark
                        ? "text-white"
                        : "text-[#2E3192]",
                  )}
                />
              </div>
              <div>
                <p
                  className={cn(
                    "font-semibold",
                    isGlass || isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  {location.name}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isGlass || isDark ? "text-white/60" : "text-gray-500",
                  )}
                >
                  {location.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className={cn(
                    "text-lg font-bold",
                    isGlass
                      ? "text-cyan-300"
                      : isDark
                        ? "text-cyan-400"
                        : "text-[#2E3192]",
                  )}
                >
                  {location.employeeCount}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    isGlass || isDark ? "text-white/40" : "text-gray-400",
                  )}
                >
                  employees
                </p>
              </div>
              <ChevronRight
                className={cn(
                  "w-5 h-5",
                  isGlass || isDark ? "text-white/30" : "text-gray-300",
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// DEFAULT NESMA LOCATIONS
// ============================================
export const NESMA_LOCATIONS: MapLocation[] = [
  {
    id: "loc-1",
    name: "Head Office",
    nameAr: "المكتب الرئيسي",
    city: "Riyadh",
    employeeCount: 30,
    coordinates: { lat: 24.7136, lng: 46.6753 },
    isHeadquarters: true,
    departments: ["HR", "Finance", "IT", "Operations", "Management"],
    address: "King Fahd Road, Riyadh",
  },
  {
    id: "loc-2",
    name: "NEOM Site",
    nameAr: "موقع نيوم",
    city: "Tabuk",
    employeeCount: 20,
    coordinates: { lat: 28.0, lng: 35.0 },
    isHeadquarters: false,
    departments: ["Construction", "Engineering", "Safety"],
    address: "NEOM Bay, Tabuk Region",
  },
  {
    id: "loc-3",
    name: "Red Sea Project",
    nameAr: "مشروع البحر الأحمر",
    city: "Umluj",
    employeeCount: 15,
    coordinates: { lat: 25.05, lng: 37.27 },
    isHeadquarters: false,
    departments: ["Construction", "Hospitality", "Environment"],
    address: "Red Sea Coast, Umluj",
  },
  {
    id: "loc-4",
    name: "Jeddah Branch",
    nameAr: "فرع جدة",
    city: "Jeddah",
    employeeCount: 10,
    coordinates: { lat: 21.4858, lng: 39.1925 },
    isHeadquarters: false,
    departments: ["Sales", "Support", "Logistics"],
    address: "Tahlia Street, Jeddah",
  },
  {
    id: "loc-5",
    name: "Dammam Office",
    nameAr: "مكتب الدمام",
    city: "Dammam",
    employeeCount: 5,
    coordinates: { lat: 26.4207, lng: 50.0888 },
    isHeadquarters: false,
    departments: ["Sales", "Support"],
    address: "King Saud Street, Dammam",
  },
];

export default InteractiveMap;
