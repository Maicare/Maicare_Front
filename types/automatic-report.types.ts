export type CreateAutomaticReport = {
  end_date: string;
  start_date: string;
};

export type CreateAutomaticReportResponse = {
  report: string;
};

export type AutomaticReportItem = {
  client_id: number;
  created_at: string;
  end_date: string;
  id: number;
  report_text: string;
  start_date: string;
};

export type ValidateAutomaticReport = {
  end_date: string;
  report_text?: string;
  start_date: string;
};
