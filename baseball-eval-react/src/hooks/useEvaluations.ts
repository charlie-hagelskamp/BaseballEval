import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Evaluation } from '../types/evaluation';
import { notifications } from '@mantine/notifications';

export const useEvaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEvaluations(data || []);
    } catch (error) {
      console.error('Error loading evaluations:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load evaluations',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const addEvaluation = async (evaluation: Omit<Evaluation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .insert([evaluation])
        .select()
        .single();

      if (error) throw error;

      setEvaluations(prev => [data, ...prev]);
      notifications.show({
        title: 'Success',
        message: 'Evaluation submitted successfully',
        color: 'green',
      });

      return data;
    } catch (error) {
      console.error('Error adding evaluation:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to submit evaluation',
        color: 'red',
      });
      throw error;
    }
  };

  useEffect(() => {
    loadEvaluations();

    // Set up real-time subscription
    const channel = supabase
      .channel('evaluations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'evaluations',
        },
        (payload) => {
          console.log('Real-time update:', payload);
          loadEvaluations(); // Reload data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    evaluations,
    loading,
    addEvaluation,
    reload: loadEvaluations
  };
};