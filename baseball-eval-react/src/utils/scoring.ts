import { Evaluation, Player, ScoreRanges } from '../types/evaluation';

export const calculateDynamicRanges = (players: Player[]): ScoreRanges => {
  const allScores: number[] = [];
  const allVelocities: number[] = [];
  
  // Collect all non-zero scores and velocities
  players.forEach(player => {
    Object.values(player.scores).forEach(score => {
      if (score > 0) allScores.push(score);
    });
    if (player.overall > 0) allScores.push(player.overall);
    if (player.velocity > 0) allVelocities.push(player.velocity);
  });
  
  // Calculate score ranges
  let scoreRanges: number[];
  if (allScores.length === 0) {
    scoreRanges = [2, 3.2, 4.4, 5.6, 6.8, 8];
  } else {
    allScores.sort((a, b) => a - b);
    const min = allScores[0];
    const max = allScores[allScores.length - 1];
    const range = max - min;
    
    scoreRanges = [
      min,
      min + range * 0.2,
      min + range * 0.4,
      min + range * 0.6,
      min + range * 0.8,
      max
    ];
  }
  
  // Calculate velocity ranges
  let velocityRanges: number[];
  if (allVelocities.length === 0) {
    velocityRanges = [60, 65, 70, 75, 80, 85];
  } else {
    allVelocities.sort((a, b) => a - b);
    const vMin = allVelocities[0];
    const vMax = allVelocities[allVelocities.length - 1];
    const vRange = vMax - vMin;
    
    velocityRanges = [
      vMin,
      vMin + vRange * 0.2,
      vMin + vRange * 0.4,
      vMin + vRange * 0.6,
      vMin + vRange * 0.8,
      vMax
    ];
  }
  
  return {
    score: {
      min: allScores[0] || 2,
      max: allScores[allScores.length - 1] || 8,
      ranges: scoreRanges
    },
    velocity: {
      min: allVelocities[0] || 60,
      max: allVelocities[allVelocities.length - 1] || 85,
      ranges: velocityRanges
    }
  };
};

export const getScoreColor = (score: number, rangeData: ScoreRanges): string => {
  if (!rangeData || score <= 0) return '#6b7280'; // gray for missing
  
  const { ranges } = rangeData.score;
  if (score >= ranges[4]) return '#22c55e'; // excellent - green
  if (score >= ranges[3]) return '#84cc16'; // good - lime
  if (score >= ranges[2]) return '#eab308'; // average - yellow
  if (score >= ranges[1]) return '#f97316'; // below - orange
  return '#dc2626'; // poor - red
};

export const getVelocityColor = (velocity: number, rangeData: ScoreRanges): string => {
  if (!rangeData || velocity <= 0) return '#6b7280'; // gray for missing
  
  const { ranges } = rangeData.velocity;
  if (velocity >= ranges[4]) return '#22c55e'; // excellent - green
  if (velocity >= ranges[3]) return '#84cc16'; // good - lime
  if (velocity >= ranges[2]) return '#eab308'; // average - yellow
  if (velocity >= ranges[1]) return '#f97316'; // below - orange
  return '#dc2626'; // poor - red
};

export const processPlayersData = (evaluations: Evaluation[]): Player[] => {
  // Get all unique players and build data structure
  const players = Array.from(new Set(evaluations.map(evaluation => evaluation.player_name))).sort();
  const evalTypes = ['pitching', 'infield', 'outfield', 'batting', 'catching', 'speed'];

  return players.map(playerName => {
    const playerEvals = evaluations.filter(evaluation => evaluation.player_name === playerName);
    const playerData: Player = {
      name: playerName,
      scores: {},
      velocity: 0,
      overall: 0,
      evaluations: playerEvals
    };
    
    let totalScore = 0;
    let evalCount = 0;

    evalTypes.forEach(type => {
      const typeEvals = playerEvals.filter(evaluation => evaluation.evaluation_type === type);
      
      if (typeEvals.length > 0) {
        const avgScore = typeEvals.reduce((sum, evaluation) => sum + evaluation.average_score, 0) / typeEvals.length;
        playerData.scores[type] = avgScore;
        totalScore += avgScore;
        evalCount++;
        
        // Track velocity for pitching evaluations
        if (type === 'pitching') {
          const velocityEvals = typeEvals.filter(evaluation => evaluation.velocity && evaluation.velocity > 0);
          if (velocityEvals.length > 0) {
            playerData.velocity = velocityEvals.reduce((sum, evaluation) => sum + (evaluation.velocity || 0), 0) / velocityEvals.length;
          }
        }
      } else {
        playerData.scores[type] = 0;
      }
    });

    // Calculate overall average
    playerData.overall = evalCount > 0 ? totalScore / evalCount : 0;
    return playerData;
  });
};