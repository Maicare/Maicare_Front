import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar,  } from 'lucide-react';
import Image from 'next/image';

type Props = {
  fullName: string;
  relation: string;
  image: string;
  start_date: string;
}

const InvolvedEmployeeItem = ({ fullName, relation, image, start_date }: Props) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={image}
              alt={fullName}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm text-gray-900 truncate">
                {fullName}
              </h4>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
                {relation}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Since {new Date(start_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvolvedEmployeeItem;