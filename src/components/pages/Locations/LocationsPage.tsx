import React, { useState, useMemo } from "react";
import {
  MapPin,
  Plus,
  Download,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Building2,
  Globe,
  Phone,
  Mail,
  Clock,
  Navigation,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Modal } from "../../common/Modal";
import { locations, employees } from "../../../data";
import { cn } from "../../../utils/cn";

export const LocationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof locations)[0] | null
  >(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = locations.length;
    const totalEmployees = locations.reduce(
      (acc, l) => acc + l.employeeCount,
      0,
    );
    const headquarters = locations.find((l) => l.isHeadquarters);
    const cities = new Set(locations.map((l) => l.city)).size;
    return { total, totalEmployees, headquarters: headquarters?.name, cities };
  }, []);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      return (
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const columns = [
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (location: (typeof locations)[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">{location.name}</p>
              {location.isHeadquarters && (
                <Badge className="bg-primary-light text-primary text-xs">
                  HQ
                </Badge>
              )}
            </div>
            {location.nameAr && (
              <p className="text-xs text-gray-500">{location.nameAr}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (location: (typeof locations)[0]) => (
        <div>
          <p className="text-sm text-gray-800">{location.address}</p>
          <p className="text-xs text-gray-500">
            {location.city}, {location.country}
          </p>
        </div>
      ),
    },
    {
      key: "employees",
      label: "Employees",
      sortable: true,
      render: (location: (typeof locations)[0]) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {location.employeeCount}
          </span>
        </div>
      ),
    },
    {
      key: "timezone",
      label: "Timezone",
      render: (location: (typeof locations)[0]) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{location.timezone}</span>
        </div>
      ),
    },
    {
      key: "radius",
      label: "Geo-fence",
      render: (location: (typeof locations)[0]) => (
        <span className="text-sm text-gray-600">{location.radius}m radius</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (location: (typeof locations)[0]) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedLocation(location);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => {
              setSelectedLocation(location);
              setShowLocationModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-error-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-500 mt-1">
            Manage company branches and locations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => {
              setSelectedLocation(null);
              setShowLocationModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Locations"
          value={stats.total}
          icon={<MapPin className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="Headquarters"
          value={stats.headquarters || "Not Set"}
          icon={<Building2 className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Cities"
          value={stats.cities}
          icon={<Globe className="w-6 h-6" />}
          color="warning"
        />
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((location) => {
          const locationEmployees = employees.filter(
            (e) => e.locationId === location.id,
          );
          return (
            <Card
              key={location.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedLocation(location);
                setShowDetailModal(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">
                        {location.name}
                      </h3>
                      {location.isHeadquarters && (
                        <Badge className="bg-primary-light text-primary text-xs">
                          HQ
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{location.city}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
                {location.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {location.contactPhone}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {location.employeeCount} employees
                  </span>
                </div>
                <Badge className="bg-gray-100 text-gray-600">
                  {location.radius}m radius
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Locations Table */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <Table data={filteredLocations} columns={columns} searchable={false} />
      </Card>

      {/* Add/Edit Location Modal */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title={selectedLocation ? "Edit Location" : "Add Location"}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location Name (English)"
              placeholder="e.g., Riyadh Office"
              defaultValue={selectedLocation?.name}
            />
            <Input
              label="Location Name (Arabic)"
              placeholder="e.g., مكتب الرياض"
              defaultValue={selectedLocation?.nameAr}
            />
          </div>
          <Input
            label="Address"
            placeholder="Full address"
            defaultValue={selectedLocation?.address}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="City"
              defaultValue={selectedLocation?.city}
            />
            <Input
              label="Country"
              placeholder="Country"
              defaultValue={selectedLocation?.country}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              placeholder="e.g., 24.7136"
              defaultValue={selectedLocation?.latitude?.toString()}
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              placeholder="e.g., 46.6753"
              defaultValue={selectedLocation?.longitude?.toString()}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Geo-fence Radius (meters)"
              type="number"
              placeholder="e.g., 100"
              defaultValue={selectedLocation?.radius?.toString()}
            />
            <Select
              label="Timezone"
              options={[
                { value: "Asia/Riyadh", label: "(GMT+03:00) Riyadh" },
                { value: "Asia/Dubai", label: "(GMT+04:00) Dubai" },
                { value: "Asia/Jeddah", label: "(GMT+03:00) Jeddah" },
              ]}
              defaultValue={selectedLocation?.timezone || "Asia/Riyadh"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              placeholder="Phone number"
              defaultValue={selectedLocation?.contactPhone}
            />
            <Input
              label="Contact Email"
              type="email"
              placeholder="Email"
              defaultValue={selectedLocation?.contactEmail}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="headquarters"
              className="w-4 h-4 text-primary rounded"
              defaultChecked={selectedLocation?.isHeadquarters}
            />
            <label htmlFor="headquarters" className="text-sm text-gray-700">
              Set as Headquarters
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowLocationModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowLocationModal(false)}>
              {selectedLocation ? "Update Location" : "Add Location"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Location Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Location Details"
        size="md"
      >
        {selectedLocation && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary-light flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedLocation.name}
                  </h3>
                  {selectedLocation.isHeadquarters && (
                    <Badge className="bg-primary-light text-primary">
                      Headquarters
                    </Badge>
                  )}
                </div>
                {selectedLocation.nameAr && (
                  <p className="text-gray-500">{selectedLocation.nameAr}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">
                  {selectedLocation.address}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">City & Country</p>
                <p className="font-medium text-gray-800">
                  {selectedLocation.city}, {selectedLocation.country}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Timezone</p>
                <p className="font-medium text-gray-800">
                  {selectedLocation.timezone}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Geo-fence Radius</p>
                <p className="font-medium text-gray-800">
                  {selectedLocation.radius} meters
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Employees</p>
                <p className="font-medium text-gray-800">
                  {selectedLocation.employeeCount}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Coordinates</p>
                <p className="font-medium text-gray-800">
                  {selectedLocation.latitude?.toFixed(4)},{" "}
                  {selectedLocation.longitude?.toFixed(4)}
                </p>
              </div>
            </div>

            {(selectedLocation.contactPhone ||
              selectedLocation.contactEmail) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Contact</p>
                <div className="space-y-1">
                  {selectedLocation.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">
                        {selectedLocation.contactPhone}
                      </span>
                    </div>
                  )}
                  {selectedLocation.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">
                        {selectedLocation.contactEmail}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowLocationModal(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Location
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LocationsPage;
