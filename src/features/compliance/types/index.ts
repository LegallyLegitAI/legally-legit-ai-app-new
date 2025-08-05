export interface ComplianceQuestion {
  id: string;
  text: string;
  section: string;
}

export interface ComplianceAnswer {
  questionId: string;
  answer: any;
}

export interface ComplianceSection {
  title: string;
  questions: ComplianceQuestion[];
}

export interface ComplianceAssessment {
  answers: ComplianceAnswer[];
  riskScore: number;
  recommendations: string[];
}
