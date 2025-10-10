'use client';
import React, { useEffect, useState } from 'react';
import { User, Brain, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { useAssessment } from '@/hooks/assessment/use-assessment';
import { useParams, useRouter } from 'next/navigation';
import { DOMAINS } from '@/consts';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';
import { useClient } from '@/hooks/client/use-client';
import { Client } from '@/types/client.types';
import { Id } from '@/common/types/types';
import { getAge } from '@/utils/get-age';



function CareplanUI() {
    const { clientId } = useParams();
    const router = useRouter();
    const { readOne } = useClient({ autoFetch: false, });
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedTargetLevel, setSelectedTargetLevel] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const { generateOne } = useAssessment({ autoFetch: false, clientId: parseInt(clientId as string) });
    useEffect(() => {
        const fetchClient = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id);
            setClient(data);
            setIsLoading(false);
        }
        if (clientId) fetchClient(+clientId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);
    const handleGeneratePlan = async () => {
        if (!selectedDomain || !selectedLevel || !selectedTargetLevel) return;
        try {
            setIsGenerating(true);
            const plan = await generateOne({
                maturity_matrix_id: Object.keys(DOMAINS).indexOf(selectedDomain) + 1,
                initial_level: parseInt(selectedLevel),
                target_level: parseInt(selectedTargetLevel),
            }, {
                displayProgress: true,
                displaySuccess: true
            });
            router.push(`/clients/${clientId}/care-plan/${plan.care_plan_id}`);

        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const levelColors = {
        1: "bg-red-100 text-red-800 border-red-200",
        2: "bg-orange-100 text-orange-800 border-orange-200",
        3: "bg-yellow-100 text-yellow-800 border-yellow-200",
        4: "bg-blue-100 text-blue-800 border-blue-200",
        5: "bg-green-100 text-green-800 border-green-200"
    };
    const getLevelColor = (level: keyof typeof levelColors) => {
        return levelColors[level] || "bg-gray-100 text-gray-800 border-gray-200";
    };
    if (isLoading || !client) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="w-full mx-auto p-6  min-h-screen space-y-6">
            {/* Header */}
            <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <CardTitle>
                            {client?.first_name} {client?.last_name}
                        </CardTitle>
                        <CardDescription>
                            {getAge(client?.date_of_birth)} jaar • {client.living_situation} • {client.education_level}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            {/* Care Plan Generator */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <Brain className="w-6 h-6 text-purple-600" />
                        <CardTitle>Zorgplan Genereren</CardTitle>
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Domain Selection */}
                    <div>
                        <Label>Selecteer Domein</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
                            {Object.keys(DOMAINS).map((domain) => (
                                <Button
                                    key={domain}
                                    onClick={() => {
                                        setSelectedDomain(domain);
                                        setSelectedLevel("");
                                    }}
                                    variant={selectedDomain === domain ? "default" : "outline"}
                                    className={`h-auto p-4 justify-start text-left ${selectedDomain === domain ? 'border-blue-500' : ''
                                        }`}
                                >
                                    <div className="font-medium">{domain}</div>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Level Selection */}
                    {selectedDomain && (
                        <div>
                            <Label>Selecteer Huidig Niveau voor {selectedDomain}</Label>
                            <div className="space-y-3 mt-3">
                                {Object.entries(DOMAINS[selectedDomain as keyof typeof DOMAINS]).map(([level, description]) => (
                                    <div
                                        key={level}
                                        onClick={() => setSelectedLevel(level)}
                                        // variant={selectedLevel === level ? "default" : "outline"}
                                        className={cn("w-full p-4 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors", selectedLevel === level ? "border-blue-500 bg-blue-50" : "border-gray-300")}
                                    >
                                        <div className="flex items-center justify-start w-full gap-3">
                                            <Badge variant="outline" className={cn(getLevelColor(parseInt(level) as keyof typeof levelColors), "w-22 flex items-center justify-center")}>
                                                Niveau {level}
                                            </Badge>
                                            <p className="">{description}</p>
                                            {selectedLevel === level && (
                                                <CheckCircle className="w-5 h-5" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Level Selection */}
                    {selectedLevel && (
                        <div>
                            <Label>Selecteer doelniveau voor {selectedDomain}</Label>
                            <div className="space-y-3 mt-3">
                                {Object.entries(DOMAINS[selectedDomain as keyof typeof DOMAINS]).map(([level, description]) => {
                                    return (
                                        <div
                                            key={level}
                                            onClick={() => setSelectedTargetLevel(level)}
                                            // variant={selectedLevel === level ? "default" : "outline"}
                                            className={cn("w-full p-4 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors", selectedTargetLevel === level ? "border-blue-500 bg-blue-50" : "border-gray-300", parseInt(level) < parseInt(selectedLevel) && "hidden")}
                                        >
                                            <div className="flex items-center justify-start w-full gap-3">
                                                <Badge variant="outline" className={cn(getLevelColor(parseInt(level) as keyof typeof levelColors), "w-22 flex items-center justify-center")}>
                                                    Niveau {level}
                                                </Badge>
                                                <p className="">{description}</p>
                                                {selectedTargetLevel === level && (
                                                    <CheckCircle className="w-5 h-5" />
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Generate Button */}
                    {selectedDomain && selectedLevel && selectedTargetLevel && (
                        <div className="pt-4">
                            <Button
                                onClick={handleGeneratePlan}
                                disabled={isGenerating || !selectedDomain || !selectedLevel || !selectedTargetLevel}
                                className="w-full h-14 text-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        <span>Zorgplan wordt gegenereerd...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        <span>Genereer AI Zorgplan</span>
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            {selectedDomain && selectedLevel && !isGenerating && (
                                <Card className="mt-4 bg-blue-50 border-blue-200">
                                    <CardContent className="p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Plan wordt gegenereerd voor:</strong> {selectedDomain}, Niveau {selectedLevel} → Niveau {parseInt(selectedLevel) + 1}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            AI zal een gepersonaliseerd zorgplan maken op basis van {client.first_name}&apos;s profiel en het geselecteerde niveau.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Progress Indicator */}
                    {isGenerating && (
                        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <div>
                                        <CardTitle>AI Zorgplan Generator Actief</CardTitle>
                                        <CardDescription>
                                            Het systeem analyseert {client.first_name}&apos;s profiel en creëert een gepersonaliseerd zorgplan...
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
                    )}
                </CardContent>
            </Card>

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

export default withAuth(
    withPermissions(CareplanUI, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.CreateClientCarePlan, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);