import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { loadHabits, saveHabits } from '../storage';
import { Frequency, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitForm'>;

export default function HabitFormScreen({ route, navigation }: Props) {
  const habitId = route.params?.habitId;
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');

  useEffect(() => {
    if (!habitId) return;
    loadHabits().then((all) => {
      const h = all.find((x) => x.id === habitId);
      if (h) {
        setName(h.name);
        setFrequency(h.frequency);
      }
    });
  }, [habitId]);

  const onSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Falta el nombre', 'Escribe un nombre para el hábito.');
      return;
    }
    const all = await loadHabits();
    if (habitId) {
      await saveHabits(all.map((h) => (h.id === habitId ? { ...h, name: trimmed, frequency } : h)));
    } else {
      await saveHabits([
        ...all,
        { id: Date.now().toString(), name: trimmed, frequency, completions: [], createdAt: new Date().toISOString() },
      ]);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del hábito</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej: Leer 20 minutos"
        maxLength={60}
      />

      <Text style={styles.label}>Frecuencia</Text>
      <View style={styles.row}>
        {(['daily', 'weekly'] as Frequency[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.option, frequency === f && styles.optionActive]}
            onPress={() => setFrequency(f)}
          >
            <Text style={[styles.optionText, frequency === f && { color: '#fff' }]}>
              {f === 'daily' ? 'Diaria' : 'Semanal'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.save} onPress={onSave}>
        <Text style={styles.saveText}>{habitId ? 'Guardar cambios' : 'Crear hábito'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  label: { fontWeight: '600', marginTop: 16, marginBottom: 6, color: '#111827' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16 },
  row: { flexDirection: 'row', gap: 10 },
  option: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#e5e7eb', alignItems: 'center' },
  optionActive: { backgroundColor: '#4f46e5' },
  optionText: { fontWeight: '600', color: '#374151' },
  save: { marginTop: 30, backgroundColor: '#16a34a', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
