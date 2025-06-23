import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';

const moods = [
  { key: 'very_happy', emoji: '😃', label: 'Çok İyi' },
  { key: 'happy', emoji: '🙂', label: 'İyi' },
  { key: 'neutral', emoji: '😐', label: 'Normal' },
  { key: 'sad', emoji: '😕', label: 'Kötü' },
  { key: 'very_sad', emoji: '😫', label: 'Çok Kötü' },
];

const MoodScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');

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
        <TouchableOpacity style={styles.saveButton} disabled>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
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
});

export default MoodScreen; 