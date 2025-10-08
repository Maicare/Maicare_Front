import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Euro, Calendar } from 'lucide-react';

type Props = {
  occupation: string;
  price: string;
  date: string;
}

const ContractItem = ({ occupation, price, date }: Props) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {occupation}
          </h4>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            €{price}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>Started {date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractItem;