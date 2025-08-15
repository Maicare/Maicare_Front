'use client';
import React, { useState } from 'react';
import { User, Brain, CheckCircle,  ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { useAssessment } from '@/hooks/assessment/use-assessment';

// Mock data (same as before)
const mockClient = {
    id: 1,
    firstName: "Emma",
    lastName: "van Berg",
    age: 16,
    livingSituation: "Foster care placement",
    educationLevel: "VMBO level"
};

const mockDomains = {
    "Financiën": {
        1: "groeiende complexe schulden",
        2: "beschikt niet over vrij besteedbaar inkomen of groeiende schulden door spontaan of ongepast uitgeven",
        3: "beschikt over vrij besteedbaar inkomen van ouders zonder verantwoordelijkheid voor noodzakelijke behoeften (zakgeld). Eventuele schulden zijn stabiel en onder beheer",
        4: "beschikt over vrij besteedbaar inkomen van ouders met enige verantwoordelijkheid voor noodzakelijke behoeften (zakgeld, en kleed-/lunchgeld). Gepast uitgeven. Eventuele schulden verminderen",
        5: "beschikt over vrij besteedbaar inkomen (uit klusjes of (bij)baan) met enige verantwoordelijkheid voor noodzakelijke behoeften. Aan het eind van de maand is geld over. Geen schulden"
    },
    "Werk & Opleiding": {
        1: "geen (traject naar) opleiding/werk of werk zonder adequate toerusting/verzekering. Geen zoekactiviteiten naar opleiding/werk",
        2: "geen (traject naar) opleiding/werk, maar wel zoekactiviteiten gericht op opleiding/werk of ‘papieren’ opleiding of veel schoolverzuim/dreigend ontslag",
        3: "volgt opleiding maar loopt achter of heeft geregeld verzuim van opleiding/werk of volgt traject naar opleiding",
        4: "op schema met opleiding of heeft startkwalificatie met tijdelijke baan/traject naar opleiding/traject naar werk",
        5: "presteert zeer goed op opleiding of heeft startkwalificatie met vaste baan. Geen ongeoorloofd verzuim"
    },
    "Tijdsbesteding": {
        1: "afwezigheid van activiteiten die plezierig/nuttig zijn. Geen structuur in de dag. Onregelmatig dag-nacht ritme",
        2: "nauwelijks activiteiten die plezierig/nuttig zijn. Nauwelijks structuur in de dag. Afwijkend dag-nacht ritme",
        3: "onvoldoende activiteiten die plezierig/nuttig zijn, maar voldoende structuur in de dag",
        4: "voldoende activiteiten die plezierig/nuttig zijn. Dag-nacht ritme heeft geen negatieve invloed",
        5: "tijd is overwegend gevuld met plezierige/nuttige activiteiten. Gezond dag-nacht ritme"
    },
    "Huisvesting": {
        1: "dakloos of in crisisopvang",
        2: "voor wonen ongeschikte huisvesting of dreigende huisuitzetting",
        3: "veilige, stabiele huisvesting maar slechts marginaal toereikend of verblijft in niet-autonome huisvesting",
        4: "veilige, stabiele en toereikende huisvesting, gedeeltelijk autonome huisvesting",
        5: "veilige, stabiele en toereikende huisvesting, autonome huisvesting of woont bij ouders/verzorgers"
    },
    "Huishoudelijke Relaties": {
        1: "geweld in huiselijke kring, kindermishandeling, misbruik of verwaarlozing",
        2: "relationele problemen met leden van het huishouden of dreigend geweld in huiselijke kring",
        3: "spanningen in relaties met leden van het huishouden, probeert eigen negatief gedrag te veranderen",
        4: "relationele problemen of spanningen binnen het huishouden zijn niet meer aanwezig",
        5: "wordt gesteund en steunt binnen het huishouden, communicatie is open"
    },
    "Geestelijke Gezondheid": {
        1: "geestelijke noodsituatie, een gevaar voor zichzelf of anderen",
        2: "chronische geestelijke aandoening, functioneren ernstig beperkt, geen behandeling",
        3: "geestelijke aandoening, functioneren beperkt, minimale behandeltrouw of beperking ondanks behandeling",
        4: "minimale tekenen van geestelijke onrust, functioneren marginaal beperkt, goede behandeltrouw of geen behandeling nodig",
        5: "geestelijk gezond, niet meer dan dagelijkse zorgen"
    },
    "Lichamelijke Gezondheid": {
        1: "kritieke situatie, direct medische aandacht nodig",
        2: "chronische lichamelijke aandoening, functioneren ernstig beperkt, geen behandeling",
        3: "lichamelijke aandoening, functioneren beperkt, minimale behandeltrouw of beperking ondanks behandeling",
        4: "minimaal lichamelijk ongemak, functioneren marginaal beperkt, goede behandeltrouw of geen behandeling nodig",
        5: "lichamelijk gezond, gezonde leefstijl"
    },
    "Middelengebruik": {
        1: "verslaving of stoornis, gebruik verergert lichamelijke/geestelijke problemen die behandeling vereisen",
        2: "problematisch gebruik van middelen, games, gokken, seks of internet, geen behandeling",
        3: "gebruik van middelen zonder gerelateerde problemen, minimale behandeltrouw of beperking ondanks behandeling",
        4: "geen middelengebruik ondanks drang, of behandeling met potentieel verslavende middelen zonder bijgebruik",
        5: "geen middelengebruik, geen drang naar gebruik"
    },
    "Basale ADL": {
        1: "een gebied van de basale ADL wordt niet uitgevoerd, verhongering of uitdroging of vervuiling",
        2: "meerdere gebieden van de basale ADL worden beperkt uitgevoerd",
        3: "alle gebieden van de basale ADL worden uitgevoerd maar een enkel gebied wordt beperkt uitgevoerd",
        4: "geen beperkingen in de uitvoering van de basale ADL, krijgt hulp of gebruikt hulpmiddel",
        5: "geen beperkingen in de uitvoering van de basale ADL, zoals eten, wassen en aankleden"
    },
    "Instrumentele ADL": {
        1: "meerdere gebieden van de instrumentele ADL worden niet uitgevoerd, ernstige verwaarlozing",
        2: "een enkel gebied wordt niet uitgevoerd of meerdere gebieden beperkt, onvoldoende kennis van instanties",
        3: "alle gebieden uitgevoerd, maar een enkel gebied beperkt, beperkte kennis van instanties",
        4: "geen beperkingen, krijgt enige hulp bij contact met instanties",
        5: "geen beperkingen, geen hulp nodig, gebruikt instanties leeftijdsadequaat"
    },
    "Sociaal Netwerk": {
        1: "ernstig sociaal isolement, geen steunend contact met familie of leeftijdgenoten",
        2: "geen steunend contact met familie of volwassen steunfiguur, weinig steunend contact met leeftijdgenoten",
        3: "enig steunend contact met familie of steunfiguur, enig contact met leeftijdgenoten",
        4: "voldoende steunend contact met familie, steunfiguren en leeftijdgenoten",
        5: "gezond sociaal netwerk, veel steunend contact, geen belemmerend contact"
    },
    "Sociale Participatie": {
        1: "geen participatie door crisissituatie of veroorzaakt ernstige overlast",
        2: "geen maatschappelijke participatie of veroorzaakt overlast",
        3: "nauwelijks participatie, hindernissen om meer te participeren",
        4: "enige participatie, persoonlijke hindernis om meer te participeren",
        5: "actief participerend in de maatschappij"
    },
    "Justitie": {
        1: "zeer regelmatig contact met politie of openstaande zaken bij justitie",
        2: "regelmatig contact met politie of lopende zaken bij justitie",
        3: "incidenteel contact met politie of voorwaardelijke straf",
        4: "zelden contact met politie of strafblad",
        5: "geen contact met politie, geen strafblad"
    }
};

function CareplanUI() {
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedTargetLevel, setSelectedTargetLevel] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const {generateOne} = useAssessment({autoFetch:false,clientId:25});
    const handleGeneratePlan = async () => {
        if (!selectedDomain || !selectedLevel || !selectedTargetLevel) return;
        try {
            setIsGenerating(true);
            const plan = await generateOne({
                maturity_matrix_id: Object.keys(mockDomains).indexOf(selectedDomain) + 1,
                initial_level: parseInt(selectedLevel),
                target_level: parseInt(selectedTargetLevel),
            },{
                displayProgress:true,
                displaySuccess:true
            });
            console.log("Generated Plan:", plan);

        } catch (error) {
            console.error(error);
        }finally{
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
                            {mockClient.firstName} {mockClient.lastName}
                        </CardTitle>
                        <CardDescription>
                            {mockClient.age} jaar • {mockClient.livingSituation} • {mockClient.educationLevel}
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
                            {Object.keys(mockDomains).map((domain) => (
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
                                {Object.entries(mockDomains[selectedDomain as keyof typeof mockDomains]).map(([level, description]) => (
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
                                {Object.entries(mockDomains[selectedDomain as keyof typeof mockDomains]).map(([level, description]) => {
                                    return (
                                        <div
                                            key={level}
                                            onClick={() => setSelectedTargetLevel(level)}
                                            // variant={selectedLevel === level ? "default" : "outline"}
                                            className={cn("w-full p-4 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors", selectedTargetLevel === level ? "border-blue-500 bg-blue-50" : "border-gray-300",parseInt(level) < parseInt(selectedLevel) && "hidden")}
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
                                            AI zal een gepersonaliseerd zorgplan maken op basis van {mockClient.firstName}&apos;s profiel en het geselecteerde niveau.
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
                                            Het systeem analyseert {mockClient.firstName}&apos;s profiel en creëert een gepersonaliseerd zorgplan...
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

export default CareplanUI;