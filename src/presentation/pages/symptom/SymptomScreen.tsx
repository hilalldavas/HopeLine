import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const severityEmojis = ['😃', '🙂', '😐', '😕', '😫'];

interface Symptom {
  id: string;
  name: string;
  severity: number; // 1-5
  date: string; // yyyy-MM-dd
  note: string;
}

const SymptomScreen: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSeverity, setNewSeverity] = useState(3);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newNote, setNewNote] = useState('');

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const handleAddSymptom = () => {
    if (!newName) return;
    setSymptoms([
      ...symptoms,
      {
        id: Date.now().toString(),
        name: newName,
        severity: newSeverity,
        date: formatDate(date),
        note: newNote,
      },
    ]);
    setModalVisible(false);
    setNewName('');
    setNewSeverity(3);
    setDate(new Date());
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Belirti Takibi</Text>
        <FlatList
          data={symptoms}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.icon}>📝</Text>
              <View style={styles.infoBox}>
                <Text style={styles.symptomName}>{item.name}</Text>
                <View style={styles.row}>
                  <View style={styles.severityBox}>
                    <Text style={styles.severity}>{severityEmojis[item.severity - 1]} {item.severity}/5</Text>
                  </View>
                  <View style={styles.dateBox}><Text style={styles.date}>{item.date}</Text></View>
                </View>
                <Text style={styles.note}>{item.note}</Text>
              </View>
              <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: '#888', alignSelf: 'center', marginTop: 40 }}>Henüz belirti yok.</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Belirti Ekle</Text>
      </TouchableOpacity>
      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Belirti Ekle</Text>
            <TextInput
              style={styles.input}
              placeholder="Belirti adı"
              value={newName}
              onChangeText={setNewName}
            />
            <View style={styles.severityRow}>
              {severityEmojis.map((emoji, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.severityButton, newSeverity === idx + 1 && styles.severityButtonSelected]}
                  onPress={() => setNewSeverity(idx + 1)}
                >
                  <Text style={styles.severityEmoji}>{emoji}</Text>
                  <Text style={[styles.severityLabel, newSeverity === idx + 1 && styles.severityLabelSelected]}>{idx + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.pickerButtonText}>Tarih Seç: {formatDate(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_: any, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
            <TextInput
              style={[styles.input, { minHeight: 50 }]}
              placeholder="Açıklama / Not (isteğe bağlı)"
              value={newNote}
              onChangeText={setNewNote}
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddSymptom}>
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
  card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F5F5F5', borderRadius: 20, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  icon: { fontSize: 28, marginRight: 16, marginTop: 4 },
  infoBox: { flex: 1 },
  symptomName: { fontSize: 17, fontWeight: '600', color: '#222', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  severityBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  severity: { fontSize: 15, color: '#1976D2', fontWeight: '500' },
  dateBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  date: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
  note: { fontSize: 14, color: '#666', marginTop: 6 },
  actionIcons: { flexDirection: 'row', alignItems: 'center', marginLeft: 12, marginTop: 4 },
  actionIcon: { fontSize: 18, color: '#D32F2F', marginLeft: 8 },
  addButton: { position: 'absolute', left: 24, right: 24, bottom: 24, backgroundColor: '#1976D2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', opacity: 0.9, elevation: 4 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 18, padding: 22, width: '90%', maxWidth: 400, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1976D2', marginBottom: 18, alignSelf: 'center' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 14, color: '#222' },
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 },
  severityButton: { alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: '#F5F5F5', flex: 1, marginHorizontal: 2 },
  severityButtonSelected: { backgroundColor: '#E3EAFD', borderWidth: 2, borderColor: '#1976D2' },
  severityEmoji: { fontSize: 28 },
  severityLabel: { fontSize: 13, color: '#444', marginTop: 4 },
  severityLabelSelected: { color: '#1976D2', fontWeight: '700' },
  pickerButton: { backgroundColor: '#E3EAFD', borderRadius: 8, padding: 10, marginBottom: 10, alignItems: 'center' },
  pickerButtonText: { color: '#1976D2', fontWeight: '600', fontSize: 15 },
  saveButton: { backgroundColor: '#1976D2', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  cancelButton: { backgroundColor: '#eee', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  cancelButtonText: { color: '#888', fontSize: 15, fontWeight: '600' },
});

export default SymptomScreen; 