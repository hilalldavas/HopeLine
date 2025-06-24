import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface ProfileScreenProps {
  onLogout: () => void;
}

const mockProfile = {
  name: 'Hilal',
  email: 'hilalldavas@gmail.com',
  diagnosisDate: '2022-11-15',
  treatmentProcess: 'Kemoterapi',
  doctorName: 'Dr. Ahmet Demir',
  photo: require('../../../assets/images/profil.jpg'),
};

// Animated kalpler (hearts)
const BackgroundAnimation = () => {
  const { width, height } = Dimensions.get('window');
  const hearts = [
    { left: 0.18, baseSize: 28 },
    { left: 0.32, baseSize: 22 },
    { left: 0.46, baseSize: 25 },
    { left: 0.60, baseSize: 24 },
    { left: 0.74, baseSize: 27 },
    { left: 0.88, baseSize: 21 },
  ];
  const animatedValues = React.useRef(hearts.map(() => new Animated.Value(0))).current;

  // Her kalp için rastgele delay ve duration üreten fonksiyonlar
  const getRandomDuration = () => 15000 + Math.random() * 9000; // 15-24sn arası
  const getRandomDelay = () => Math.random() * 8000; // 0-8sn arası
  const getRandomSize = (base: number) => base + Math.floor(Math.random() * 7) - 3; // +-3px oynama

  React.useEffect(() => {
    hearts.forEach((h, i) => {
      const animate = () => {
        animatedValues[i].setValue(0);
        const duration = getRandomDuration();
        const delay = getRandomDelay();
        Animated.timing(animatedValues[i], {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: false,
        }).start(() => animate());
      };
      animate();
    });
  }, [animatedValues]);

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 2 }} pointerEvents="none">
      {hearts.map((h, i) => {
        const top = animatedValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-h.baseSize, height + h.baseSize],
        });
        const size = getRandomSize(h.baseSize);
        return (
          <Animated.Text
            key={i}
            style={{
              position: 'absolute',
              left: h.left * width,
              top,
              fontSize: size,
              opacity: 0.7,
            }}
          >
            {'❤️'}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackgroundAnimation />
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View animation="slideInUp" duration={800} style={styles.profileCard}>
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
        </Animatable.View>
      </ScrollView>
    </View>
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