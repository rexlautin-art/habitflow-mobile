import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from './types';

const HABITS_KEY = '@habitflow:habits';
const NAME_KEY = '@habitflow:name';

export async function loadHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(HABITS_KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.warn('No se pudo guardar', e);
  }
}

export async function loadName(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(NAME_KEY)) ?? '';
  } catch {
    return '';
  }
}

export async function saveName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(NAME_KEY, name);
  } catch (e) {
    console.warn('No se pudo guardar el nombre', e);
  }
}
