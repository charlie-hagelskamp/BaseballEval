import React from 'react';
import { Stack, TextInput, NumberInput, Textarea, Button, Group, Paper, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface OutfieldFormProps {
  evaluatorName: string;
  onSubmit: (evaluation: any) => Promise<void>;
  onReset: () => void;
}

export const OutfieldForm: React.FC<OutfieldFormProps> = ({ evaluatorName, onSubmit, onReset }) => {
  const form = useForm({
    initialValues: {
      playerName: '',
      rangeSpeed: '',
      mechanics: '',
      armStrength: '',
      notes: ''
    },
    validate: {
      playerName: (value: string) => (!value ? 'Player name is required' : null),
      rangeSpeed: (value: string) => {
        const num = parseFloat(value);
        if (!num || num < 2 || num > 8) return 'Rating must be between 2-8';
        return null;
      },
      mechanics: (value: string) => {
        const num = parseFloat(value);
        if (!num || num < 2 || num > 8) return 'Rating must be between 2-8';
        return null;
      },
      armStrength: (value: string) => {
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
      { criteria: 'Range/Speed', rating: parseFloat(values.rangeSpeed) },
      { criteria: 'Mechanics', rating: parseFloat(values.mechanics) },
      { criteria: 'Arm Strength', rating: parseFloat(values.armStrength) }
    ];

    const averageScore = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    const evaluation = {
      player_name: values.playerName.trim(),
      evaluator_name: evaluatorName,
      evaluation_type: 'outfield' as const,
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
          <Title order={4} c="dark">Outfield Evaluation</Title>

          <TextInput
            label="Player Name"
            placeholder="Enter player name"
            required
            {...form.getInputProps('playerName')}
          />

          <Stack gap="sm">
            <Text fw={500} size="sm">Evaluation Criteria (2=Poor, 8=Excellent)</Text>
            
            <NumberInput
              label="Range/Speed"
              placeholder="2-8"
              min={2}
              max={8}
              step={0.5}
              decimalScale={1}
              description="Field coverage"
              required
              {...form.getInputProps('rangeSpeed')}
            />

            <NumberInput
              label="Mechanics"
              placeholder="2-8"
              min={2}
              max={8}
              step={0.5}
              decimalScale={1}
              description="Ball tracking & catching"
              required
              {...form.getInputProps('mechanics')}
            />

            <NumberInput
              label="Arm Strength"
              placeholder="2-8"
              min={2}
              max={8}
              step={0.5}
              decimalScale={1}
              description="Throwing distance"
              required
              {...form.getInputProps('armStrength')}
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
              Submit Outfield Evaluation
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};