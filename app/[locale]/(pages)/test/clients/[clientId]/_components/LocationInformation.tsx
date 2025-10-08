import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Navigation, Building } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  Zipcode: string;
  departement: string;
  city: string;
  street_number: string;
  streetname: string;
  location: string;
  isParentLoading: boolean;
}

const LocationInformation = ({
  Zipcode,
  departement,
  city,
  street_number,
  streetname,
  location,
  isParentLoading
}: Props) => {
  const t = useI18n();

  if (isParentLoading) {
    return <LocationInformationSkeleton />;
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Navigation className="w-4 h-4 text-orange-600" />
          </div>
          <CardTitle className="text-lg">{"Location Info"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {streetname} {street_number}
              </p>
              <p className="text-xs text-gray-500">Address</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Building className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{city}</p>
              <p className="text-xs text-gray-500">City</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Postal Code</p>
              <p className="text-sm font-medium text-gray-900">{Zipcode}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Department</p>
              <p className="text-sm font-medium text-gray-900">{departement}</p>
            </div>
          </div>
          
          {location && (
            <div>
              <p className="text-xs font-medium text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900">{location}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const LocationInformationSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default LocationInformation;