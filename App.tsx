import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import LoginScreen from './src/presentation/pages/auth/LoginScreen';
import RegisterScreen from './src/presentation/pages/auth/RegisterScreen';
import DashboardScreen from './src/presentation/pages/dashboard/DashboardScreen';
import ProfileScreen from './src/presentation/pages/profile/ProfileScreen';
import MedicationScreen from './src/presentation/pages/medication/MedicationScreen';
import CalendarScreen from './src/presentation/pages/calendar/CalendarScreen';
import SymptomScreen from './src/presentation/pages/symptom/SymptomScreen';
import MoodScreen from './src/presentation/pages/mood/MoodScreen';
import ReportScreen from './src/presentation/pages/report/ReportScreen';
import NutritionScreen from './src/presentation/pages/nutrition/NutritionScreen';
import TabBar from './src/presentation/components/TabBar';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'main'>('main');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Auth durumu (gerçek uygulamada bu bir state management ile yönetilir)
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Şimdilik true yapıyoruz

  const renderScreen = () => {
    if (!isLoggedIn) {
      if (currentScreen === 'login') {
        return <LoginScreen onLogin={() => setIsLoggedIn(true)} onRegister={() => setCurrentScreen('register')} />;
      } else {
        return <RegisterScreen onRegister={() => setIsLoggedIn(true)} onLogin={() => setCurrentScreen('login')} />;
      }
    }

    // Ana uygulama ekranları
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'medication':
        return <MedicationScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'symptom':
        return <SymptomScreen />;
      case 'mood':
        return <MoodScreen />;
      case 'nutrition':
        return <NutritionScreen />;
      case 'report':
        return <ReportScreen />;
      case 'profile':
        return <ProfileScreen onLogout={() => setIsLoggedIn(false)} />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {isLoggedIn && (
        <TabBar 
          activeTab={activeTab} 
          onTabPress={setActiveTab} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default App;