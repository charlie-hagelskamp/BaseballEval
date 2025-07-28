import React from 'react';
import { Stack, TextInput, NumberInput, Textarea, Button, Group, Paper, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface SpeedFormProps {
  evaluatorName: string;
  onSubmit: (evaluation: any) => Promise<void>;
  onReset: () => void;
}

export const SpeedForm: React.FC<SpeedFormProps> = ({ evaluatorName, onSubmit, onReset }) => {
  const form = useForm({
    initialValues: {
      playerName: '',
      sixtyTime: '',
      notes: ''
    },
    validate: {
      playerName: (value: string) => (!value ? 'Player name is required' : null),
      sixtyTime: (value: string) => {
        const num = parseFloat(value);
        if (!num || num < 5.0 || num > 10.0) return 'Enter valid 60 yard time (5.0-10.0 seconds)';
        return null;
      }
    }
  });

  // Convert time to rating (faster times get higher ratings)
  const timeToRating = (time: number): number => {
    // 6.0 seconds = 8.0 rating (excellent)
    // 8.0 seconds = 2.0 rating (poor)
    // Linear scale between these points
    if (time <= 6.0) return 8.0;
    if (time >= 8.0) return 2.0;
    
    // Linear interpolation
    return 8.0 - ((time - 6.0) / (8.0 - 6.0)) * (8.0 - 2.0);
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!evaluatorName.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter your evaluator name at the top of the page',
        color: 'red',
      });
      return;
    }

    const time = parseFloat(values.sixtyTime);
    const rating = timeToRating(time);

    const ratings = [
      { 
        criteria: '60 Time', 
        rating: rating,
        time: values.sixtyTime + 's'
      }
    ];

    const evaluation = {
      player_name: values.playerName.trim(),
      evaluator_name: evaluatorName,
      evaluation_type: 'speed' as const,
      ratings,
      notes: values.notes.trim() || undefined,
      average_score: rating
    };

    try {
      await onSubmit(evaluation);
      form.reset();
      onReset();
    } catch (error) {
      // Error already handled in hook
    }
  };

  const currentTime = parseFloat(form.values.sixtyTime);
  const estimatedRating = currentTime ? timeToRating(currentTime) : null;

  return (
    <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Title order={4} c="dark">Speed & Agility Evaluation</Title>

          <TextInput
            label="Player Name"
            placeholder="Enter player name"
            required
            {...form.getInputProps('playerName')}
          />

          <Stack gap="sm">
            <Text fw={500} size="sm">60 Yard Dash Time</Text>
            
            <NumberInput
              label="60 Time (seconds)"
              placeholder="6.50"
              min={5.0}
              max={10.0}
              step={0.01}
              decimalScale={2}
              description="Enter time in seconds (e.g., 6.85)"
              required
              {...form.getInputProps('sixtyTime')}
            />

            {estimatedRating && (
              <Text size="sm" c="dimmed">
                Estimated Rating: {estimatedRating.toFixed(1)}/8.0
                {estimatedRating >= 7.5 && ' (Excellent)'}
                {estimatedRating >= 6.5 && estimatedRating < 7.5 && ' (Good)'}
                {estimatedRating >= 5.5 && estimatedRating < 6.5 && ' (Average)'}
                {estimatedRating >= 4.5 && estimatedRating < 5.5 && ' (Below Average)'}
                {estimatedRating < 4.5 && ' (Poor)'}
              </Text>
            )}
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
              Submit Speed Evaluation
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};