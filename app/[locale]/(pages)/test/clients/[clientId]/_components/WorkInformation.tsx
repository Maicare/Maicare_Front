import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Building, FileDigit, Shield } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  source: string;
  organisation: string;
  filenumber: string;
  bsn: string;
  legal_measure: string;
  infix: string;
  isParentLoading: boolean;
}

const WorkInformation = ({
  source,
  organisation,
  filenumber,
  bsn,
  legal_measure,
  infix,
  isParentLoading
}: Props) => {
  const t = useI18n();

  if (isParentLoading) {
    return <WorkInformationSkeleton />;
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-green-600" />
          </div>
          <CardTitle className="text-lg">{"Work Info"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Source</p>
            <p className="text-sm font-medium text-gray-900">{source}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Organization</p>
            <p className="text-sm font-medium text-gray-900">{organisation}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">File Number</p>
            <p className="text-sm font-medium text-gray-900">{filenumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">BSN</p>
            <p className="text-sm font-medium text-gray-900">{bsn}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-xs font-medium text-gray-500">Legal Measure</p>
            <p className="text-sm font-medium text-gray-900">{legal_measure}</p>
          </div>
          {infix && (
            <div className="space-y-1 col-span-2">
              <p className="text-xs font-medium text-gray-500">Infix</p>
              <p className="text-sm font-medium text-gray-900">{infix}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const WorkInformationSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg col-span-2" />
      </div>
    </CardContent>
  </Card>
);

export default WorkInformation;