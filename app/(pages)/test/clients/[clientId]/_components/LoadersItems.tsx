// ContactPreviewLoader.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ContactPreviewLoader = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </CardContent>
  </Card>
);



const ContractPreviewSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </CardContent>
  </Card>
);


const ReportsPreviewSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </CardContent>
  </Card>
);


const MedicalDossierPreviewSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </CardContent>
  </Card>
);



const DocumentPreviewSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </CardContent>
  </Card>
);


const StatusHistoryLoader = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </CardContent>
  </Card>
);

export const AddressesLoaderSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-6 w-40" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </CardContent>
  </Card>
);

export {
  ContractPreviewSkeleton,
  ReportsPreviewSkeleton,
  MedicalDossierPreviewSkeleton,
  DocumentPreviewSkeleton,
  StatusHistoryLoader
};