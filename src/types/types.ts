export interface Patient {
  resourceType: 'Patient';
  id: string;
  name: Array<{
    use: string;
    family: string;
    given: string[];
  }>;
  gender: string;
  birthDate: string;
  active: boolean;
}

export interface Condition {
  resourceType: 'Condition';
  id: string;
  subject: {
    reference: string;
  };
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  onsetDateTime: string;
  recordedDate: string;
  clinicalStatus: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
}

export interface FHIRResponse {
  resourceType: 'Bundle';
  type: string;
  total: number;
  entry: Array<{
    resource: Patient | Condition;
  }>;
}

export interface QueryResult {
  explanation: string;
  fhir_parameters: {
    condition?: string[];
    age?: {
      min?: number;
      max?: number;
    };
    gender?: string;
  };
  results: FHIRResponse;
}

export interface QuerySuggestion {
  text: string;
  description: string;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  medications: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
  };
} 