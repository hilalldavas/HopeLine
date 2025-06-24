import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import ConfettiCannon from 'react-native-confetti-cannon';
import Chatbox from '../../components/Chatbox';

const mockMedications = [
  { id: '1', name: 'Capecitabine', time: '08:00' },
];
const mockAppointments = [
  { id: '1', name: 'Randevu', time: '11:00' },
];

// Animated baloncuklar
const BackgroundAnimation = () => {
  const { width, height } = Dimensions.get('window');
  // Baloncuklar
  const bubbles = [
    { left: 0.15, baseSize: 18, color: '#1976D2' },
    { left: 0.28, baseSize: 14, color: '#90CAF9' },
    { left: 0.41, baseSize: 16, color: '#1976D2' },
    { left: 0.54, baseSize: 15, color: '#90CAF9' },
    { left: 0.67, baseSize: 17, color: '#1976D2' },
    { left: 0.80, baseSize: 13, color: '#90CAF9' },
  ];
  const animatedBubbleValues = React.useRef(bubbles.map(() => new Animated.Value(0))).current;

  const getRandomDuration = () => 15000 + Math.random() * 9000;
  const getRandomDelay = () => Math.random() * 8000;
  const getRandomSize = (base: number) => base + Math.floor(Math.random() * 7) - 3;

  React.useEffect(() => {
    bubbles.forEach((b, i) => {
      const animate = () => {
        animatedBubbleValues[i].setValue(0);
        const duration = getRandomDuration();
        const delay = getRandomDelay();
        Animated.timing(animatedBubbleValues[i], {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: false,
        }).start(() => animate());
      };
      animate();
    });
  }, [animatedBubbleValues]);

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 2 }} pointerEvents="none">
      {/* Baloncuklar */}
      {bubbles.map((b, i) => {
        const top = animatedBubbleValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-b.baseSize, height + b.baseSize],
        });
        const size = getRandomSize(b.baseSize);
        return (
          <Animated.View
            key={'bubble-' + i}
            style={{
              position: 'absolute',
              left: b.left * width,
              top,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: b.color,
              opacity: 0.7,
            }}
          />
        );
      })}
    </View>
  );
};

const DashboardScreen: React.FC = () => {
  const [showConfetti, setShowConfetti] = React.useState(true);
  const fullText = 'Merhaba, Hilal';

  React.useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <BackgroundAnimation />
      {showConfetti && (
        <ConfettiCannon
          count={80}
          origin={{ x: Dimensions.get('window').width / 2, y: 0 }}
          fadeOut
          fallSpeed={3500}
          explosionSpeed={500}
        />
      )}
      <Animatable.View animation="slideInUp" duration={800} style={{ flex: 1 }}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logoImg} />
        </View>
        <Text style={styles.hello}>{fullText}</Text>
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
      </Animatable.View>
      <Chatbox />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 8 },
  logoImg: { width: 150, height: 150, resizeMode: 'contain' },
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