
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AanmeldingenTab } from "@/components/zorgcoordinatie/AanmeldingenTab";
import { IntakeTab } from "@/components/zorgcoordinatie/IntakeTab";
import { WachtlijstTab } from "@/components/zorgcoordinatie/WachtlijstTab";
import { InZorgTab } from "@/components/zorgcoordinatie/InZorgTab";
import { DoorstroomTab } from "@/components/zorgcoordinatie/DoorstroomTab";
import { UitstroomTab } from "@/components/zorgcoordinatie/UitstroomTab";
import { IncidentenTab } from "@/components/zorgcoordinatie/IncidentenTab";
import { HerinneringenTab } from "@/components/zorgcoordinatie/HerinneringenTab";
import { RapportagesTab } from "@/components/zorgcoordinatie/RapportagesTab";
import { VerbeterlogTab } from "@/components/zorgcoordinatie/VerbeterlogTab";
import { BeddenCapaciteitTab } from "@/components/zorgcoordinatie/BeddenCapaciteitTab";
import { HoofdaanbiedersTab } from "@/components/zorgcoordinatie/HoofdaanbiedersTab";

export default function Zorgcoordinatie() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Zorgcoördinatie</h1>
        <p className="text-muted-foreground mt-1">
          Beheer het volledige cliënttraject van aanmelding tot uitstroom
        </p>
      </div>

      <Tabs defaultValue="aanmeldingen" className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <TabsList className="h-auto p-0 bg-transparent w-full flex flex-wrap gap-1 overflow-x-auto scrollbar-hide">
            <TabsTrigger 
              value="aanmeldingen"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Aanmeldingen
            </TabsTrigger>
            <TabsTrigger 
              value="bedden"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Capaciteit
            </TabsTrigger>
            <TabsTrigger 
              value="intake"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Intake
            </TabsTrigger>
            <TabsTrigger 
              value="wachtlijst"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Wachtlijst
            </TabsTrigger>
            <TabsTrigger 
              value="inzorg"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              In Zorg
            </TabsTrigger>
            <TabsTrigger 
              value="doorstroom"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Doorstroom
            </TabsTrigger>
            <TabsTrigger 
              value="uitstroom"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Uitstroom
            </TabsTrigger>
            <TabsTrigger 
              value="incidenten"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Incidenten
            </TabsTrigger>
            <TabsTrigger 
              value="verbeterlog"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Verbeterlog
            </TabsTrigger>
            <TabsTrigger 
              value="herinneringen"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Herinneringen
            </TabsTrigger>
            <TabsTrigger 
              value="hoofdaanbieders"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Hoofdaanbieders
            </TabsTrigger>
            <TabsTrigger 
              value="rapportages"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-300 data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300 dark:data-[state=active]:border-indigo-600 dark:hover:bg-indigo-900/50"
            >
              Rapportages
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="aanmeldingen">
          <AanmeldingenTab />
        </TabsContent>

        <TabsContent value="bedden">
          <BeddenCapaciteitTab />
        </TabsContent>

        <TabsContent value="intake">
          <IntakeTab />
        </TabsContent>

        <TabsContent value="wachtlijst">
          <WachtlijstTab />
        </TabsContent>

        <TabsContent value="inzorg">
          <InZorgTab />
        </TabsContent>

        <TabsContent value="doorstroom">
          <DoorstroomTab />
        </TabsContent>

        <TabsContent value="uitstroom">
          <UitstroomTab />
        </TabsContent>

        <TabsContent value="incidenten">
          <IncidentenTab />
        </TabsContent>

        <TabsContent value="verbeterlog">
          <VerbeterlogTab />
        </TabsContent>

        <TabsContent value="herinneringen">
          <HerinneringenTab />
        </TabsContent>

        <TabsContent value="hoofdaanbieders">
          <HoofdaanbiedersTab />
        </TabsContent>

        <TabsContent value="rapportages">
          <RapportagesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
