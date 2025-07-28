import React, { useState, useEffect } from 'react';
import { Stack, Tabs, Paper, TextInput, Group, Title } from '@mantine/core';
import { IconUser, IconChartBar, IconTable, IconUsers } from '@tabler/icons-react';
import { EvaluationForms } from './EvaluationForms/EvaluationForms';
import { Heatmap } from './Heatmap/Heatmap';
import { PlayerProfile } from './PlayerProfile/PlayerProfile';
import { RecentEvaluations } from './RecentEvaluations/RecentEvaluations';
import { useEvaluations } from '../hooks/useEvaluations';
import { useLocalStorage } from '@mantine/hooks';

export const BaseballEvaluationSystem: React.FC = () => {
  const [evaluatorName, setEvaluatorName] = useLocalStorage({
    key: 'baseball_evaluator_name',
    defaultValue: ''
  });
  const { evaluations, loading, addEvaluation } = useEvaluations();

  return (
    <Stack gap="xl">
      {/* Evaluator Name Input */}
      <Paper 
        p="md" 
        style={{ 
          background: '#f8f9fa',
          border: '2px solid #FFD700',
          borderRadius: '8px'
        }}
      >
        <Group>
          <IconUser size={20} />
          <Title order={4}>Evaluator Name</Title>
        </Group>
        <TextInput
          placeholder="Your Name (Coach/Evaluator)"
          value={evaluatorName}
          onChange={(event) => setEvaluatorName(event.currentTarget.value)}
          size="md"
          mt="xs"
          description="Enter your name once - it will be saved for all evaluations"
        />
      </Paper>

      {/* Evaluation Forms */}
      <EvaluationForms 
        evaluatorName={evaluatorName}
        onSubmit={addEvaluation}
      />

      {/* Data Viewing Section */}
      <Paper
        p="xl"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '3px solid #FFD700',
          borderRadius: '10px'
        }}
      >
        <Group mb="md">
          <IconChartBar size={24} color="#FFD700" />
          <Title order={3} c="white">
            Northview Falcons - Live Player Evaluations
          </Title>
        </Group>

        <Tabs 
          defaultValue="heatmap" 
          color="yellow"
          styles={{
            list: {
              borderBottom: '2px solid #FFD700'
            },
            tab: {
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 20px',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              '&:hover:not([data-active])': {
                backgroundColor: 'rgba(255, 215, 0, 0.3) !important',
                borderColor: '#FFD700 !important',
                color: '#000000 !important'
              },
              '&[data-active]': {
                color: '#000000 !important',
                backgroundColor: '#FFD700 !important',
                borderColor: '#FFD700 !important'
              }
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="heatmap" leftSection={<IconTable size={16} />}>
              All Players Heatmap
            </Tabs.Tab>
            <Tabs.Tab value="recent" leftSection={<IconChartBar size={16} />}>
              Recent Evaluations
            </Tabs.Tab>
            <Tabs.Tab value="player" leftSection={<IconUser size={16} />}>
              Player Profile
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="heatmap" pt="md">
            <Heatmap evaluations={evaluations} loading={loading} />
          </Tabs.Panel>

          <Tabs.Panel value="recent" pt="md">
            <RecentEvaluations evaluations={evaluations} loading={loading} />
          </Tabs.Panel>

          <Tabs.Panel value="player" pt="md">
            <PlayerProfile evaluations={evaluations} loading={loading} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
};