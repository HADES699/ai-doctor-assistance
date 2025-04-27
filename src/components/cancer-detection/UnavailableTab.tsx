import { Card, CardContent } from "@/components/ui/card";

interface UnavailableTabProps {
  title: string;
  description: string;
}

const UnavailableTab = ({ title, description }: UnavailableTabProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default UnavailableTab;
