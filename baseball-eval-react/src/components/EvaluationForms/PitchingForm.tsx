import React from 'react';
import { Stack, TextInput, NumberInput, Textarea, Button, Group, Paper, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { EVALUATION_CRITERIA } from '../../config/criteria';

interface PitchingFormProps {
  evaluatorName: string;
  onSubmit: (evaluation: any) => Promise<void>;
  onReset: () => void;
}

export const PitchingForm: React.FC<PitchingFormProps> = ({ evaluatorName, onSubmit, onReset }) => {
  const form = useForm({
    initialValues: {
      playerName: '',
      velocity: '',
      mechanics: '',
      control: '',
      notes: ''
    },
    validate: {
      playerName: (value: string) => (!value ? 'Player name is required' : null),
      velocity: (value: string) => {
        const num = parseFloat(value);
        if (!num || num < 0 || num > 120) return 'Enter valid velocity (0-120 MPH)';
        return null;
      },
      mechanics: (value: string) => {
        const num = parseFloat(value);
        if (!num || num < 2 || num > 8) return 'Rating must be between 2-8';
        return null;
      },
      control: (value: string) => {
        const num = parseFloat(value);
        if (!num || num < 2 || num > 8) return 'Rating must be between 2-8';
        return null;
      }
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!evaluatorName.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter your evaluator name at the top of the page',
        color: 'red',
      });
      return;
    }

    const ratings = [
      { criteria: 'Mechanics', rating: parseFloat(values.mechanics) },
      { criteria: 'Control', rating: parseFloat(values.control) }
    ];

    const averageScore = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    const evaluation = {
      player_name: values.playerName.trim(),
      evaluator_name: evaluatorName,
      evaluation_type: 'pitching' as const,
      velocity: parseFloat(values.velocity),
      ratings,
      notes: values.notes.trim() || undefined,
      average_score: averageScore
    };

    try {
      await onSubmit(evaluation);
      form.reset();
      onReset();
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Title order={4} c="dark">Pitching Evaluation</Title>

          <TextInput
            label="Player Name"
            placeholder="Enter player name"
            required
            {...form.getInputProps('playerName')}
          />

          <NumberInput
            label="Velocity (MPH)"
            placeholder="Enter velocity in MPH"
            min={0}
            max={120}
            decimalScale={1}
            required
            {...form.getInputProps('velocity')}
          />

          <Stack gap="sm">
            <Text fw={500} size="sm">Evaluation Criteria (2=Poor, 8=Excellent)</Text>
            
            <NumberInput
              label="Mechanics"
              placeholder="2-8"
              min={2}
              max={8}
              step={0.5}
              decimalScale={1}
              required
              {...form.getInputProps('mechanics')}
            />

            <NumberInput
              label="Control"
              placeholder="2-8"
              min={2}
              max={8}
              step={0.5}
              decimalScale={1}
              description="Strike zone accuracy"
              required
              {...form.getInputProps('control')}
            />
          </Stack>

          <Textarea
            label="Notes (Optional)"
            placeholder="Any additional observations, strengths, areas for improvement, etc..."
            rows={3}
            {...form.getInputProps('notes')}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => { form.reset(); onReset(); }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              style={{ 
                background: 'linear-gradient(45deg, #000000, #1a1a1a)',
                border: '2px solid #FFD700'
              }}
            >
              Submit Pitching Evaluation
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};