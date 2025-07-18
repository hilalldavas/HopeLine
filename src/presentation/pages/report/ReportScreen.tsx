import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Dimensions, Animated } from 'react-native';
import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryAxis } from 'victory-native';
import { VictoryLabel } from 'victory-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Animatable from 'react-native-animatable';

const mockIlacData = [
  { x: 'Pzt', y: 2 },
  { x: 'Sal', y: 1 },
  { x: 'Çar', y: 3 },
  { x: 'Per', y: 2 },
  { x: 'Cum', y: 4 },
  { x: 'Cmt', y: 1 },
  { x: 'Paz', y: 0 },
];
const mockRandevuData = [
  { x: '1 Haz', y: 1 },
  { x: '2 Haz', y: 0 },
  { x: '3 Haz', y: 2 },
  { x: '4 Haz', y: 1 },
  { x: '5 Haz', y: 3 },
];
const mockBelirtiData = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 1 },
  { x: 4, y: 4 },
  { x: 5, y: 2 },
];
const mockDuyguData = [
  { x: 'İyi', y: 5 },
  { x: 'Orta', y: 2 },
  { x: 'Kötü', y: 1 },
];

// Animated yıldızlar
const BackgroundAnimation = () => {
  const { width, height } = Dimensions.get('window');
  const stars = [
    { left: 0.15, baseSize: 22 },
    { left: 0.28, baseSize: 18 },
    { left: 0.41, baseSize: 20 },
    { left: 0.54, baseSize: 19 },
    { left: 0.67, baseSize: 21 },
    { left: 0.80, baseSize: 17 },
  ];
  const animatedValues = React.useRef(stars.map(() => new Animated.Value(0))).current;

  // Her yıldız için rastgele delay ve duration üreten fonksiyonlar
  const getRandomDuration = () => 15000 + Math.random() * 9000; // 15-24sn arası
  const getRandomDelay = () => Math.random() * 8000; // 0-8sn arası
  const getRandomSize = (base: number) => base + Math.floor(Math.random() * 7) - 3; // +-3px oynama

  React.useEffect(() => {
    stars.forEach((s, i) => {
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
      {stars.map((s, i) => {
        const top = animatedValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-s.baseSize, height + s.baseSize],
        });
        const size = getRandomSize(s.baseSize);
        return (
          <Animated.Text
            key={i}
            style={{
              position: 'absolute',
              left: s.left * width,
              top,
              fontSize: size,
              opacity: 0.7,
            }}
          >
            {'⭐️'}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const ReportScreen: React.FC = () => {
  const handleExportPDF = async () => {
    const html = `
      <h1>Raporlama</h1>
      <h2>İlaç Alımı</h2>
      <p>Haftalık ilaç alım yoğunluğu: ...</p>
      <!-- Diğer bölümler -->
    `;
    const options = {
      html,
      fileName: 'rapor',
      directory: 'Documents',
    };
    const file = await RNHTMLtoPDF.convert(options);
    Alert.alert(
      'PDF Başarıyla Oluşturuldu',
      `Rapor PDF olarak kaydedildi.\n\nDosya Yolu:\n${file.filePath}`,
      [{ text: 'Tamam' }]
    );
  };

  return (
    <View style={styles.safeArea}>
      <BackgroundAnimation />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Raporlama</Text>
        {/* İlaç Alımı */}
        <Animatable.View animation="slideInDown" duration={700} delay={0}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>💊</Text><Text style={styles.sectionTitle}>İlaç Alımı</Text></View>
          <View style={styles.card}>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20} height={180} width={320}>
              <VictoryAxis style={{ tickLabels: { fontSize: 13 } }} />
              <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 13 } }} />
              <VictoryBar data={mockIlacData} style={{ data: { fill: '#1976D2', width: 18, borderRadius: 6 } }} />
            </VictoryChart>
            <Text style={styles.placeholderText}>Haftalık ilaç alım yoğunluğu</Text>
          </View>
        </View>
        </Animatable.View>
        {/* Randevular */}
        <Animatable.View animation="slideInDown" duration={700} delay={150}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>📅</Text><Text style={styles.sectionTitle}>Randevular</Text></View>
          <View style={styles.card}>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20} height={180} width={320}>
              <VictoryAxis style={{ tickLabels: { fontSize: 13 } }} />
              <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 13 } }} />
              <VictoryLine data={mockRandevuData} style={{ data: { stroke: '#FFC107', strokeWidth: 3 } }} />
            </VictoryChart>
            <Text style={styles.placeholderText}>Haftalık randevu yoğunluğu</Text>
          </View>
        </View>
        </Animatable.View>
        {/* Belirti Yoğunluğu */}
        <Animatable.View animation="slideInDown" duration={700} delay={300}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>📝</Text><Text style={styles.sectionTitle}>Belirti Yoğunluğu</Text></View>
          <View style={styles.card}>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20} height={180} width={320}>
              <VictoryAxis style={{ tickLabels: { fontSize: 13 } }} />
              <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 13 } }} />
              <VictoryLine data={mockBelirtiData} style={{ data: { stroke: '#1976D2', strokeWidth: 3 } }} />
            </VictoryChart>
            <Text style={styles.placeholderText}>Haftalık belirti yoğunluğu</Text>
          </View>
        </View>
        </Animatable.View>
        {/* Duygu Durumu */}
        <Animatable.View animation="slideInDown" duration={700} delay={450}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionIcon}>😊</Text><Text style={styles.sectionTitle}>Duygu Durumu</Text></View>
          <View style={styles.card}>
            <VictoryPie data={mockDuyguData} colorScale={["#1976D2", "#FFC107", "#D32F2F"]} height={180} width={320} innerRadius={40} labelRadius={70}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              style={{ labels: { fontSize: 15, fill: '#222' } }}
            />
            <Text style={styles.placeholderText}>Duygu durumu dağılımı</Text>
          </View>
        </View>
        </Animatable.View>
      </ScrollView>
      <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
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
  placeholderText: { color: '#bbb', fontSize: 15 },
  exportButton: { position: 'absolute', left: 24, right: 24, bottom: 24, backgroundColor: '#1976D2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', opacity: 0.9, elevation: 4 },
  exportButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
});

export default ReportScreen; 