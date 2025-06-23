import React, { useState } from 'react'
import LoginScreen from './src/presentation/pages/auth/LoginScreen'
import RegisterScreen from './src/presentation/pages/auth/RegisterScreen'
import DashboardScreen from './src/presentation/pages/dashboard/DashboardScreen'
import ProfileScreen from './src/presentation/pages/profile/ProfileScreen'
import MedicationScreen from './src/presentation/pages/medication/MedicationScreen'
import CalendarScreen from './src/presentation/pages/calendar/CalendarScreen'
import SymptomScreen from './src/presentation/pages/symptom/SymptomScreen'
import MoodScreen from './src/presentation/pages/mood/MoodScreen'
import ReportScreen from './src/presentation/pages/report/ReportScreen'
import NutritionScreen from './src/presentation/pages/nutrition/NutritionScreen'

const App = () => {
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  return <MedicationScreen />;
}

export default App