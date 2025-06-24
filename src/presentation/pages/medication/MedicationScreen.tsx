import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, Modal, Dimensions, Animated, Platform } from 'react-native';
import allDrugs from '../../../data/oncologydrugdata.json';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, LocaleConfig } from 'react-native-calendars';

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

interface Drug {
  id: string;
  name: string;
  dose: string;
  time: string;
  etkenMadde?: string;
  addedAt?: string;
  isActive?: boolean;
}

// Takvim Türkçe ayarları
LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
  monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
  dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  dayNamesShort: ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

const MEDICATIONS_STORAGE_KEY = '@HopeLine_Medications';

const MedicationScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filteredDrugs, setFilteredDrugs] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<any | null>(null);
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [userDrugs, setUserDrugs] = useState<Drug[]>([]);
  const [editDrugId, setEditDrugId] = useState<string | null>(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [modalVisible, setModalVisible] = useState(false);
  const [newDrugName, setNewDrugName] = useState('');
  const [newDose, setNewDose] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    if (search.length > 0) {
      setFilteredDrugs(
        allDrugs.filter((d: any) =>
          (d["ÜRÜN ADI"] || '').toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredDrugs([]);
    }
  }, [search]);

  // İlaçları AsyncStorage'dan yükle/kaydet
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(MEDICATIONS_STORAGE_KEY);
        if (stored) setUserDrugs(JSON.parse(stored));
      } catch {}
    })();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(userDrugs));
  }, [userDrugs]);

  // Takvimde işaretli günler
  useEffect(() => {
    const newMarked: any = {};
    userDrugs.filter(d => d.isActive !== false).forEach(d => {
      if (d.addedAt) {
        const day = d.addedAt.slice(0, 10);
        newMarked[day] = { marked: true, dotColor: '#1976D2', activeOpacity: 0.7 };
      }
    });
    setMarkedDates(newMarked);
  }, [userDrugs]);

  // Seçili günün ilaçları
  const todaysDrugs = userDrugs.filter(d => d.isActive !== false && d.addedAt?.slice(0, 10) === selectedDate);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleAddDrug = () => {
    if (!newDrugName || !newDose || !date) return;
    setUserDrugs([
      ...userDrugs,
      {
        id: Date.now().toString(),
        name: newDrugName,
        dose: newDose,
        time: date.toTimeString().slice(0, 5),
        etkenMadde: selectedDrug ? selectedDrug["ETKEN MADDE"] : 'Bilinmiyor',
        addedAt: selectedDate + 'T' + date.toTimeString().slice(0, 5),
        isActive: true,
      },
    ]);
    setModalVisible(false);
    setNewDrugName('');
    setNewDose('');
    setDate(new Date(selectedDate));
    setSelectedDrug(null);
    setSearch('');
  };

  const handleDelete = (id: string) => {
    setUserDrugs(userDrugs.map(drug => drug.id === id ? { ...drug, isActive: false } : drug));
  };

  function formatDateTime(dateString?: string) {
    if (!dateString) return 'Bilgi yok';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Bilgi yok';
    return `${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  function DrugHistoryItem({ item, formatDateTime }: { item: Drug, formatDateTime: (d?: string) => string }) {
    return (
      <View style={styles.historyCard}>
        <Text style={styles.historyName}>{item.name}</Text>
        <Text style={styles.historyInfo}>Doz: {item.dose}  |  Saat: {item.time}</Text>
        <Text style={styles.historyDate}>Eklenme: {formatDateTime(item.addedAt)}</Text>
        {item.isActive === false && (
          <Text style={styles.deletedLabel}>Silindi</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackgroundAnimation />
      <Animatable.View animation="slideInUp" duration={800} style={styles.container}>
        <Text style={styles.title}>İlaç Takibi</Text>
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: { ...markedDates[selectedDate], selected: true, selectedColor: '#1976D2' }
          }}
          theme={{
            arrowColor: '#1976D2',
            todayTextColor: '#1976D2',
            selectedDayBackgroundColor: '#1976D2',
          }}
          style={styles.calendar}
        />
        <Text style={styles.listTitle}>{selectedDate} Günü İlaçları</Text>
        <FlatList
          data={todaysDrugs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoBox}>
                <Text style={styles.appName}>{item.name}</Text>
                <View style={styles.timeBox}><Text style={styles.time}>{item.time}</Text></View>
                <View style={styles.metaRow}>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>Etken Madde:</Text>
                    <Text style={styles.metaValue}>{item.etkenMadde || 'Bilinmiyor'}</Text>
                  </View>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>Doz:</Text>
                    <Text style={styles.metaValue}>{item.dose}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyListText}>Seçili gün için ilaç yok.</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </Animatable.View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedDrug(null);
          setSearch('');
          setNewDrugName('');
          setNewDose('');
          setDate(new Date(selectedDate));
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ İlaç Ekle</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>İlaç Ekle</Text>
            <TextInput
              style={styles.input}
              placeholder="İlaç adı ara..."
              value={search}
              onChangeText={text => {
                setSearch(text);
                setSelectedDrug(null);
                setNewDrugName('');
                setNewDose('');
              }}
            />
            {search.length > 0 && !selectedDrug && (
              <View style={styles.autocompleteBox}>
                {filteredDrugs.slice(0, 3).map(drug => (
                  <TouchableOpacity
                    key={drug.BARKOD}
                    onPress={() => {
                      setSelectedDrug(drug);
                      setNewDrugName(drug["ÜRÜN ADI"] || '');
                      setNewDose(drug["DOZ MİKTARI"] || 'Bilinmiyor');
                      setSearch(drug["ÜRÜN ADI"] || '');
                    }}
                    style={styles.autocompleteItem}
                  >
                    <Text style={styles.autocompleteDrugName}>{(drug["ÜRÜN ADI"] || '').trim()}</Text>
                    <Text style={styles.autocompleteEtken}>Etken Madde: {drug["ETKEN MADDE"] || 'Bilinmiyor'}</Text>
                  </TouchableOpacity>
                ))}
                {filteredDrugs.length > 3 && (
                  <Text style={{fontSize:10, color:'#aaa', textAlign:'center', marginTop:2, marginBottom:2}}>Daha fazla sonuç için aramaya devam edin...</Text>
                )}
                {filteredDrugs.length === 0 && <Text style={styles.noResult}>Sonuç yok</Text>}
              </View>
            )}
            {selectedDrug && (
              <TextInput
                style={[styles.input, { color: '#1976D2' }]}
                value={selectedDrug["ETKEN MADDE"] || 'Bilinmiyor'}
                editable={false}
                placeholder="Etken Madde"
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Doz (örn. 500mg)"
              value={newDose}
              onChangeText={setNewDose}
              editable={true}
            />
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.pickerButtonText}>Saat Seç: {date.toTimeString().slice(0, 5)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setDate(new Date(date.setHours(selectedTime.getHours(), selectedTime.getMinutes())));
                }}
              />
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddDrug}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1976D2', marginBottom: 22, alignSelf: 'center', letterSpacing: 0.5 },
  addPanel: { backgroundColor: '#F5F5F5', borderRadius: 18, padding: 18, marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  panelTitle: { fontSize: 18, fontWeight: '700', color: '#1976D2', marginBottom: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  autocompleteBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    paddingVertical: 2,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  autocompleteItem: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafbfc',
    marginBottom: 2,
    borderRadius: 6,
  },
  autocompleteContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  autocompleteDrugName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1976D2',
  },
  autocompleteInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  autocompleteEtiket: {
    fontWeight: '600',
    color: '#888',
    fontSize: 12,
  },
  autocompleteValue: {
    color: '#444',
    fontSize: 12,
    marginLeft: 2,
  },
  noResult: { padding: 10, color: '#888' },
  clearDrug: { marginLeft: 8, backgroundColor: '#E3EAFD', borderRadius: 8, padding: 6 },
  etkenBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 2 },
  etkenLabel: { fontSize: 14, color: '#1976D2', fontWeight: '600', marginRight: 4 },
  etkenValue: { fontSize: 14, color: '#444', fontWeight: '500' },
  addButton: {
    backgroundColor: '#1976D2',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 12,
    width: '80%',
    alignSelf: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  cardIcon: { fontSize: 28, marginRight: 14 },
  cardInfoBox: { flex: 1 },
  medName: { fontSize: 16, fontWeight: '700', color: '#1976D2', marginBottom: 2 },
  etkenList: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  doseBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  dose: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  timeBox: {
    backgroundColor: '#F0F4FA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  emptyBox: { backgroundColor: '#F5F5F5', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 12 },
  emptyText: { color: '#888', fontSize: 15 },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  historyCard: {
    backgroundColor: '#F3F8E8',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  historyName: {
    fontWeight: '700',
    color: '#2E7D32',
    fontSize: 16,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  historyInfo: {
    color: '#4B4B4B',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  historyDate: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
    alignSelf: 'flex-end',
  },
  historyButton: {
    backgroundColor: '#1976D2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1976D2',
    marginBottom: 18,
    alignSelf: 'center',
  },
  closeModalButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: 15,
  },
  deletedLabel: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 13,
    marginTop: 6,
    alignSelf: 'flex-end',
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  calendar: {
    marginBottom: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 14,
  },
  infoBox: { flex: 1 },
  appName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 2,
  },
  actionIcon: {
    fontSize: 22,
    color: '#90A4AE',
    marginLeft: 10,
  },
  emptyListText: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 100,
  },
  pickerButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  pickerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  autocompleteEtken: {
    fontSize: 11,
    color: '#888',
  },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  metaBox: { backgroundColor: '#F5F5F5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6 },
  metaLabel: { fontSize: 10, color: '#888', fontWeight: 'bold' },
  metaValue: { fontSize: 11, color: '#444', fontWeight: '500' },
});

export default MedicationScreen;
