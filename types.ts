
export interface VerificationResult {
  originalText: string;
  overallScore: number;
  claims: ClaimAnalysis[];
  sources: GroundingSource[];
}

export interface ClaimAnalysis {
  id: string;
  text: string;
  status: 'verified' | 'uncertain' | 'hallucination';
  explanation: string;
  confidence: number;
  supportingEvidence?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export enum VerificationStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
