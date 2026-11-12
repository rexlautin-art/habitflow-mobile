# HabitFlow Mobile
App móvil para crear hábitos, marcar su cumplimiento diario/semanal y seguir rachas.
Stack: React Native, Expo SDK 51, TypeScript, React Navigation, AsyncStorage, Axios.

## Ejecutar
```
npm install
npx expo start
```
Escanea el QR con Expo Go.

## Build (APK)
```
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
