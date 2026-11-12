export type Frequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  completions: string[]; // fechas YYYY-MM-DD
  createdAt: string;
}

export type RootStackParamList = {
  Tabs: undefined;
  HabitForm: { habitId?: string } | undefined;
};
