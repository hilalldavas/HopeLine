import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput, Platform, ScrollView, Dimensions, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import yemekler from '../../../data/yemek.json';
import * as Animatable from 'react-native-animatable';

const OGUNLER = ['Kahvaltı', 'Öğle', 'Akşam', 'Ara Öğün'];

interface Meal {
  id: string;
  name: string;
  date: string; // yyyy-MM-dd
  ogun: string;
}

// Animated baloncuklar
const BackgroundAnimation = () => {
  const { width, height } = Dimensions.get('window');
  const bubbles = [
    { left: 0.15, baseSize: 18, color: '#1976D2' },
    { left: 0.28, baseSize: 14, color: '#90CAF9' },
    { left: 0.41, baseSize: 16, color: '#1976D2' },
    { left: 0.54, baseSize: 15, color: '#90CAF9' },
    { left: 0.67, baseSize: 17, color: '#1976D2' },
    { left: 0.80, baseSize: 13, color: '#90CAF9' },
  ];
  const animatedValues = React.useRef(bubbles.map(() => new Animated.Value(0))).current;

  // Her baloncuk için rastgele delay ve duration üreten fonksiyonlar
  const getRandomDuration = () => 15000 + Math.random() * 9000; // 15-24sn arası
  const getRandomDelay = () => Math.random() * 8000; // 0-8sn arası
  const getRandomSize = (base: number) => base + Math.floor(Math.random() * 7) - 3; // +-3px oynama

  React.useEffect(() => {
    bubbles.forEach((b, i) => {
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
      {bubbles.map((b, i) => {
        const top = animatedValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-b.baseSize, height + b.baseSize],
        });
        const size = getRandomSize(b.baseSize);
        return (
          <Animated.View
            key={i}
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

const NutritionScreen: React.FC = () => {
  const [water, setWater] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState('');
  const [filteredMeals, setFilteredMeals] = useState<any[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]); // çoklu seçim
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mealDate, setMealDate] = useState<Date>(new Date());
  const [selectedOgun, setSelectedOgun] = useState(OGUNLER[0]);
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const inputRef = useRef<any>(null);

  // Yemek arama
  React.useEffect(() => {
    if (search.length > 0) {
      setFilteredMeals(
        yemekler.filter((y: any) =>
          (y["Malzeme Adı"] || '').toLowerCase().includes(search.toLowerCase()) &&
          !selectedMeals.some((m) => m["Malzeme Adı"] === y["Malzeme Adı"])
        )
      );
    } else {
      setFilteredMeals([]);
    }
  }, [search, selectedMeals]);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const addMeals = () => {
    if (selectedMeals.length === 0) return;
    setMeals([
      ...meals,
      ...selectedMeals.map((m) => ({
        id: Date.now().toString() + Math.random().toString().slice(2, 8),
        name: m["Malzeme Adı"],
        date: formatDate(mealDate),
        ogun: selectedOgun,
      })),
    ]);
    setSearch('');
    setSelectedMeals([]);
    setMealDate(new Date());
    setSelectedOgun(OGUNLER[0]);
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const removeSelectedMeal = (name: string) => {
    setSelectedMeals(selectedMeals.filter(m => m["Malzeme Adı"] !== name));
  };

  // Gruplama: { '2025-06-24|Öğle': [meal, ...], ... }
  const groupedMeals = meals.reduce((acc: any, meal) => {
    const key = meal.date + '|' + meal.ogun;
    if (!acc[key]) acc[key] = [];
    acc[key].push(meal);
    return acc;
  }, {});
  const groupKeys = Object.keys(groupedMeals).sort((a, b) => b.localeCompare(a));

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackgroundAnimation />
      <Animatable.View animation="slideInUp" duration={800} style={styles.container}>
        <Text style={styles.title}>Beslenme & Su Takibi</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Su Tüketimi</Text>
          <View style={styles.waterRow}>
            {[...Array(water)].map((_, i) => (
              <Text key={i} style={styles.waterIcon}>💧</Text>
            ))}
            <Text style={styles.waterText}>{water} bardak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
            <TouchableOpacity style={styles.waterBtn} onPress={() => setWater(Math.max(0, water - 1))}><Text style={styles.waterBtnText}>-</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waterBtn} onPress={() => setWater(water + 1)}><Text style={styles.waterBtnText}>+</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yemek Listesi</Text>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Yemek ara..."
              value={search}
              onChangeText={text => setSearch(text)}
              editable={selectedMeals.length < 10}
              onLayout={e => setInputLayout(e.nativeEvent.layout)}
            />
          </View>
          {search.length > 0 && (
            <View style={[styles.autocompleteBox, {
              position: 'absolute',
              top: inputLayout.y + inputLayout.height + 4,
              left: inputLayout.x,
              width: inputLayout.width,
              zIndex: 20,
              elevation: 20,
            }]}
            >
              {filteredMeals.slice(0, 5).map((yemek, idx) => (
                <TouchableOpacity key={idx} onPress={() => {
                  setSelectedMeals([...selectedMeals, yemek]);
                  setSearch('');
                }} style={styles.autocompleteItem}>
                  <Text style={styles.autocompleteName}>{yemek["Malzeme Adı"]}</Text>
                </TouchableOpacity>
              ))}
              {filteredMeals.length === 0 && <Text style={styles.noResult}>Sonuç yok</Text>}
            </View>
          )}
          {selectedMeals.length > 0 && (
            <View style={styles.selectedMealsBox}>
              {selectedMeals.map((m, idx) => (
                <View key={idx} style={styles.selectedMealItem}>
                  <Text style={styles.selectedMealName}>{m["Malzeme Adı"]}</Text>
                  <TouchableOpacity onPress={() => removeSelectedMeal(m["Malzeme Adı"]) }>
                    <Text style={styles.removeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          {selectedMeals.length > 0 && (
            <View style={styles.ogunRow}>
              {OGUNLER.map((ogun) => (
                <TouchableOpacity
                  key={ogun}
                  style={[styles.ogunBtn, selectedOgun === ogun && styles.ogunBtnSelected]}
                  onPress={() => setSelectedOgun(ogun)}
                >
                  <Text style={[styles.ogunBtnText, selectedOgun === ogun && styles.ogunBtnTextSelected]}>{ogun}</Text>
                </TouchableOpacity>
              ))}
              </View>
            )}
          {selectedMeals.length > 0 && (
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.pickerButtonText}>Tarih Seç: {formatDate(mealDate)}</Text>
            </TouchableOpacity>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={mealDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_: any, selectedDate?: Date) => {
                setShowDatePicker(false);
                if (selectedDate) setMealDate(selectedDate);
              }}
          />
          )}
          <TouchableOpacity style={[styles.addButton, selectedMeals.length === 0 && { opacity: 0.5 }]} onPress={addMeals} disabled={selectedMeals.length === 0}>
            <Text style={styles.addButtonText}>+ Yemekleri Ekle</Text>
          </TouchableOpacity>
          <ScrollView style={{ marginTop: 10 }} contentContainerStyle={{ paddingBottom: 24 }}>
            {groupKeys.length === 0 ? (
              <Text style={styles.noMealText}>Henüz yemek eklenmedi.</Text>
            ) : (
              groupKeys.map((item) => {
                const [date, ogun] = item.split('|');
                return (
                  <View key={item} style={styles.groupBox}>
                    <Text style={styles.groupTitle}>{date} - {ogun}</Text>
                    {groupedMeals[item].map((meal: Meal) => (
                      <View key={meal.id} style={styles.mealCard}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <TouchableOpacity onPress={() => deleteMeal(meal.id)}>
                          <Text style={styles.deleteBtn}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#1976D2', marginBottom: 28, alignSelf: 'center', letterSpacing: 0.5 },
  section: { marginBottom: 36 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 14 },
  waterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  waterIcon: { fontSize: 32, marginRight: 2 },
  waterText: { fontSize: 18, color: '#1976D2', fontWeight: '700', marginLeft: 8 },
  waterBtn: { backgroundColor: '#E3EAFD', borderRadius: 8, padding: 12, marginHorizontal: 8 },
  waterBtnText: { fontSize: 22, color: '#1976D2', fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee', padding: 14, fontSize: 16, flex: 1 },
  clearBtn: { marginLeft: 8, backgroundColor: '#E3EAFD', borderRadius: 8, padding: 8 },
  autocompleteBox: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#eee', maxHeight: 180, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 12, overflow: 'hidden' },
  autocompleteItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  autocompleteName: { fontSize: 16, color: '#1976D2', fontWeight: '700' },
  noResult: { padding: 12, color: '#888', textAlign: 'center' },
  selectedMealsBox: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  selectedMealItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, marginRight: 7, marginBottom: 7 },
  selectedMealName: { color: '#1976D2', fontWeight: '700', fontSize: 15, marginRight: 5 },
  removeBtn: { color: '#D32F2F', fontSize: 17, fontWeight: '700' },
  ogunRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  ogunBtn: { backgroundColor: '#F5F5F5', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 2 },
  ogunBtnSelected: { backgroundColor: '#1976D2' },
  ogunBtnText: { color: '#1976D2', fontWeight: '700', fontSize: 14 },
  ogunBtnTextSelected: { color: '#fff' },
  pickerButton: { backgroundColor: '#E3EAFD', borderRadius: 8, padding: 10, marginBottom: 10, alignItems: 'center' },
  pickerButtonText: { color: '#1976D2', fontWeight: '600', fontSize: 15 },
  addButton: { marginTop: 10, backgroundColor: '#1976D2', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  groupBox: { marginBottom: 18, backgroundColor: '#F5F5F5', borderRadius: 16, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  groupTitle: { fontSize: 15, fontWeight: '700', color: '#1976D2', marginBottom: 8, marginLeft: 2 },
  mealCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 },
  mealName: { fontSize: 15, fontWeight: '700', color: '#1976D2' },
  deleteBtn: { fontSize: 20, color: '#D32F2F', marginLeft: 8 },
  noMealText: { color: '#888', alignSelf: 'center', marginTop: 18, fontSize: 15 },
});

export default NutritionScreen; 