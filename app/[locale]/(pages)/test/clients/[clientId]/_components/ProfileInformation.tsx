import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, VenusAndMars } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  profile_picture: string;
  status: string;
  isParentLoading: boolean;
}

const ProfileInformation = ({
  first_name,
  last_name,
  date_of_birth,
  gender,
  profile_picture,
  status,
  isParentLoading
}: Props) => {
  const t = useI18n();

  if (isParentLoading) {
    return <ProfileInformationSkeleton />;
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{"Profile Info"}</CardTitle>
          </div>
          <Badge variant="outline" className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            {first_name?.[0]}{last_name?.[0]}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {first_name} {last_name}
            </h3>
            <p className="text-sm text-gray-500">Client</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Date of Birth:</span>
            <span className="font-medium text-gray-900">{date_of_birth}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <VenusAndMars className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Gender:</span>
            <span className="font-medium text-gray-900">{gender}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProfileInformationSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
  </Card>
);

export default ProfileInformation;