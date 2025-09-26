'use client';
import { User, Brain, Calendar, Target, CheckCircle, AlertTriangle, Users, ArrowRight, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import OverviewTab from './components/overview-tab';
import ObjectivesTab from './components/objectives-tab';
import InterventionsTab from './components/interventions-tab';
import MetricsTab from './components/metrics-tab';
import RisksTab from './components/risks-tab';
import SupportNetworkTab from './components/support-network-tab';
import ResourcesTab from './components/resources-tab';
import { CarePlanOverview } from '@/types/care-plan.types';
import ReportsTab from './components/reports-tab';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';
const mockClient = {
    id: 1,
    firstName: "Emma",
    lastName: "van Berg",
    age: 16,
    livingSituation: "Foster care placement",
    educationLevel: "VMBO level"
};

const levelColors = {
    1: "bg-red-100 text-red-800 border-red-200",
    2: "bg-orange-100 text-orange-800 border-orange-200",
    3: "bg-yellow-100 text-yellow-800 border-yellow-200",
    4: "bg-blue-100 text-blue-800 border-blue-200",
    5: "bg-green-100 text-green-800 border-green-200"
};

const GoalPage = () => {
    const { carePlanId } = useParams();
    const { isLoading, data } = useCarePlan({
        carePlanId: carePlanId as string,
        overview: true,
    });
    const getLevelColor = (level: keyof typeof levelColors) => {
        return levelColors[level] || "bg-gray-100 text-gray-800 border-gray-200";
    };



    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (data) {
        const overview = data as CarePlanOverview;
        return (
            <div className="w-full mx-auto p-6  min-h-screen space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>
                                    {mockClient.firstName} {mockClient.lastName}
                                </CardTitle>
                                <CardDescription>
                                    {mockClient.age} jaar • {mockClient.livingSituation} • {mockClient.educationLevel}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant={overview.status === 'draft' ? 'secondary' : 'default'}>
                                {overview.status === 'draft' ? 'Concept' : overview.status}
                            </Badge>
                            <Button>
                                <Save className="w-4 h-4 mr-2" />
                                Opslaan
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Domain & Level Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className='w-[70%] flex flex-col gap-3'>
                                <CardTitle>Zorgplan: {overview.domain}</CardTitle>
                                <CardDescription>{overview.assessment_summary}</CardDescription>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Huidig Niveau</p>
                                    <Badge variant="outline" className={getLevelColor(overview.current_level as keyof typeof levelColors)}>
                                        Niveau {overview.current_level}
                                    </Badge>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Doel Niveau</p>
                                    <Badge variant="outline" className={getLevelColor(overview.target_level as keyof typeof levelColors)}>
                                        Niveau {overview.target_level}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Navigation Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <Card>
                        <CardHeader className="p-0">
                            <TabsList className="w-full justify-start rounded-t-lg rounded-b-none px-6 h-14 bg-white">
                                <TabsTrigger value="overview" className="flex items-center space-x-2 text-green-300 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                                    <Eye className="w-4 h-4" />
                                    <span>Overzicht</span>
                                </TabsTrigger>
                                <TabsTrigger value="objectives" className="flex items-center space-x-2 text-blue-300 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
                                    <Target className="w-4 h-4" />
                                    <span>Doelstellingen</span>
                                </TabsTrigger>
                                <TabsTrigger value="interventions" className="flex items-center space-x-2 text-purple-300 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                                    <Calendar className="w-4 h-4" />
                                    <span>Interventies</span>
                                </TabsTrigger>
                                <TabsTrigger value="metrics" className="flex items-center space-x-2 text-yellow-300 data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Meetpunten</span>
                                </TabsTrigger>
                                <TabsTrigger value="risks" className="flex items-center space-x-2 text-red-300 data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Risicos</span>
                                </TabsTrigger>
                                <TabsTrigger value="support" className="flex items-center space-x-2 text-teal-300 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
                                    <Users className="w-4 h-4" />
                                    <span>Ondersteuning</span>
                                </TabsTrigger>
                                <TabsTrigger value="reports" className="flex items-center space-x-2 text-orange-300 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800">
                                    <Users className="w-4 h-4" />
                                    <span>Reporten</span>
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>

                        <CardContent className="p-6">
                            <TabsContent value="overview">
                                <OverviewTab />
                            </TabsContent>

                            <TabsContent value="objectives">
                                <ObjectivesTab />
                            </TabsContent>

                            <TabsContent value="interventions">
                                <InterventionsTab />
                            </TabsContent>

                            <TabsContent value="metrics">
                                <MetricsTab />
                            </TabsContent>

                            <TabsContent value="risks">
                                <RisksTab />
                            </TabsContent>

                            <TabsContent value="support">
                                <SupportNetworkTab />
                                <ResourcesTab />
                            </TabsContent>
                            <TabsContent value="reports">
                                <ReportsTab />
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>

                {/* Progress Indicator */}
                {/* {isGenerating && (
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <CardHeader>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <div>
                                    <CardTitle>AI Zorgplan Generator Actief</CardTitle>
                                    <CardDescription>
                                        Het systeem analyseert {mockClient.firstName}'s profiel en creëert een gepersonaliseerd zorgplan...
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <Label>Voortgang</Label>
                                    <Label>Geschatte tijd: 30 seconden</Label>
                                </div>
                                <Progress value={70} className="h-2" />
                            </div>

                            <div className="mt-4 text-xs text-muted-foreground">
                                Het AI-systeem verwerkt: leeftijd, woonsituatie, onderwijsniveau, en domein-specifieke criteria...
                            </div>
                        </CardContent>
                    </Card>
                )} */}

                {/* Info Section */}
                <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                    <CardHeader>
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Brain className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle>Over AI Zorgplan Generatie</CardTitle>
                                <CardDescription>
                                    Ons AI-systeem analyseert de cliëntgegevens en genereert een gepersonaliseerd zorgplan
                                    met specifieke doelstellingen, interventies en meetpunten. Het plan is gebaseerd op
                                    evidence-based praktijken en wordt automatisch aangepast aan de leeftijd, woonsituatie
                                    en onderwijsniveau van de cliënt.
                                </CardDescription>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                                        Evidence-based
                                    </Badge>
                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                                        Gepersonaliseerd
                                    </Badge>
                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                                        Meetbaar
                                    </Badge>
                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                                        Tijdsgebonden
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        );
    }
}

export default withAuth(
  withPermissions(GoalPage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewClientCarePlan, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);