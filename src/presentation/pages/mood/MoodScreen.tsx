import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, FlatList } from 'react-native';

const moods = [
  { key: 'very_happy', emoji: '😃', label: 'Çok İyi' },
  { key: 'happy', emoji: '🙂', label: 'İyi' },
  { key: 'neutral', emoji: '😐', label: 'Normal' },
  { key: 'sad', emoji: '😕', label: 'Kötü' },
  { key: 'very_sad', emoji: '😫', label: 'Çok Kötü' },
];

interface MoodEntry {
  id: string;
  moodKey: string;
  note: string;
  date: string; // yyyy-MM-dd
}

const MoodScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const today = new Date().toISOString().slice(0, 10);

  const handleSave = () => {
    if (!selectedMood) return;
    setMoodEntries([
      ...moodEntries,
      {
        id: Date.now().toString(),
        moodKey: selectedMood,
        note,
        date: today,
      },
    ]);
    setSelectedMood(null);
    setNote('');
  };

  const handleDelete = (id: string) => {
    setMoodEntries(moodEntries.filter(m => m.id !== id));
  };

  const getMood = (key: string) => moods.find(m => m.key === key);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Duygu Durumu</Text>
        <Text style={styles.subtitle}>Bugünkü ruh halini seç:</Text>
        <View style={styles.moodRow}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.key}
              style={[styles.moodButton, selectedMood === mood.key && styles.moodButtonSelected]}
              onPress={() => setSelectedMood(mood.key)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, selectedMood === mood.key && styles.moodLabelSelected]}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subtitle}>Kısa bir not ekle (isteğe bağlı):</Text>
        <TextInput
          style={styles.input}
          placeholder="Bugün kendini nasıl hissediyorsun?"
          value={note}
          onChangeText={setNote}
          multiline
        />
        <TouchableOpacity style={[styles.saveButton, !selectedMood && { opacity: 0.5 }]} onPress={handleSave} disabled={!selectedMood}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
        <Text style={styles.listTitle}>Kayıtlı Duygu Durumları</Text>
        <FlatList
          data={moodEntries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const mood = getMood(item.moodKey);
            return (
              <View style={styles.entryCard}>
                <Text style={styles.entryEmoji}>{mood?.emoji}</Text>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryLabel}>{mood?.label}</Text>
                  <Text style={styles.entryDate}>{item.date}</Text>
                  {item.note ? <Text style={styles.entryNote}>{item.note}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteBtn}>🗑️</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={{ color: '#888', alignSelf: 'center', marginTop: 24 }}>Henüz kayıt yok.</Text>}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1976D2', marginBottom: 18, alignSelf: 'center', letterSpacing: 0.5 },
  subtitle: { fontSize: 16, color: '#444', marginBottom: 10, marginTop: 10 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, marginTop: 8 },
  moodButton: { alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: '#F5F5F5', flex: 1, marginHorizontal: 4 },
  moodButtonSelected: { backgroundColor: '#E3EAFD', borderWidth: 2, borderColor: '#1976D2' },
  moodEmoji: { fontSize: 32 },
  moodLabel: { fontSize: 13, color: '#444', marginTop: 4 },
  moodLabelSelected: { color: '#1976D2', fontWeight: '700' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, fontSize: 15, minHeight: 60, marginBottom: 18, marginTop: 4, color: '#222' },
  saveButton: { backgroundColor: '#1976D2', borderRadius: 10, paddingVertical: 14, alignItems: 'center', opacity: 0.8 },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#1976D2', marginTop: 24, marginBottom: 10 },
  entryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 14, padding: 12, marginBottom: 10 },
  entryEmoji: { fontSize: 28, marginRight: 12 },
  entryInfo: { flex: 1 },
  entryLabel: { fontSize: 15, fontWeight: '700', color: '#1976D2' },
  entryDate: { fontSize: 12, color: '#888', marginBottom: 2 },
  entryNote: { fontSize: 14, color: '#444' },
  deleteBtn: { fontSize: 18, color: '#D32F2F', marginLeft: 8 },
});

export default MoodScreen; 