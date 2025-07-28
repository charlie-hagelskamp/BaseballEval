import React from 'react';
import { MantineProvider, AppShell, Title, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { BaseballEvaluationSystem } from './components/BaseballEvaluationSystem';

function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'yellow',
        colors: {
          yellow: [
            '#FFF9E6',
            '#FFF3CC',
            '#FFEB99',
            '#FFE066',
            '#FFD700', // Main gold color
            '#E6C200',
            '#CCA800',
            '#B8960B',
            '#A58416',
            '#917321'
          ]
        }
      }}
    >
      <ModalsProvider>
        <Notifications />
        <AppShell
          header={{ height: 80 }}
          padding="md"
          styles={{
            main: {
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
              minHeight: '100vh'
            }
          }}
        >
          <AppShell.Header
            style={{
              background: 'linear-gradient(45deg, #000000, #1a1a1a)',
              borderBottom: '3px solid #FFD700'
            }}
          >
            <Container size="xl" h="100%" style={{ display: 'flex', alignItems: 'center' }}>
              <Title 
                order={1} 
                c="white"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                🦅 Northview Falcons Baseball
              </Title>
            </Container>
          </AppShell.Header>

          <AppShell.Main>
            <Container size="xl">
              <BaseballEvaluationSystem />
            </Container>
          </AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;