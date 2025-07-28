import React from 'react';
import { Text } from '@mantine/core';
import { Evaluation } from '../../types/evaluation';

interface PlayerProfileProps {
  evaluations: Evaluation[];
  loading: boolean;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ evaluations, loading }) => {
  return (
    <Text c="white" ta="center" py="xl">
      Player Profile - Coming Soon
    </Text>
  );
};