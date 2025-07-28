import React, { useMemo, useState } from 'react';
import { Table, Text, Loader, Stack, Group, ActionIcon, Modal, Badge, Paper, Title, Divider } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconArrowsSort, IconUser, IconCalendar } from '@tabler/icons-react';
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
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState<{
    playerName: string;
    evaluationType: string;
    evaluations: Evaluation[];
  } | null>(null);

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

  const handleCellClick = (playerName: string, evaluationType: string) => {
    if (evaluationType === 'name' || evaluationType === 'overall') return;
    
    const playerEvals = evaluations.filter(
      eval => eval.player_name === playerName && eval.evaluation_type === evaluationType
    );
    
    if (playerEvals.length > 0) {
      setSelectedPlayerDetails({
        playerName,
        evaluationType,
        evaluations: playerEvals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      });
      setModalOpened(true);
    }
  };

  const ScoreCell: React.FC<{ 
    score: number; 
    isVelocity?: boolean; 
    playerName: string; 
    evaluationType: string; 
  }> = ({ score, isVelocity = false, playerName, evaluationType }) => {
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
        onClick={() => handleCellClick(playerName, evaluationType)}
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
                <ScoreCell score={player.scores.pitching || 0} playerName={player.name} evaluationType="pitching" />
                <ScoreCell score={player.velocity} isVelocity playerName={player.name} evaluationType="pitching" />
                <ScoreCell score={player.scores.infield || 0} playerName={player.name} evaluationType="infield" />
                <ScoreCell score={player.scores.outfield || 0} playerName={player.name} evaluationType="outfield" />
                <ScoreCell score={player.scores.batting || 0} playerName={player.name} evaluationType="batting" />
                <ScoreCell score={player.scores.catching || 0} playerName={player.name} evaluationType="catching" />
                <ScoreCell score={player.scores.speed || 0} playerName={player.name} evaluationType="speed" />
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

      {/* Score Details Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          selectedPlayerDetails && (
            <Group>
              <IconUser size={20} />
              <Text fw={600}>
                {selectedPlayerDetails.playerName} - {selectedPlayerDetails.evaluationType.charAt(0).toUpperCase() + selectedPlayerDetails.evaluationType.slice(1)} Evaluations
              </Text>
            </Group>
          )
        }
        size="lg"
        styles={{
          title: { fontSize: '18px', fontWeight: 600 }
        }}
      >
        {selectedPlayerDetails && (
          <Stack gap="md">
            <Paper p="sm" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}>
              <Group justify="space-between">
                <Text fw={600} c="black">
                  Total Evaluations: {selectedPlayerDetails.evaluations.length}
                </Text>
                <Badge color="blue" size="lg">
                  Avg: {(selectedPlayerDetails.evaluations.reduce((sum, eval) => sum + eval.average_score, 0) / selectedPlayerDetails.evaluations.length).toFixed(1)}
                </Badge>
              </Group>
            </Paper>

            <Divider />

            <Stack gap="sm">
              {selectedPlayerDetails.evaluations.map((evaluation, index) => (
                <Paper key={evaluation.id} p="md" style={{ backgroundColor: 'rgba(248, 249, 250, 0.95)', border: '1px solid #ddd' }}>
                  <Group justify="space-between" mb="sm">
                    <Group>
                      <IconCalendar size={16} />
                      <Text size="sm" c="dimmed">
                        {new Date(evaluation.created_at).toLocaleDateString()} at{' '}
                        {new Date(evaluation.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </Group>
                    <Group>
                      <Text fw={700} c="black">
                        Score: {evaluation.average_score.toFixed(1)}
                      </Text>
                      {evaluation.velocity && evaluation.velocity > 0 && (
                        <Text fw={600} c="blue">
                          {evaluation.velocity.toFixed(1)} MPH
                        </Text>
                      )}
                    </Group>
                  </Group>

                  <Text size="sm" c="black" fw={500} mb="xs">
                    Evaluator: {evaluation.evaluator_name || 'Unknown'}
                  </Text>

                  {evaluation.notes && (
                    <Paper p="xs" style={{ backgroundColor: '#f1f3f4', marginBottom: '8px' }}>
                      <Text size="sm" c="black" fs="italic">
                        "{evaluation.notes}"
                      </Text>
                    </Paper>
                  )}

                  {/* Individual Ratings */}
                  {evaluation.ratings && evaluation.ratings.length > 0 && (
                    <div>
                      <Text size="xs" c="dimmed" fw={500} mb="xs">Individual Ratings:</Text>
                      <Group gap="sm">
                        {evaluation.ratings.map((rating, idx) => (
                          <Paper key={idx} p="xs" style={{ backgroundColor: 'white', textAlign: 'center', minWidth: '80px' }}>
                            <Text size="xs" c="dimmed">
                              {rating.criteria}
                            </Text>
                            <Text size="sm" c="black" fw={600}>
                              {rating.time ? rating.time : rating.rating.toFixed(1)}
                            </Text>
                          </Paper>
                        ))}
                      </Group>
                    </div>
                  )}
                </Paper>
              ))}
            </Stack>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};