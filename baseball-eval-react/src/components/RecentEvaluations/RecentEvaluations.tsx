import React from 'react';
import { Stack, Text, Loader, Paper, Group, Badge } from '@mantine/core';
import { Evaluation } from '../../types/evaluation';

interface RecentEvaluationsProps {
  evaluations: Evaluation[];
  loading: boolean;
}

export const RecentEvaluations: React.FC<RecentEvaluationsProps> = ({ evaluations, loading }) => {
  if (loading) {
    return (
      <Stack align="center" py="xl">
        <Loader color="yellow" />
        <Text c="white">Loading evaluations...</Text>
      </Stack>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Text c="white" ta="center" py="xl">
        No evaluations found. Submit your first evaluation above!
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {evaluations.slice(0, 20).map((evaluation) => (
        <Paper
          key={evaluation.id}
          p="md"
          style={{ 
            backgroundColor: '#1a1a1a',
            border: '1px solid #FFD700',
            borderRadius: '8px'
          }}
        >
          <Group justify="space-between" mb="xs">
            <Text fw={600} c="white" size="lg">
              {evaluation.player_name}
            </Text>
            <Badge color="yellow" variant="filled">
              {evaluation.evaluation_type.toUpperCase()}
            </Badge>
          </Group>
          
          <Group justify="space-between">
            <Text c="gray.4" size="sm">
              Evaluator: {evaluation.evaluator_name}
            </Text>
            <Text c="yellow" fw={600} size="lg">
              Score: {evaluation.average_score.toFixed(1)}/8
            </Text>
          </Group>

          {evaluation.velocity && (
            <Text c="gray.4" size="sm">
              Velocity: {evaluation.velocity} MPH
            </Text>
          )}

          {evaluation.notes && (
            <Text c="gray.4" size="sm" mt="xs" fs="italic">
              Notes: {evaluation.notes}
            </Text>
          )}

          <Text c="gray.5" size="xs" mt="xs">
            {new Date(evaluation.created_at).toLocaleString()}
          </Text>
        </Paper>
      ))}
    </Stack>
  );
};