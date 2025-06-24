import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Appointment {
  id: string;
  name: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
}

const CalendarScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Tarih ve saat formatlama
  const formatDate = (date: Date) => date.toISOString().slice(0, 10);
  const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

  const handleAddAppointment = () => {
    if (!newName) return;
    setAppointments([
      ...appointments,
      {
        id: Date.now().toString(),
        name: newName,
        date: formatDate(date),
        time: formatTime(date),
      },
    ]);
    setModalVisible(false);
    setNewName('');
    setDate(new Date());
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Takvim & Randevular</Text>
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.icon}>📅</Text>
              <View style={styles.infoBox}>
                <Text style={styles.appName}>{item.name}</Text>
                <View style={styles.row}>
                  <View style={styles.dateBox}><Text style={styles.date}>{item.date}</Text></View>
                  <View style={styles.timeBox}><Text style={styles.time}>{item.time}</Text></View>
                </View>
              </View>
              <View style={styles.actionIcons}>
                {/* Düzenleme için ileride eklenebilir */}
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: '#888', alignSelf: 'center', marginTop: 40 }}>Henüz randevu yok.</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Randevu Ekle</Text>
      </TouchableOpacity>
      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Randevu Ekle</Text>
            <TextInput
              style={styles.input}
              placeholder="Randevu adı"
              value={newName}
              onChangeText={setNewName}
            />
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
                onChange={(_: any, selectedDate?: Date) => {
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
                onChange={(_: any, selectedTime?: Date) => {
                  setShowTimePicker(false);
                  if (selectedTime) setDate(new Date(date.setHours(selectedTime.getHours(), selectedTime.getMinutes())));
                }}
              />
            )}
            <TouchableOpacity style={styles.saveButton} onPress={handleAddAppointment}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingBottom: 0 },
  title: { fontSize: 24, fontWeight: '700', color: '#1976D2', marginBottom: 24, alignSelf: 'center', letterSpacing: 0.5 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 20, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  icon: { fontSize: 28, marginRight: 16 },
  infoBox: { flex: 1 },
  appName: { fontSize: 17, fontWeight: '600', color: '#222', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dateBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  date: { fontSize: 15, color: '#1976D2', fontWeight: '500' },
  timeBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  time: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
  actionIcons: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  actionIcon: { fontSize: 18, color: '#D32F2F', marginLeft: 8 },
  addButton: { position: 'absolute', left: 24, right: 24, bottom: 24, backgroundColor: '#1976D2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', opacity: 0.9, elevation: 4 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 18, padding: 22, width: '90%', maxWidth: 400, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1976D2', marginBottom: 18, alignSelf: 'center' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 14, color: '#222' },
  pickerButton: { backgroundColor: '#E3EAFD', borderRadius: 8, padding: 10, marginBottom: 10, alignItems: 'center' },
  pickerButtonText: { color: '#1976D2', fontWeight: '600', fontSize: 15 },
  saveButton: { backgroundColor: '#1976D2', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  cancelButton: { backgroundColor: '#eee', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  cancelButtonText: { color: '#888', fontSize: 15, fontWeight: '600' },
});

export default CalendarScreen; 