import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadHabits, loadName, saveName } from '../storage';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [total, setTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadName().then(setName);
      loadHabits().then((h) => setTotal(h.length));
    }, [])
  );

  const onSave = async () => {
    await saveName(name.trim());
    Alert.alert('Perfil', 'Nombre guardado.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>{(name.trim()[0] || '?').toUpperCase()}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tu nombre" maxLength={40} />
      <TouchableOpacity style={styles.btn} onPress={onSave}>
        <Text style={styles.btnText}>Guardar</Text>
      </TouchableOpacity>
      <Text style={styles.info}>Hábitos registrados: {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', backgroundColor: '#f3f4f6' },
  avatar: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#4f46e5', color: '#fff',
    fontSize: 40, textAlign: 'center', textAlignVertical: 'center', lineHeight: 90, overflow: 'hidden', marginVertical: 20,
  },
  input: { alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16 },
  btn: { marginTop: 14, backgroundColor: '#16a34a', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: '700' },
  info: { marginTop: 24, color: '#6b7280' },
});
