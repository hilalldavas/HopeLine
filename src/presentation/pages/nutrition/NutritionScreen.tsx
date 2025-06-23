import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

const mockMeals = [
  { id: '1', name: 'Kahvaltı', items: 'Yulaf, süt, ceviz' },
  { id: '2', name: 'Öğle', items: 'Izgara tavuk, bulgur pilavı, yoğurt' },
  { id: '3', name: 'Akşam', items: 'Sebze çorbası, salata' },
];

const NutritionScreen: React.FC = () => {
  const [water, setWater] = useState(5); // örnek: 5 bardak

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Beslenme & Su Takibi</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Su Tüketimi</Text>
          <View style={styles.waterRow}>
            {[...Array(water)].map((_, i) => (
              <Text key={i} style={styles.waterIcon}>💧</Text>
            ))}
            <Text style={styles.waterText}>{water} bardak</Text>
          </View>
          <TouchableOpacity style={styles.addButton} disabled>
            <Text style={styles.addButtonText}>+ Su Ekle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yemek Listesi</Text>
          <FlatList
            data={mockMeals}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.mealCard}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealItems}>{item.items}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 12 }}
          />
          <TouchableOpacity style={styles.addButton} disabled>
            <Text style={styles.addButtonText}>+ Yemek Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1976D2', marginBottom: 24, alignSelf: 'center', letterSpacing: 0.5 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#222', marginBottom: 12 },
  waterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  waterIcon: { fontSize: 28, marginRight: 2 },
  waterText: { fontSize: 16, color: '#1976D2', fontWeight: '600', marginLeft: 8 },
  addButton: { marginTop: 8, backgroundColor: '#1976D2', borderRadius: 10, paddingVertical: 12, alignItems: 'center', opacity: 0.8 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mealCard: { backgroundColor: '#F5F5F5', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  mealName: { fontSize: 15, fontWeight: '700', color: '#1976D2', marginBottom: 4 },
  mealItems: { fontSize: 15, color: '#444' },
});

export default NutritionScreen; 