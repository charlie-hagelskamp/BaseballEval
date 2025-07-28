import React, { useState } from 'react';
import { Stack, Select, Paper, Title, Group } from '@mantine/core';
import { IconBallBaseball } from '@tabler/icons-react';
import { EvaluationType } from '../../types/evaluation';
import { EVALUATION_LABELS } from '../../config/criteria';
import { PitchingForm } from './PitchingForm';
import { InfieldForm } from './InfieldForm';
import { OutfieldForm } from './OutfieldForm';
import { BattingForm } from './BattingForm';
import { CatchingForm } from './CatchingForm';
import { SpeedForm } from './SpeedForm';

interface EvaluationFormsProps {
  evaluatorName: string;
  onSubmit: (evaluation: any) => Promise<void>;
}

export const EvaluationForms: React.FC<EvaluationFormsProps> = ({ evaluatorName, onSubmit }) => {
  const [selectedType, setSelectedType] = useState<EvaluationType | null>(null);

  const evaluationOptions = Object.entries(EVALUATION_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const renderForm = () => {
    if (!selectedType) return null;

    const commonProps = {
      evaluatorName,
      onSubmit,
      onReset: () => setSelectedType(null)
    };

    switch (selectedType) {
      case 'pitching':
        return <PitchingForm {...commonProps} />;
      case 'infield':
        return <InfieldForm {...commonProps} />;
      case 'outfield':
        return <OutfieldForm {...commonProps} />;
      case 'batting':
        return <BattingForm {...commonProps} />;
      case 'catching':
        return <CatchingForm {...commonProps} />;
      case 'speed':
        return <SpeedForm {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Paper
      p="xl"
      style={{
        borderBottom: '2px solid #FFD700',
        borderRadius: '8px'
      }}
    >
      <Stack gap="lg">
        <Group>
          <IconBallBaseball size={24} color="#FFD700" />
          <Title order={3}>Player Evaluation Forms</Title>
        </Group>

        <Select
          label="Select Evaluation Type"
          placeholder="Choose evaluation type..."
          data={evaluationOptions}
          value={selectedType}
          onChange={(value) => setSelectedType(value as EvaluationType)}
          size="md"
          clearable
        />

        {renderForm()}
      </Stack>
    </Paper>
  );
};