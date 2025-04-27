import { Card, CardContent } from "@/components/ui/card";

interface RiskFactorsCardProps {
  riskFactors: string[];
}

const RiskFactorsCard = ({ riskFactors }: RiskFactorsCardProps) => {
  return (
    <Card className="bg-blue-50 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">
          Risk Factors
        </h3>
        <ul className="space-y-3">
          {riskFactors.map((factor, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-blue-600 text-sm">•</span>
              <span className="text-blue-800">{factor}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RiskFactorsCard;
