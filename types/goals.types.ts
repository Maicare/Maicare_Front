import { Id } from "@/common/types/types";

export enum GoalDomaines {
    Finance = "Financiën",
    WorkAndEducation = "Werk & Opleiding",
    TimeManagement = "Tijdsbeheer",
    Housing = "Huisvesting",
    DomesticRelationships = "Huishoudelijke Relaties",
    MentalHealth = "Geestelijke Gezondheid",
    PhysicalHealth = "Lichamelijke Gezondheid",
    SubstanceUse = "Middelengebruik",
    BasicActivities = "Basale ADL",
    InstrumentalActivities = "Instrumentele ADL",
    SocialNetwork = "Sociaal Netwerk",
    SocialParticipation = "Maatschappelijke Participatie",
    Justice = "Justitie",
}
export enum GoalScores {
    AcuteIssues = "Acute problematiek",
    NotSelfSufficient = "Niet zelfredzaam",
    PartiallySelfSufficient = "Beperkt zelfredzaam",
    SufficientlySelfSufficient = "Voldoende zelfredzaam",
    FullySelfSufficient = "Volledig zelfredzaam",
};
export enum GoalStatus {
    Open = "Open",
    InProgress = "In Behandeling",
    Completed = "Afgerond",
    Cancelled = "Geannuleerd",
};
export const DESCRIPTIONS: Record<string, Record<string, string[]>> = {
    AcuteIssues: {
        Finance: [
            "groeiende complexe schulden",
        ],
        WorkAndEducation: [
            "geen (traject naar) opleiding/werk of werk zonder adequate toerusting/ verzekering",
            "geen zoekactiviteiten naar opleiding/ werk",
        ],
        TimeManagement: [
            "afwezigheid van activiteiten die plezierig/ nuttig zijn",
            "of geen structuur in de dag",
            "onregelmatig dag-nacht ritme"
        ],
        Housing: [
            "dakloos of in crisisopvang",
        ],
        DomesticRelationships: [
            "geweld in huiselijke kring/ kindermishandeling/ misbruik/ verwaarlozing",
        ],
        MentalHealth: [
            "geestelijke noodsituatie",
            "een gevaar voor zichzelf/ anderen"
        ],
        PhysicalHealth: [
            "een noodgeval/ kritieke situatie",
            "direct medische aandacht nodig",
        ],
        SubstanceUse: [
            "(gedrags-) stoornis/ afhankelijk van het gebruik van middelen of van games/ gokken/ seks/ internet",
            "gebruik veroorzaakt/ verergert lichamelijke/ geestelijke problemen die behandeling vereisen"
        ],
        BasicActivities: [
            "een gebied van de basale ADL wordt niet uitgevoerd",
            "verhongering of uitdroging of bevuiling/ vervuiling"
        ],
        InstrumentalActivities: [
            "meerdere gebieden van de instrumentele ADL worden niet uitgevoerd",
            "woningvervuiling of onder-/over-medicatie of geen administratie of voedselvergiftiging",
        ],
        SocialNetwork: [
            "ernstig sociaal isolement",
            "geen steunend contact met familie of met volwassen steunfiguur buiten gezin",
            "geen steunend contact met leeftijdgenoten"
        ],
        SocialParticipation: [
            "niet van toepassing door crisissituatie of in ‘overlevingsmodus’ of veroorzaakt ernstige overlast",
        ],
        Justice: [
            "zeer regelmatig (maandelijks) contact met politie of openstaande zaken bij justitie",
        ],
    },
    NotSelfSufficient: {
        Finance: [
            "beschikt niet over vrij besteedbaar inkomen of groeiende schulden door spontaan of ongepast uitgeven",
        ],
        WorkAndEducation: [
            "geen (traject naar) opleiding/werk",
            "wel zoekactiviteiten gericht op opleiding/werk of ‘papieren’ opleiding (ingeschreven maar niet volgend) of veel schoolverzuim /dreigend ontslag of dreigende dropout",
        ],
        TimeManagement: [
            "nauwelijks activiteiten die plezierig/ nuttig zijn",
            "nauwelijks structuur in de dag",
            "afwijkend dag-nacht ritme"
        ],
        Housing: [
            "voor wonen ongeschikte huisvesting of dreigende huisuitzetting",
        ],
        DomesticRelationships: [
            "relationele problemen met leden van het huishouden of dreigend geweld in huiselijke kring/ kindermishandeling/ misbruik/ verwaarlozing",
        ],
        MentalHealth: [
            "(chronische) geestelijke aandoening maar geen gevaar voor zichzelf/ anderen",
            "geen gevaar voor zichzelf/ anderen"
        ],
    }
};

export type Goal = {
    client_maturity_matrix_assessment_id: Id,
    completion_date: string,
    created_at: string,
    description: string,
    id: Id,
    start_date: string,
    status: string,
    target_date: string,
    target_level: number
};

export type GoalObjective = {
    id: Id,
    status: string,
    completion_date: string,
    created_at: string,
    due_date: string,
    objective_description: string,
    updated_at: string
};

export type GoalWithObjectives = Goal & {
    objectives: GoalObjective[]
};