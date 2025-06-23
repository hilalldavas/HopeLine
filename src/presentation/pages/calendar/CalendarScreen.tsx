import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const mockAppointments = [
  { id: '1', name: 'Kemoterapi', date: '2024-06-10', time: '09:00' },
  { id: '2', name: 'Kan Tahlili', date: '2024-06-12', time: '14:30' },
  { id: '3', name: 'Doktor Randevusu', date: '2024-06-15', time: '11:00' },
];

const CalendarScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Takvim & Randevular</Text>
        <FlatList
          data={mockAppointments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.icon}>📅</Text>
              <View style={styles.infoBox}>
                <Text style={styles.appName}>{item.name}</Text>
                <View style={styles.row}>
                  <View style={styles.dateBox}><Text style={styles.date}>{item.date}</Text></View>
                  <View style={styles.timeBox}><Text style={styles.time}>{item.time}</Text></View>
                </View>
              </View>
              <View style={styles.actionIcons}>
                <Text style={styles.actionIcon}>✏️</Text>
                <Text style={styles.actionIcon}>🗑️</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <TouchableOpacity style={styles.addButton} disabled>
        <Text style={styles.addButtonText}>+ Randevu Ekle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingBottom: 0 },
  title: { fontSize: 24, fontWeight: '700', color: '#1976D2', marginBottom: 24, alignSelf: 'center', letterSpacing: 0.5 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 20, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  icon: { fontSize: 28, marginRight: 16 },
  infoBox: { flex: 1 },
  appName: { fontSize: 17, fontWeight: '600', color: '#222', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dateBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  date: { fontSize: 15, color: '#1976D2', fontWeight: '500' },
  timeBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  time: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
  actionIcons: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  actionIcon: { fontSize: 18, color: '#bbb', marginLeft: 8, opacity: 0.5 },
  addButton: { position: 'absolute', left: 24, right: 24, bottom: 24, backgroundColor: '#1976D2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', opacity: 0.9, elevation: 4 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
});

export default CalendarScreen; 