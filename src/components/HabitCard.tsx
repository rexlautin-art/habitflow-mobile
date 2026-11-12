import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types';
import { calcStreak, isDone } from '../utils';

interface Props {
  habit: Habit;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function HabitCard({ habit, onToggle, onEdit, onDelete }: Props) {
  const done = isDone(habit);
  const streak = calcStreak(habit);
  const unit = habit.frequency === 'daily' ? 'días' : 'semanas';

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onToggle} style={styles.check}>
        <Ionicons
          name={done ? 'checkmark-circle' : 'ellipse-outline'}
          size={32}
          color={done ? '#16a34a' : '#9ca3af'}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {habit.name}
        </Text>
        <Text style={styles.meta}>
          {habit.frequency === 'daily' ? 'Diario' : 'Semanal'} · 🔥 Racha: {streak} {unit}
        </Text>
      </View>

      <TouchableOpacity onPress={onEdit} style={styles.icon}>
        <Ionicons name="create-outline" size={22} color="#4f46e5" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.icon}>
        <Ionicons name="trash-outline" size={22} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  check: { marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  meta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  icon: { padding: 6 },
});
