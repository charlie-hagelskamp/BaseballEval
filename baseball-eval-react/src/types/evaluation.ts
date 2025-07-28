export interface Rating {
  criteria: string;
  rating: number;
  time?: string; // For speed evaluations
}

export interface Evaluation {
  id: number;
  player_name: string;
  evaluator_name: string;
  evaluation_type: 'pitching' | 'infield' | 'outfield' | 'batting' | 'catching' | 'speed';
  velocity?: number; // Only for pitching
  ratings: Rating[];
  notes?: string;
  average_score: number;
  created_at: string;
  updated_at: string;
}

export interface Player {
  name: string;
  scores: Record<string, number>;
  velocity: number;
  overall: number;
  evaluations: Evaluation[];
}

export interface ScoreRanges {
  score: {
    min: number;
    max: number;
    ranges: number[];
  };
  velocity: {
    min: number;
    max: number;
    ranges: number[];
  };
}

export type EvaluationType = 'pitching' | 'infield' | 'outfield' | 'batting' | 'catching' | 'speed';

export interface EvaluationCriteria {
  pitching: string[];
  infield: string[];
  outfield: string[];
  batting: string[];
  catching: string[];
  speed: string[];
}