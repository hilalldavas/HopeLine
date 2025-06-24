import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Calendar, LocaleConfig, Agenda } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

// Türkçe takvim ayarları
LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
  monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
  dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  dayNamesShort: ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

interface Appointment {
  id: string;
  name: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
}

interface MarkedDates {
    [key: string]: {
      marked?: boolean;
      dotColor?: string;
      activeOpacity?: number;
      selected?: boolean;
      selectedColor?: string;
    }
}

// AsyncStorage için anahtar
const APPOINTMENTS_STORAGE_KEY = '@HopeLine_Appointments';

const CalendarScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Randevuları Yükle
  const loadAppointments = useCallback(async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (storedAppointments !== null) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (e) {
      Alert.alert('Hata', 'Randevular yüklenirken bir sorun oluştu.');
    }
  }, []);

  // Randevuları Kaydet
  const saveAppointments = useCallback(async (newAppointments: Appointment[]) => {
    try {
      const jsonValue = JSON.stringify(newAppointments);
      await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      Alert.alert('Hata', 'Randevular kaydedilirken bir sorun oluştu.');
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Randevular değiştikçe takvimdeki işaretli günleri güncelle
  useEffect(() => {
    const newMarkedDates: MarkedDates = {};
    appointments.forEach(app => {
      newMarkedDates[app.date] = { marked: true, dotColor: '#1976D2', activeOpacity: 0.7 };
    });
    setMarkedDates(newMarkedDates);
  }, [appointments]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };
  
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

  const handleAddAppointment = async () => {
    if (!newName) return;
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      name: newName,
      date: formatDate(date),
      time: formatTime(date),
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    await saveAppointments(updatedAppointments);

    setModalVisible(false);
    setNewName('');
    setDate(new Date());
  };

  const handleDelete = async (id: string) => {
    const updatedAppointments = appointments.filter(a => a.id !== id);
    setAppointments(updatedAppointments);
    await saveAppointments(updatedAppointments);
  };

  // Seçilen güne ait randevuları filtrele
  const todaysAppointments = appointments
    .filter(a => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animatable.View animation="slideInUp" duration={800} style={styles.container}>
        <Text style={styles.title}>Takvim & Randevular</Text>
        
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
        
        <Text style={styles.listTitle}>{selectedDate} Günü Randevuları</Text>
        <FlatList
          data={todaysAppointments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoBox}>
                <Text style={styles.appName}>{item.name}</Text>
                <View style={styles.timeBox}><Text style={styles.time}>{item.time}</Text></View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyListText}>Seçili gün için randevu yok.</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </Animatable.View>

      <TouchableOpacity style={styles.addButton} onPress={() => { setDate(new Date(selectedDate)); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>+ Randevu Ekle</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Randevu Ekle</Text>
            <TextInput style={styles.input} placeholder="Randevu adı (Örn: Onkoloji Kontrolü)" value={newName} onChangeText={setNewName} />
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.pickerButtonText}>Tarih Seç: {formatDate(date)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.pickerButtonText}>Saat Seç: {formatTime(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(new Date(selectedDate.setHours(date.getHours(), date.getMinutes())));
                }}
              />
            )}
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
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddAppointment}>
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
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: '#1976D2', marginBottom: 16, alignSelf: 'center', paddingTop: 24},
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    padding: 16, 
    marginHorizontal: 16,
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2 
  },
  infoBox: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  appName: { fontSize: 16, fontWeight: '500', color: '#333' },
  timeBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  time: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
  actionIcon: { fontSize: 22, marginLeft: 12 },
  emptyListText: { color: '#888', alignSelf: 'center', marginTop: 40, fontSize: 16 },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1976D2',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1976D2', marginBottom: 24 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerButton: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center'
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333'
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    marginLeft: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: { color: '#555', fontSize: 16, fontWeight: '600' },
});

export default CalendarScreen; 