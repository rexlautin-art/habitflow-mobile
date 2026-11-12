import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HabitCard from '../components/HabitCard';
import { loadHabits, saveHabits } from '../storage';
import { fetchQuote } from '../quote';
import { toggleCompletion } from '../utils';
import { Habit, RootStackParamList } from '../types';

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState('Cargando frase del día...');

  // Recarga los datos cada vez que la pantalla recupera el foco
  useFocusEffect(
    useCallback(() => {
      loadHabits().then(setHabits);
    }, [])
  );

  useEffect(() => {
    fetchQuote().then(setQuote);
  }, []);

  const update = async (next: Habit[]) => {
    setHabits(next);
    await saveHabits(next);
  };

  const onToggle = (id: string) =>
    update(habits.map((h) => (h.id === id ? toggleCompletion(h) : h)));

  const onDelete = (h: Habit) =>
    Alert.alert('Eliminar hábito', `¿Eliminar "${h.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => update(habits.filter((x) => x.id !== h.id)) },
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.quoteBox}>
        <Text style={styles.quote}>{quote}</Text>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aún no tienes hábitos. Pulsa + para crear el primero.</Text>
        }
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={() => onToggle(item.id)}
            onEdit={() => navigation.navigate('HabitForm', { habitId: item.id })}
            onDelete={() => onDelete(item)}
          />
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('HabitForm')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  quoteBox: { backgroundColor: '#4f46e5', padding: 14 },
  quote: { color: '#fff', fontStyle: 'italic', textAlign: 'center' },
  empty: { textAlign: 'center', color: '#6b7280', marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
