import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { key: 'dashboard', label: 'Ana Sayfa', icon: '🏠' },
    { key: 'medication', label: 'İlaçlar', icon: '💊' },
    { key: 'calendar', label: 'Takvim', icon: '📅' },
    { key: 'symptom', label: 'Belirtiler', icon: '📝' },
    { key: 'mood', label: 'Ruh Hali', icon: '😊' },
    { key: 'nutrition', label: 'Beslenme', icon: '🍎' },
    { key: 'report', label: 'Raporlar', icon: '📊' },
    { key: 'profile', label: 'Profil', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabPress(tab.key)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabIcon: {
    fontSize: 25,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#1976D2',
    fontWeight: '600',
  },
});

export default TabBar; 