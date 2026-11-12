import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadHabits } from '../storage';
import { calcStreak, isDone } from '../utils';
import { Habit } from '../types';

export default function StatsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHabits().then(setHabits);
    }, [])
  );

  const doneNow = habits.filter(isDone).length;
  const best = habits.reduce((m, h) => Math.max(m, calcStreak(h)), 0);
  const pct = habits.length ? Math.round((doneNow / habits.length) * 100) : 0;

  const Box = ({ value, label }: { value: string | number; label: string }) => (
    <View style={styles.box}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Box value={habits.length} label="Hábitos creados" />
      <Box value={`${doneNow}/${habits.length}`} label="Completados en el periodo actual" />
      <Box value={`${pct}%`} label="Cumplimiento" />
      <Box value={`🔥 ${best}`} label="Mejor racha actual" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6', gap: 12 },
  box: { backgroundColor: '#fff', borderRadius: 14, padding: 18, elevation: 2 },
  value: { fontSize: 30, fontWeight: '700', color: '#4f46e5' },
  label: { color: '#6b7280', marginTop: 2 },
});
