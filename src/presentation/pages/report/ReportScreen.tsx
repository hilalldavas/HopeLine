import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const ReportScreen: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Raporlama</Text>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>💊</Text><Text style={styles.sectionTitle}>İlaç Alımı</Text></View>
          <View style={styles.card}>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 60, backgroundColor: '#1976D2', left: 10 }]} />
              <View style={[styles.bar, { height: 30, backgroundColor: '#FFC107', left: 50 }]} />
              <View style={[styles.bar, { height: 90, backgroundColor: '#1976D2', left: 90 }]} />
              <View style={[styles.bar, { height: 40, backgroundColor: '#FFC107', left: 130 }]} />
            </View>
            <Text style={styles.placeholderText}>Örnek Çubuk Grafik</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>📅</Text><Text style={styles.sectionTitle}>Randevular</Text></View>
          <View style={styles.card}>
            <View style={styles.lineChart}>
              <View style={[styles.line, { left: 0, top: 40, width: 40, height: 2 }]} />
              <View style={[styles.line, { left: 40, top: 20, width: 40, height: 2 }]} />
              <View style={[styles.line, { left: 80, top: 60, width: 40, height: 2 }]} />
              <View style={[styles.line, { left: 120, top: 30, width: 40, height: 2 }]} />
            </View>
            <Text style={styles.placeholderText}>Örnek Çizgi Grafik</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>📝</Text><Text style={styles.sectionTitle}>Belirti Yoğunluğu</Text></View>
          <View style={styles.card}>
            <View style={styles.lineChart}>
              <View style={[styles.line, { left: 0, top: 60, width: 40, height: 2 }]} />
              <View style={[styles.line, { left: 40, top: 30, width: 40, height: 2 }]} />
              <View style={[styles.line, { left: 80, top: 50, width: 40, height: 2 }]} />
              <View style={[styles.line, { left: 120, top: 20, width: 40, height: 2 }]} />
            </View>
            <Text style={styles.placeholderText}>Örnek Çizgi Grafik</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>😊</Text><Text style={styles.sectionTitle}>Duygu Durumu</Text></View>
          <View style={styles.card}>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 30, backgroundColor: '#FFC107', left: 10 }]} />
              <View style={[styles.bar, { height: 80, backgroundColor: '#1976D2', left: 50 }]} />
              <View style={[styles.bar, { height: 50, backgroundColor: '#FFC107', left: 90 }]} />
              <View style={[styles.bar, { height: 70, backgroundColor: '#1976D2', left: 130 }]} />
            </View>
            <Text style={styles.placeholderText}>Örnek Çubuk Grafik</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.exportButton} disabled>
        <Text style={styles.exportButtonText}>📄 PDF Olarak Dışa Aktar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1976D2', marginBottom: 28, alignSelf: 'center', letterSpacing: 0.5 },
  section: { marginBottom: 36 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionIcon: { fontSize: 22, marginRight: 8 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#222' },
  card: { backgroundColor: '#F5F5F5', borderRadius: 20, padding: 18, marginBottom: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3, alignItems: 'center' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, width: 180, marginBottom: 8, position: 'relative' },
  bar: { width: 24, borderRadius: 8, position: 'absolute', bottom: 0 },
  lineChart: { height: 80, width: 180, marginBottom: 8, position: 'relative' },
  line: { backgroundColor: '#1976D2', height: 2, borderRadius: 2, position: 'absolute' },
  placeholderText: { color: '#bbb', fontSize: 15 },
  exportButton: { position: 'absolute', left: 24, right: 24, bottom: 24, backgroundColor: '#1976D2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', opacity: 0.9, elevation: 4 },
  exportButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
});

export default ReportScreen; 