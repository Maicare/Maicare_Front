"use client";
import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Globe,
  Users,
  Edit,
  Plus,
  Trash2,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Hash
} from "lucide-react";
import { Organization } from "@/types/organisation";
import CreateLocationSheet from "../../locations/_components/CreateLocationSheet";
import { CreateLocation } from "@/schemas/location.schema";
import { useLocation } from "@/hooks/location/use-location";
import { useParams, useRouter } from "next/navigation";
import { useOrganisation } from "@/hooks/organisation/use-organisation";
import CreateOrganisationSheet from "../_components/create-organisation-sheet";
import { CreateOrganisation } from "@/schemas/organisation.schema";

interface Location {
  id: number;
  name: string;
  address: string;
  capacity: number;
}


export default function OrganizationDetailsPage() {
  const { organisationId } = useParams();
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const { createOneForOrganisation, readAllForOrganisation } = useLocation({ autoFetch: false });
  const { readOne: readOrganization, updateOne } = useOrganisation({ autoFetch: false });
  const handleOpen = (bool: boolean) => {
    setOpen(bool);
  }
  const handleOpenOrg = (bool: boolean) => {
    setOrgOpen(bool);
  }

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (organisationId) {
          const orgRes = await readOrganization(parseInt(organisationId as string, 10), { displayProgress: true });
          setOrganization(orgRes);
        }
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    };

    fetchOrganization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisationId, orgOpen]);

  // Mock data for demonstration
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Simulate API call
        const locationsRes = await readAllForOrganisation(organisationId as string);
        setLocations(locationsRes);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [organisationId, open, readAllForOrganisation]);

  const handleCreate = async (values: CreateLocation) => {
    try {
      await createOneForOrganisation(
        values, organisationId as string, {
        displayProgress: true,
        displaySuccess: true
      }
      );
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }
  // const handleCreateOrg = async (values: CreateOrganisation) => {
  //   try {
  //     await createOne(
  //       values, {
  //       displayProgress: true,
  //       displaySuccess: true
  //     }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const handleUpdate = async (values: CreateOrganisation) => {
    try {
      await updateOne(
        values,
        organisationId!.toString(),
        {
          displayProgress: true,
          displaySuccess: true
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-6">
          <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </button>
        </div>

        {/* Organization Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Building2 className="h-12 w-12 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{organization.name}</h1>
                <div className="flex gap-2">
                  <CreateOrganisationSheet
                    mode={"update"}
                    handleCreate={() => { }}
                    handleUpdate={handleUpdate}
                    handleOpen={handleOpenOrg}
                    organisation={organization}
                    isOpen={orgOpen}
                  />
                  <button className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded-lg font-medium transition-colors">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </div>
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  Member since Jan 2023
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                A leading organization in the business sector with multiple locations and a strong customer base.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Organization Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Organization Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Information
                    </h3>
                    <p className="text-gray-800">{organization.email}</p>
                    <p className="text-gray-800 mt-1">+1 (555) 123-4567</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </h3>
                    <a href="#" className="text-blue-600 hover:underline">www.{organization.name.toLowerCase().replace(/\s/g, '')}.com</a>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Primary Address
                    </h3>
                    <p className="text-gray-800">{organization.address}</p>
                    <p className="text-gray-800">{organization.postal_code}, {organization.city}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Business Numbers
                    </h3>
                    <p className="text-gray-800">KVK: {organization.kvk_number}</p>
                    <p className="text-gray-800 mt-1">BTW: {organization.btw_number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{locations.length}</p>
                    <p className="text-sm text-gray-600">Locations</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">245</p>
                    <p className="text-sm text-gray-600">Employees</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">4.8</p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Recent Activity</h2>

            <div className="space-y-4">
              {[
                { action: "Location added", date: "2 hours ago", location: "Warehouse" },
                { action: "Details updated", date: "1 day ago", location: "Main Office" },
                { action: "New employee assigned", date: "2 days ago", location: "Retail Store" },
              ].map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.location} • {activity.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
              View all activity
            </button>
          </div>
        </div>

        {/* Locations Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-2 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Locations</h2>
            <CreateLocationSheet
              mode={"create"}
              handleCreate={handleCreate}
              handleUpdate={() => { }}
              handleOpen={handleOpen}
              location={undefined}
              isOpen={open}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No locations yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first location.</p>
              <button className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg font-medium transition-colors" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Location
              </button>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locations.map((location) => (
                <div key={location.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs font-medium">
                      <Users className="h-3 w-3" />
                      Capacity: {location.capacity}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>5 employees</span>
                      <span>•</span>
                      <span>Active</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => { router.push(`/locations/${location.id}/overview`) }}>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}