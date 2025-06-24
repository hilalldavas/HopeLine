import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const mockMedications = [
  { id: '1', name: 'Capecitabine', time: '08:00' },
];
const mockAppointments = [
  { id: '1', name: 'Randevu', time: '11:00' },
];

const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logoImg} />
      </View>
      <Text style={styles.hello}>Merhaba, Ece</Text>
      <Text style={styles.sectionTitle}>Bugün</Text>
      <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        {mockMedications.map((med) => (
          <View key={med.id} style={styles.card}>
            <Text style={styles.cardIcon}>💊</Text>
            <Text style={styles.cardTitle}>{med.name}</Text>
            <View style={styles.cardTimeBox}><Text style={styles.cardTime}>{med.time}</Text></View>
          </View>
        ))}
        {mockAppointments.map((app) => (
          <View key={app.id} style={styles.card}>
            <Text style={styles.cardIcon}>📅</Text>
            <Text style={styles.cardTitle}>{app.name}</Text>
            <View style={styles.cardTimeBox}><Text style={styles.cardTime}>{app.time}</Text></View>
          </View>
        ))}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>😊</Text>
          <Text style={styles.cardTitle}>Bugün nasıl hissediyorsun?</Text>
          <View style={styles.moodBox}><Text style={styles.moodText}>İyi</Text></View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🔔</Text>
          <Text style={styles.cardTitle}>Hatırlatıcı Ekle</Text>
        </View>
      </ScrollView>
      {/* Alt menü */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 8 },
  logoImg: { width: 120, height: 120, resizeMode: 'contain' },
  logoText: { fontSize: 18, color: '#1976D2', fontWeight: 'bold', marginTop: 2, opacity: 0.7 },
  hello: { fontSize: 28, fontWeight: '700', marginLeft: 24, marginBottom: 8, color: '#222' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginLeft: 24, marginBottom: 16, color: '#444' },
  cardsContainer: { flex: 1, paddingHorizontal: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardIcon: { fontSize: 22, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '500', flex: 1, color: '#222' },
  cardTimeBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  cardTime: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
  moodBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  moodText: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 56, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  tabItem: { fontSize: 16, color: '#888', fontWeight: '500', paddingVertical: 6, paddingHorizontal: 8 },
  tabItemActive: { color: '#1976D2', fontWeight: '700', borderBottomWidth: 2, borderBottomColor: '#1976D2' },
  tabLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
});

export default DashboardScreen; 