import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CancerDetectionTab from "./CancerDetectionTab";
import UnavailableTab from "./UnavailableTab";

interface CancerType {
  type: string;
  title: string;
  description: string;
  uploadInstructions: string;
  riskFactors: string[];
  preventions: string[];
}

interface CancerTypeTabsProps {
  cancerTypes: CancerType[];
  modelUrl: string;
}

const CancerTypeTabs = ({ cancerTypes, modelUrl }: CancerTypeTabsProps) => {
  const [selectedTab, setSelectedTab] = useState(cancerTypes[0].type);

  return (
    <Tabs
      defaultValue={cancerTypes[0].type}
      className="w-full"
      onValueChange={setSelectedTab}
    >
      <TabsList className="grid w-full grid-cols-3 mb-6 rounded-xl bg-gray-100 p-1">
        {cancerTypes.map((cancer) => (
          <TabsTrigger
            key={cancer.type}
            value={cancer.type}
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            {cancer.title.replace(" Detection", "")}
          </TabsTrigger>
        ))}
      </TabsList>

      {cancerTypes.map((cancer) => (
        <TabsContent key={cancer.type} value={cancer.type}>
          <CancerDetectionTab
            type={cancer.type}
            title={cancer.title}
            description={cancer.description}
            uploadInstructions={cancer.uploadInstructions}
            riskFactors={cancer.riskFactors}
            preventions={cancer.preventions}
            modelUrl={modelUrl}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CancerTypeTabs;
