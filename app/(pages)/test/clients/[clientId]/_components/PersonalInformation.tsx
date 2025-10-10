import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Phone, MapPin } from 'lucide-react';

type Props = {
  first_name: string;
  last_name: string;
  email: string;
  birthplace: string;
  private_phone_number: string;
  isParentLoading: boolean;
}

const PersonalInformation = ({
  email,
  birthplace,
  private_phone_number,
  isParentLoading
}: Props) => {

  if (isParentLoading) {
    return <PersonalInformationSkeleton />;
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
          <CardTitle className="text-lg">{"Personal Info"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{email}</p>
              <p className="text-xs text-gray-500">Email</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{private_phone_number}</p>
              <p className="text-xs text-gray-500">Phone Number</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{birthplace}</p>
              <p className="text-xs text-gray-500">Birthplace</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PersonalInformationSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

export default PersonalInformation;