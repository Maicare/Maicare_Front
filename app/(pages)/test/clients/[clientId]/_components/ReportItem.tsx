import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar,  } from 'lucide-react';
import Image from 'next/image';

type Props = {
  image: string;
  date: string;
  report: string;
  state: string;
  type: string;
}

const ReportItem = ({ image, date, report, state, type }: Props) => {
  const getStateColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Image
            src={image}
            alt="Reporter"
            width={32}
            height={32}
            className="rounded-full mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {type}
              </Badge>
              <Badge variant="secondary" className={getStateColor(state)}>
                {state}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
              {report}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportItem;