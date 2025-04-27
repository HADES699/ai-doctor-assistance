import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "./ImageUpload";
import AnalysisResults from "./AnalysisResults";
import RiskFactorsCard from "./RiskFactorsCard";
import PreventionCard from "./PreventionCard";
import { useEffect, useState } from "react";

interface CancerDetectionTabProps {
  type: string;
  title: string;
  description: string;
  uploadInstructions: string;
  riskFactors: string[];
  preventions: string[];
  modelUrl: string;
}

const CancerDetectionTab = ({
  type,
  title,
  description,
  uploadInstructions,
  riskFactors,
  preventions,
  modelUrl,
}: CancerDetectionTabProps) => {
  const [error, setError] = useState();
  return (
    <div className="py-3">
      <h2 className="text-2xl font-bold mb-3 tracking-tight">{title}</h2>
      <p className="text-gray-600 mb-8 text-base">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <ImageUpload
              type={type}
              uploadInstructions={uploadInstructions}
              modelUrl={modelUrl}
              setError={setError}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <AnalysisResults type={type} error={error} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <RiskFactorsCard riskFactors={riskFactors} />
        <PreventionCard preventions={preventions} />
      </div>
    </div>
  );
};

export default CancerDetectionTab;
