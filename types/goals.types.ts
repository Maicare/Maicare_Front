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
    Pending = "In afwachting",
    Completed = "Afgerond",
    Failed = "Mislukt",
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
            "functioneren is ernstig beperkt door geestelijk gezondheidsprobleem (incl. gedrags- ontwikkelings-problematiek)",
            "geen behandeling"
        ],
        PhysicalHealth: [
            "geen medische behandeling",
            "geen medische zorg",
        ],
    }
};
export const ZRM_MATRIX = {
    levels: {
        1: {
            name: "Acute problematiek",
            domains: {
                1: ["groeiende complexe schulden"],
                2: ["geen traject naar opleiding/werk of werk zonder adequate toezicht/verzekering"],
                3: ["geen zoeksactiviteiten naar opleiding/werk", "afwezigheid van activiteiten die plezierig nuttig zijn"],
                4: ["dakloos of in crisisopvang", "geweld in huiselijke kring/kindermishandeling/misbruik/verwaarlozing"],
                5: ["een noodgeval/kritieke situatie", "direct medische aandacht nodig"],
                6: ["(gedrags-)onrust afhankelijk van het gebruik van middelen of van gamen/gokken/seks/internet", "gebruik veroorzaakt/verergert lichamelijke/geestelijke problemen die behandeling vereisen"],
                7: ["een gebied van de basale ADL wordt niet uitgevoerd", "verhongering of uitdroging of vervuiling/verwaarlozing"],
                8: ["meerdere gebieden van de instrumentele ADL worden niet uitgevoerd", "woningvervuiling of onder-/over-medicatie of geen administratie of voedselvergiftiging"],
                9: ["ernstig sociaal isolement", "geen steunend contact met familie of met volwassen steunfiguur buiten gezin", "geen steunend contact met leeftijdsgenoten"],
                10: ["niet van toepassing door crisissituatie of in 'overlevingsmodus' of veroorzaakt ernstige overlast"]
            }
        },
        2: {
            name: "Niet zelfredzaam",
            domains: {
                1: ["beschikt niet over vrij besteedbaar inkomen of groeiende schulden door spontaan of ongepland uitgeven"],
                2: ["geen traject naar opleiding/werk", "wel zoeksactiviteiten gericht op opleiding/werk of 'papieren' opleiding (ingeschreven maar niet volgend) of veel schoolverzuim (dreigend ontslag of dreigende dropout)"],
                3: ["nauwelijks activiteiten die plezierig nuttig zijn", "ongeplande structuur in de dag"],
                4: ["voor wonen ongeschikte huisvesting of dreigende huisuitzetting", "relationele problemen met leden van het huishouden of dreigend geweld in huiselijke kring/kindermishandeling/misbruik/verwaarlozing"],
                5: ["(chronische) lichamelijke aandoening die medische behandeling vereist", "functioneren is ernstig beperkt door lichamelijk gezondheidsprobleem", "geen behandeling"],
                6: ["gebruik van middelen of problematisch 'gebruik' van gamen/gokken/seks/internet", "aan gebruik gerelateerde lichamelijke/geestelijke problemen of problemen functioneren op school/op het werk", "geen behandeling"],
                7: ["meerdere gebieden van de basale ADL worden beperkt uitgevoerd"],
                8: ["een enkel gebied van de instrumentele ADL wordt niet uitgevoerd of uitvoering op meerdere gebieden is beperkt", "weet gezien de leeftijd te weinig welke instanties er zijn, wat je ermee moet doen en hoe ze te benaderen"],
                9: ["geen steunend contact met familie of met volwassen steunfiguur buiten gezin", "weinig steunend contact met leeftijdsgenoten", "veel belemmerend contact"],
                10: ["geen maatschappelijke participatie of veroorzaakt overlast"]
            }
        },
        3: {
            name: "Beperkt zelfredzaam",
            domains: {
                1: ["beschikt over vrij besteedbaar inkomen van ouders zonder verantwoordelijkheid voor noodzakelijke behoeften (zakgeld)", "eventuele schulden zijn stabiel of zijn onder beheer"],
                2: ["volgt opleiding maar loopt achter of geregeld verzuim van opleiding/werk of volgt traject naar opleiding (trajectbegeleiding, coaching voor schoolverlaters)"],
                3: ["onvoldoende activiteiten die plezierig nuttig zijn", "voldoende structuur in de dag of enige afwijkingen in het dag-nacht ritme"],
                4: ["veilige, stabiele huisvesting maar slechts marginaal toereikend of verblijf in niet-autonome huisvesting (instelling)", "spanningen in relaties met leden van het huishouden"],
                5: ["lichamelijke aandoening", "functioneren is beperkt door lichamelijk gezondheidsprobleem", "behandeltrouw is minimaal of beperking bestaat ondanks goede behandeltrouw"],
                6: ["gebruik van middelen", "geen aan middelengebruik gerelateerde problemen", "behandeltrouw is minimaal of beperking bestaat ondanks goede behandeltrouw"],
                7: ["alle gebieden van de basale ADL worden uitgevoerd maar een enkel gebied van de basale ADL wordt beperkt uitgevoerd"],
                8: ["alle gebieden van de instrumentele ADL worden uitgevoerd", "uitvoering van een enkel gebied van de instrumentele ADL is beperkt"],
                9: ["een steunend contact met familie of met de volwassen steunfiguur buiten het huishouden", "enige steunend contact met leeftijdsgenoten", "weinig belemmerend contact"],
                10: ["nauwelijks participerend in maatschappij", "logistieke, financiële of sociaal-maatschappelijke hindernissen om meer te participeren"]
            }
        },
        4: {
            name: "Voldoende zelfredzaam",
            domains: {
                1: ["beschikt over vrij besteedbaar inkomen van ouders met enige verantwoordelijkheid voor noodzakelijke behoeften (zakgeld, en kleding/luxegeld)", "gepland uitgeven", "eventuele schulden verminderen"],
                2: ["op schema met opleiding of heeft startkwalificatie met tijdelijke baan", "traject naar opleiding/traject naar werk", "zelden ongeoorloofd verzuim"],
                3: ["voldoende activiteiten die plezierig nuttig zijn", "dag-nacht ritme heeft geen negatieve invloed op het dagelijks functioneren"],
                4: ["veilige, stabiele en toereikende huisvesting", "gedeeltelijk autonome huisvesting (begeleid wonen)"],
                5: ["minimale tekenen van geestelijke onrust die voorspelbare reactie zijn op stressoren in het leven (ook puberteit)", "functioneren is marginaal beperkt door geestelijke onrust", "goede behandeltrouw of geen behandeling nodig"],
                6: ["geen middelengebruik", "geen sterke drang naar gebruik van middelen"],
                7: ["geen beperkingen in de uitvoering van de basale ADL"],
                8: ["geen beperkingen in de uitvoering van de instrumentele ADL"],
                9: ["voldoende steunend contact met familie of met volwassen steunfiguur buiten het huishouden", "voldoende steunend contact met leeftijdsgenoten", "nauwelijks belemmerend contact"],
                10: ["enige maatschappelijke participatie (meedoen)", "persoonlijke hindernis (motivatie) om meer te participeren"]
            }
        },
        5: {
            name: "Volledig zelfredzaam",
            domains: {
                1: ["beschikt over vrij besteedbaar inkomen (uit klusjes of bijbaan) met enige verantwoordelijkheid voor noodzakelijke behoeften", "aan het eind van de maand is geld over", "geen schulden"],
                2: ["presteert zeer goed op opleiding of heeft startkwalificatie met vaste baan", "geen ongeoorloofd verzuim"],
                3: ["tijd is overwegend gevuld met plezierige nuttige activiteiten", "gezond dag-nacht ritme"],
                4: ["veilige, stabiele en toereikende huisvesting", "autonome huisvesting (zelfstandig wonen)", "woont bij ouders/verzorgers"],
                5: ["lichamelijk gezond", "gezonde leefstijl (gezonde voeding en voldoende bewegen)"],
                6: ["geen middelengebruik", "geen sterke drang naar gebruik van middelen"],
                7: ["geen beperkingen in de uitvoering van de basale ADL, zoals eten, wassen en aankleden", "geen gebruik van hulpmiddelen"],
                8: ["geen beperkingen in de uitvoering van de instrumentele ADL", "krijgt geen hulp van buiten huishouden en maakt geen gebruik van hulpmiddelen"],
                9: ["veel steunend contact met familie of met volwassen steunfiguur buiten het huishouden", "veel steunend contact met leeftijdsgenoten", "geen belemmerend contact"],
                10: ["actief participerend in de maatschappij (bijdragen)", "geen contact met politie", "geen strafblad"]
            }
        }
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

export type CreateGoal = {
    description: string,
    start_date: string,
    target_date: string,
    target_level: string,
    status: string
};

export const GOAL_STATUSES = [
    { value: "pending", label: GoalStatus.Pending },
    { value: "completed", label: GoalStatus.Completed },
    { value: "failed", label: GoalStatus.Failed }
];

export type CreateObjective = {
    due_date: string,
    objective_description: string
}