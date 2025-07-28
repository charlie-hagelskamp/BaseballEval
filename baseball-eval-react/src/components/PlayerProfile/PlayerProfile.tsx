import React, { useState, useMemo } from 'react';
import { 
  Text, 
  Select, 
  Stack, 
  Group, 
  Paper, 
  Badge, 
  Title, 
  Loader,
  Table,
  Divider,
  Card
} from '@mantine/core';
import { IconUser, IconCalendar, IconChartBar } from '@tabler/icons-react';
import { Evaluation } from '../../types/evaluation';

interface PlayerProfileProps {
  evaluations: Evaluation[];
  loading: boolean;
}

const EVALUATION_TYPE_LABELS = {
  pitching: 'Pitching',
  infield: 'Infield',
  outfield: 'Outfield',
  batting: 'Batting',
  catching: 'Catching',
  speed: 'Speed'
};

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ evaluations, loading }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Get unique players for dropdown
  const players = useMemo(() => {
    const uniquePlayers = Array.from(new Set(evaluations.map(evaluation => evaluation.player_name))).sort();
    return uniquePlayers.map(name => ({ value: name, label: name }));
  }, [evaluations]);

  // Get evaluations for selected player
  const playerEvaluations = useMemo(() => {
    if (!selectedPlayer) return [];
    return evaluations
      .filter(evaluation => evaluation.player_name === selectedPlayer)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [evaluations, selectedPlayer]);

  // Calculate average scores by evaluation type
  const averageScores = useMemo(() => {
    if (!selectedPlayer) return {};
    
    const evalsByType = evaluations
      .filter(evaluation => evaluation.player_name === selectedPlayer)
      .reduce((acc, evaluation) => {
        if (!acc[evaluation.evaluation_type]) acc[evaluation.evaluation_type] = [];
        acc[evaluation.evaluation_type].push(evaluation);
        return acc;
      }, {} as Record<string, Evaluation[]>);

    const averages: Record<string, number> = {};
    Object.entries(evalsByType).forEach(([type, evals]) => {
      const sum = evals.reduce((total, evaluation) => total + evaluation.average_score, 0);
      averages[type] = sum / evals.length;
    });

    return averages;
  }, [evaluations, selectedPlayer]);

  if (loading) {
    return (
      <Stack align="center" py="xl">
        <Loader color="yellow" />
        <Text c="white">Loading player profiles...</Text>
      </Stack>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Text c="white" ta="center" py="xl">
        No evaluations available. Submit some evaluations first!
      </Text>
    );
  }

  return (
    <Stack gap="md">
      {/* Player Selection */}
      <Select
        label="Select Player"
        placeholder="Choose a player to view their profile"
        data={players}
        value={selectedPlayer}
        onChange={setSelectedPlayer}
        searchable
        size="md"
        styles={{
          label: { color: 'white', fontSize: '16px', fontWeight: 600 },
          input: { backgroundColor: 'white', fontSize: '16px' }
        }}
      />

      {selectedPlayer && (
        <Stack gap="lg">
          {/* Player Header */}
          <Paper p="md" style={{ backgroundColor: '#f8f9fa', border: '2px solid #FFD700' }}>
            <Group>
              <IconUser size={24} color="#000" />
              <Title order={2} c="black">{selectedPlayer}</Title>
              <Badge size="lg" color="yellow" variant="filled">
                {playerEvaluations.length} Evaluation{playerEvaluations.length !== 1 ? 's' : ''}
              </Badge>
            </Group>
          </Paper>

          {/* Average Scores Summary */}
          {Object.keys(averageScores).length > 0 && (
            <Card p="md" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid #FFD700' }}>
              <Group mb="sm">
                <IconChartBar size={20} color="#FFD700" />
                <Title order={4} c="white">Average Scores</Title>
              </Group>
              <Group gap="md">
                {Object.entries(averageScores).map(([type, avg]) => (
                  <Paper key={type} p="xs" style={{ backgroundColor: 'white', minWidth: '120px' }}>
                    <Text size="sm" c="black" ta="center" fw={600}>
                      {EVALUATION_TYPE_LABELS[type as keyof typeof EVALUATION_TYPE_LABELS]}
                    </Text>
                    <Text size="lg" c="black" ta="center" fw={700}>
                      {avg.toFixed(1)}
                    </Text>
                  </Paper>
                ))}
              </Group>
            </Card>
          )}

          <Divider color="#FFD700" />

          {/* Individual Evaluations */}
          <Stack gap="sm">
            <Group>
              <IconCalendar size={20} color="#FFD700" />
              <Title order={4} c="white">Individual Evaluations</Title>
            </Group>

            {playerEvaluations.map((evaluation, index) => (
              <Card 
                key={`${evaluation.id}-${index}`} 
                p="md" 
                style={{ 
                  backgroundColor: 'rgba(248, 249, 250, 0.95)',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <Group justify="space-between" mb="sm">
                  <Group>
                    <Badge 
                      color="dark" 
                      variant="filled"
                      size="lg"
                    >
                      {EVALUATION_TYPE_LABELS[evaluation.evaluation_type as keyof typeof EVALUATION_TYPE_LABELS]}
                    </Badge>
                    <Text size="sm" c="dimmed">
                      {new Date(evaluation.created_at).toLocaleDateString()} at{' '}
                      {new Date(evaluation.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </Group>
                  <Group>
                    <Text size="lg" fw={700} c="black">
                      Score: {evaluation.average_score.toFixed(1)}
                    </Text>
                    {evaluation.velocity && evaluation.velocity > 0 && (
                      <Text size="md" fw={600} c="blue">
                        {evaluation.velocity.toFixed(1)} MPH
                      </Text>
                    )}
                  </Group>
                </Group>

                <Group justify="space-between" align="flex-start">
                  <Text size="sm" c="black" fw={500}>
                    Evaluator: {evaluation.evaluator_name || 'Unknown'}
                  </Text>
                  {evaluation.notes && (
                    <Paper p="xs" style={{ backgroundColor: '#f1f3f4', maxWidth: '300px' }}>
                      <Text size="sm" c="black" fs="italic">
                        "{evaluation.notes}"
                      </Text>
                    </Paper>
                  )}
                </Group>

                {/* Individual Scores Breakdown */}
                {evaluation.ratings && evaluation.ratings.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <Text size="xs" c="dimmed" fw={500} mb="xs">Individual Ratings:</Text>
                    <Table>
                      <Table.Tbody>
                        <Table.Tr>
                          {evaluation.ratings.map((rating, idx) => (
                            <Table.Td key={idx} style={{ textAlign: 'center', padding: '4px 8px' }}>
                              <Text size="xs" c="dimmed" fw={500}>
                                {rating.criteria}
                              </Text>
                              <Text size="sm" c="black" fw={600}>
                                {rating.time ? rating.time : rating.rating.toFixed(1)}
                              </Text>
                            </Table.Td>
                          ))}
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                )}
              </Card>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};