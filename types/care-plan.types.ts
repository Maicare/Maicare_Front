import { Id } from "@/common/types/types"

export type Resource = {
    id: Id;
    resource_description: string,
    is_obtained: boolean,
    obtained_date: string,
    type: string
}
export type Risk = {
    mitigation_strategy: string,
    risk_description: string,
    risk_id: Id,
    risk_level: "high" | "medium" | "low",
}
export type InterventionActivity = {
    intervention_description: string,
    intervention_id: Id,
}
export type Intervention = {
    daily_activities: InterventionActivity[],
    monthly_activities: InterventionActivity[],
    weekly_activities: InterventionActivity[]
}
export type ObjectiveAction = {
    action_description: string,
    action_id: Id,
    is_completed: boolean,
    notes: string,
    sort_order: number
}
export type ObjectiveTermGoal = {
    actions: ObjectiveAction[],
    description: string,
    objective_id: Id,
    timeframe: string,
    title: string
    status: "draft" | "not_started" | "in_progress" | "completed"
}
export type Objective = {
    long_term_goals: ObjectiveTermGoal[],
    medium_term_goals: ObjectiveTermGoal[],
    short_term_goals: ObjectiveTermGoal[],
}
export type SuccessMetric = {
    current_value: string,
    measurement_method: string,
    metric_id: Id,
    metric_name: string,
    target_value: string
}
export type CarePlanOverview = {
    assessment_summary: string,
    current_level: number,
    domain: string,
    generated_at: string,
    id: Id,
    raw_llm_response: string,
    status: string,
    target_level: number
}
export type SupportNetwork = {
    responsibility_description: string,
    role_title: string,
    support_network_id: Id
}