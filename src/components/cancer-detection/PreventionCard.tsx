import { Card, CardContent } from "@/components/ui/card";

interface PreventionCardProps {
  preventions: string[];
}

const PreventionCard = ({ preventions }: PreventionCardProps) => {
  return (
    <Card className="bg-green-50 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-900">
          Prevention
        </h3>
        <ul className="space-y-3">
          {preventions.map((prevention, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-green-600 text-sm">•</span>
              <span className="text-green-800">{prevention}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PreventionCard;
