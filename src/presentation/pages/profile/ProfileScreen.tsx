import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const mockProfile = {
  name: 'Ece Yılmaz',
  email: 'ece.yilmaz@example.com',
  diagnosisDate: '2022-11-15',
  treatmentProcess: 'Kemoterapi',
  doctorName: 'Dr. Ahmet Demir',
  photo: require('../../../assets/images/logo.png'), // Geçici olarak logo kullanılıyor
};

const ProfileScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.photoContainer}>
          <Image source={mockProfile.photo} style={styles.photo} />
        </View>
        <Text style={styles.title}>Profil Bilgileri</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>İsim:</Text>
          <Text style={styles.value}>{mockProfile.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>E-posta:</Text>
          <Text style={styles.value}>{mockProfile.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tanı Tarihi:</Text>
          <Text style={styles.value}>{mockProfile.diagnosisDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tedavi Süreci:</Text>
          <Text style={styles.value}>{mockProfile.treatmentProcess}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Doktor:</Text>
          <Text style={styles.value}>{mockProfile.doctorName}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} disabled>
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  profileCard: { width: '100%', backgroundColor: '#F5F5F5', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, alignItems: 'center' },
  photoContainer: { marginBottom: 16, alignItems: 'center', justifyContent: 'center' },
  photo: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e3e3e3' },
  title: { fontSize: 22, fontWeight: '700', color: '#1976D2', marginBottom: 20, alignSelf: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, width: '100%' },
  label: { fontSize: 16, color: '#444', fontWeight: '500' },
  value: { fontSize: 16, color: '#222', fontWeight: '400' },
  editButton: { marginTop: 24, backgroundColor: '#1976D2', borderRadius: 8, paddingVertical: 10, alignItems: 'center', opacity: 0.6, width: '100%' },
  editButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen; 