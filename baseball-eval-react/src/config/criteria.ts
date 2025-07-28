import { EvaluationCriteria } from '../types/evaluation';

export const EVALUATION_CRITERIA: EvaluationCriteria = {
  pitching: ['Mechanics', 'Control'],
  infield: ['Range/Feet', 'Glove', 'Mechanics', 'Arm Strength'],
  outfield: ['Range/Speed', 'Mechanics', 'Arm Strength'],
  batting: ['Mechanics', 'Contact', 'Power'],
  catching: ['Receiving', 'Blocking', 'Pop Time'],
  speed: ['60 Time']
};

export const EVALUATION_LABELS = {
  pitching: 'Pitching',
  infield: 'Infield',
  outfield: 'Outfield',
  batting: 'Batting',
  catching: 'Catching',
  speed: 'Speed & Agility'
};