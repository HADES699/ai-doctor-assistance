import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useResults } from "@/context/ResultsContext";
import { useEffect } from "react";

interface AnalysisResultsProps {
  type: string;
  error: string;
}

const AnalysisResults = ({ type, error }: AnalysisResultsProps) => {
  const { results, setResults } = useResults();

  useEffect(() => {
    setResults(null);
  }, [type]);

  if (!results) {
    return !error ? (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <AlertCircle className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-gray-500">
          Upload and analyze a photo to see your assessment results
        </p>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-red-100 p-6 mb-4">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const isCancer = results.class_label !== "Normal";
  const confidencePercentage = (results.confidence * 100).toFixed(2);
  const { level: riskLevel, color: riskColor } = getRiskLevel(
    results.class_label,
    results.confidence
  );
  const resultMessage = isCancer
    ? `The analysis indicates a potential presence of ${results.class_label} with a confidence of ${confidencePercentage}%.`
    : `No concerning indicators detected (Normal) with a confidence of ${confidencePercentage}%.`;
  const recommendation = isCancer
    ? "Please consult a healthcare provider immediately for a professional evaluation."
    : "Regular medical check-ups are recommended to monitor your health.";
  const riskExplanation =
    riskLevel === "High"
      ? "This indicates a strong likelihood of concern, requiring urgent medical attention."
      : riskLevel === "Moderate"
      ? "This suggests some uncertainty; further evaluation is advised."
      : "This suggests a low likelihood of concern, but regular monitoring is still recommended.";

  return (
    <div className="mb-6">
      <div
        className={`p-4 border rounded-lg ${
          isCancer
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-green-50 border-green-200 text-green-800"
        }`}
      >
        <p className="font-semibold">{resultMessage}</p>
        <div className={`mt-2 p-2 rounded-md ${riskColor}`}>
          <p className="font-medium">Risk Level: {riskLevel}</p>
          <p className="text-sm">{riskExplanation}</p>
        </div>
        <p className="mt-2">{recommendation}</p>
      </div>
      <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
        Get Professional Consultation
      </Button>
    </div>
  );
};

const getRiskLevel = (class_label: string, confidence: number) => {
  if (class_label === "Normal") {
    return confidence >= 0.7
      ? { level: "Low", color: "bg-green-100 text-green-800 border-green-200" }
      : {
          level: "Moderate",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
  } else {
    if (confidence >= 0.8) {
      return { level: "High", color: "bg-red-100 text-red-800 border-red-200" };
    } else if (confidence >= 0.5) {
      return {
        level: "Moderate",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    } else {
      return {
        level: "Low",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    }
  }
};

export default AnalysisResults;
