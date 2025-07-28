import React, { useMemo, useState } from 'react';
import { Table, Text, Loader, Stack, Group, ActionIcon } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconArrowsSort } from '@tabler/icons-react';
import { Evaluation, Player } from '../../types/evaluation';
import { processPlayersData, calculateDynamicRanges, getScoreColor, getVelocityColor } from '../../utils/scoring';

interface HeatmapProps {
  evaluations: Evaluation[];
  loading: boolean;
}

type SortField = 'name' | 'pitching' | 'velocity' | 'infield' | 'outfield' | 'batting' | 'catching' | 'speed' | 'overall';
type SortDirection = 'asc' | 'desc' | 'none';

export const Heatmap: React.FC<HeatmapProps> = ({ evaluations, loading }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { players, scoreRanges } = useMemo(() => {
    const playersData = processPlayersData(evaluations);
    const ranges = calculateDynamicRanges(playersData);
    return { players: playersData, scoreRanges: ranges };
  }, [evaluations]);

  const sortedPlayers = useMemo(() => {
    if (sortDirection === 'none') return players;

    return [...players].sort((a, b) => {
      let valueA: number | string;
      let valueB: number | string;

      if (sortField === 'name') {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        const result = valueA.localeCompare(valueB);
        return sortDirection === 'asc' ? result : -result;
      } else if (sortField === 'overall') {
        valueA = a.overall || 0;
        valueB = b.overall || 0;
      } else if (sortField === 'velocity') {
        valueA = a.velocity || 0;
        valueB = b.velocity || 0;
      } else {
        valueA = a.scores[sortField] || 0;
        valueB = b.scores[sortField] || 0;
      }

      const result = (valueA as number) - (valueB as number);
      return sortDirection === 'asc' ? result : -result;
    });
  }, [players, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> none -> asc
      const nextDirection: SortDirection = 
        sortDirection === 'asc' ? 'desc' : 
        sortDirection === 'desc' ? 'none' : 'asc';
      setSortDirection(nextDirection);
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <IconArrowsSort size={14} />;
    if (sortDirection === 'asc') return <IconArrowUp size={14} />;
    if (sortDirection === 'desc') return <IconArrowDown size={14} />;
    return <IconArrowsSort size={14} />;
  };

  const ScoreCell: React.FC<{ score: number; isVelocity?: boolean }> = ({ score, isVelocity = false }) => {
    if (score <= 0) {
      return (
        <td style={{ backgroundColor: '#6b7280', color: 'white', textAlign: 'center', padding: '8px' }}>
          -
        </td>
      );
    }

    const backgroundColor = isVelocity 
      ? getVelocityColor(score, scoreRanges)
      : getScoreColor(score, scoreRanges);

    return (
      <td 
        style={{ 
          backgroundColor, 
          color: 'white', 
          textAlign: 'center', 
          fontWeight: 'bold',
          padding: '8px',
          cursor: 'pointer'
        }}
      >
        {isVelocity ? `${score.toFixed(1)} MPH` : score.toFixed(1)}
      </td>
    );
  };

  if (loading) {
    return (
      <Stack align="center" py="xl">
        <Loader color="yellow" />
        <Text c="white">Loading heatmap...</Text>
      </Stack>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Text c="white" ta="center" py="xl">
        No evaluations available for heatmap. Submit some evaluations first!
      </Text>
    );
  }

  const headers = [
    { field: 'name' as const, label: 'Player Name' },
    { field: 'pitching' as const, label: 'Pitching' },
    { field: 'velocity' as const, label: 'Velocity' },
    { field: 'infield' as const, label: 'Infield' },
    { field: 'outfield' as const, label: 'Outfield' },
    { field: 'batting' as const, label: 'Batting' },
    { field: 'catching' as const, label: 'Catching' },
    { field: 'speed' as const, label: 'Speed' },
    { field: 'overall' as const, label: 'Overall Avg' }
  ];

  return (
    <Stack gap="md">
      <div style={{ overflowX: 'auto' }}>
        <Table
          striped
          highlightOnHover
          withTableBorder
          style={{
            minWidth: '800px',
            backgroundColor: 'transparent'
          }}
        >
          <Table.Thead>
            <Table.Tr style={{ backgroundColor: '#000000' }}>
              {headers.map(({ field, label }) => (
                <Table.Th
                  key={field}
                  style={{
                    backgroundColor: '#000000',
                    color: 'white',
                    border: '1px solid #FFD700',
                    textAlign: field === 'name' ? 'left' : 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    position: field === 'name' ? 'sticky' : 'static',
                    left: field === 'name' ? 0 : 'auto',
                    zIndex: field === 'name' ? 5 : 'auto'
                  }}
                  onClick={() => handleSort(field)}
                >
                  <Group gap="xs" justify={field === 'name' ? 'flex-start' : 'center'}>
                    <Text size="sm" fw={600}>
                      {label}
                    </Text>
                    <ActionIcon variant="transparent" size="xs" c="white">
                      {getSortIcon(field)}
                    </ActionIcon>
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedPlayers.map((player) => (
              <Table.Tr key={player.name}>
                <Table.Td
                  style={{
                    backgroundColor: '#f8f9fa',
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    border: '1px solid #ddd'
                  }}
                >
                  {player.name}
                </Table.Td>
                <ScoreCell score={player.scores.pitching || 0} />
                <ScoreCell score={player.velocity} isVelocity />
                <ScoreCell score={player.scores.infield || 0} />
                <ScoreCell score={player.scores.outfield || 0} />
                <ScoreCell score={player.scores.batting || 0} />
                <ScoreCell score={player.scores.catching || 0} />
                <ScoreCell score={player.scores.speed || 0} />
                <Table.Td
                  style={{
                    backgroundColor: player.overall > 0 ? getScoreColor(player.overall, scoreRanges) : '#6b7280',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    border: '2px solid #FFD700',
                    padding: '8px'
                  }}
                >
                  {player.overall > 0 ? player.overall.toFixed(1) : '-'}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </Stack>
  );
};