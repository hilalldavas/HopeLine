import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const mockSymptoms = [
  { id: '1', name: 'Ağrı', severity: 4, date: '2024-06-09', note: 'Baş ağrısı ve hafif mide bulantısı.' },
  { id: '2', name: 'İştah Kaybı', severity: 2, date: '2024-06-10', note: 'Sabah iştahsızlık.' },
  { id: '3', name: 'Yorgunluk', severity: 3, date: '2024-06-11', note: 'Gün boyu halsizlik.' },
];

const severityEmojis = ['😃', '🙂', '😐', '😕', '😫'];

const SymptomScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Belirti Takibi</Text>
        <FlatList
          data={mockSymptoms}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.icon}>📝</Text>
              <View style={styles.infoBox}>
                <Text style={styles.symptomName}>{item.name}</Text>
                <View style={styles.row}>
                  <View style={styles.severityBox}>
                    <Text style={styles.severity}>{severityEmojis[item.severity - 1]} {item.severity}/5</Text>
                  </View>
                  <View style={styles.dateBox}><Text style={styles.date}>{item.date}</Text></View>
                </View>
                <Text style={styles.note}>{item.note}</Text>
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
        <Text style={styles.addButtonText}>+ Belirti Ekle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingBottom: 0 },
  title: { fontSize: 24, fontWeight: '700', color: '#1976D2', marginBottom: 24, alignSelf: 'center', letterSpacing: 0.5 },
  card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F5F5F5', borderRadius: 20, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  icon: { fontSize: 28, marginRight: 16, marginTop: 4 },
  infoBox: { flex: 1 },
  symptomName: { fontSize: 17, fontWeight: '600', color: '#222', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  severityBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  severity: { fontSize: 15, color: '#1976D2', fontWeight: '500' },
  dateBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  date: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
  note: { fontSize: 14, color: '#666', marginTop: 6 },
  actionIcons: { flexDirection: 'row', alignItems: 'center', marginLeft: 12, marginTop: 4 },
  actionIcon: { fontSize: 18, color: '#bbb', marginLeft: 8, opacity: 0.5 },
  addButton: { position: 'absolute', left: 24, right: 24, bottom: 24, backgroundColor: '#1976D2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', opacity: 0.9, elevation: 4 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
});

export default SymptomScreen; 