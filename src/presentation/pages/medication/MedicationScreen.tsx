import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, Modal, Dimensions, Animated } from 'react-native';
import allDrugs from '../../../data/oncologydrugdata.json';
import * as Animatable from 'react-native-animatable';

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

const MedicationScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filteredDrugs, setFilteredDrugs] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<any | null>(null);
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [userDrugs, setUserDrugs] = useState<Drug[]>([]);
  const [editDrugId, setEditDrugId] = useState<string | null>(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

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

  const addDrug = () => {
    if (!selectedDrug || !dose || !time) return;
    setUserDrugs([
      ...userDrugs,
      {
        id: Date.now().toString(),
        name: selectedDrug["ÜRÜN ADI"],
        dose,
        time,
        etkenMadde: selectedDrug["ETKEN MADDE"],
        addedAt: new Date().toISOString(),
        isActive: true,
      },
    ]);
    setSearch('');
    setSelectedDrug(null);
    setDose('');
    setTime('');
  };

  const clearSelectedDrug = () => {
    setSelectedDrug(null);
    setSearch('');
    setDose('');
    setTime('');
  };

  const deleteDrug = (id: string) => {
    setUserDrugs(userDrugs.map(drug =>
      drug.id === id ? { ...drug, isActive: false } : drug
    ));
    if (editDrugId === id) {
      setEditDrugId(null);
      clearSelectedDrug();
    }
  };

  const startEditDrug = (drug: Drug) => {
    setEditDrugId(drug.id);
    setSelectedDrug({
      "ÜRÜN ADI": drug.name,
      "ETKEN MADDE": drug.etkenMadde,
      "DOZ MİKTARI": drug.dose,
    });
    setDose(drug.dose);
    setTime(drug.time);
    setSearch(drug.name);
  };

  const updateDrug = () => {
    if (!selectedDrug || !dose || !time || !editDrugId) return;
    setUserDrugs(userDrugs.map(drug =>
      drug.id === editDrugId
        ? {
            ...drug,
            name: selectedDrug["ÜRÜN ADI"],
            dose,
            time,
            etkenMadde: selectedDrug["ETKEN MADDE"]
          }
        : drug
    ));
    setEditDrugId(null);
    setSearch('');
    setSelectedDrug(null);
    setDose('');
    setTime('');
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
        <View style={styles.addPanel}>
          <Text style={styles.panelTitle}>İlaç Ekle</Text>
          <View style={styles.inputRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="İlaç adı yazın"
                value={selectedDrug ? selectedDrug["ÜRÜN ADI"] : search}
                onChangeText={text => {
                  setSearch(text);
                  setSelectedDrug(null);
                  setDose('');
                }}
                editable={!selectedDrug}
              />
              {search.length > 0 && !selectedDrug && (
                <View style={styles.autocompleteBox}>
                  {filteredDrugs.slice(0, 5).map(drug => (
                    <TouchableOpacity key={drug.BARKOD} onPress={() => {
                      setSelectedDrug(drug);
                      setDose(drug["DOZ MİKTARI"] || '');
                    }} style={styles.autocompleteItem}>
                      <View style={styles.autocompleteContent}>
                        <Text style={styles.autocompleteDrugName}>{(drug["ÜRÜN ADI"] || '').trim()}</Text>
                        <View style={styles.autocompleteInfoRow}>
                          <Text style={styles.autocompleteEtiket}>Etken Madde:</Text>
                          <Text style={styles.autocompleteValue}>{drug["ETKEN MADDE"]}</Text>
                          {drug["DOZ MİKTARI"] && (
                            <>
                              <Text style={styles.autocompleteEtiket}>  |  Doz:</Text>
                              <Text style={styles.autocompleteValue}>{drug["DOZ MİKTARI"]}</Text>
                            </>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {filteredDrugs.length === 0 && <Text style={styles.noResult}>Sonuç yok</Text>}
                </View>
              )}
            </View>
            {selectedDrug && (
              <TouchableOpacity style={styles.clearDrug} onPress={clearSelectedDrug}>
                <Text style={{ fontSize: 18, color: '#1976D2' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          {selectedDrug && (
            <View style={styles.etkenBox}>
              <Text style={styles.etkenLabel}>Etken Madde:</Text>
              <Text style={styles.etkenValue}>{selectedDrug["ETKEN MADDE"]}</Text>
              {selectedDrug["DOZ MİKTARI"] && (
                <Text style={styles.etkenValue}>Doz: {selectedDrug["DOZ MİKTARI"]}</Text>
              )}
            </View>
          )}
          {!(search.length > 0 && !selectedDrug) && (
            <>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 6 }]}
                  placeholder="Doz (örn. 500mg)"
                  value={dose}
                  onChangeText={setDose}
                  editable={!!selectedDrug}
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 6 }]}
                  placeholder="Saat (örn. 08:00) ⏰"
                  value={time}
                  onChangeText={setTime}
                  editable={!!selectedDrug}
                />
              </View>
              {editDrugId ? (
                <TouchableOpacity style={[styles.addButton, !(selectedDrug && dose && time) && { opacity: 0.5 }]} onPress={updateDrug} disabled={!(selectedDrug && dose && time)}>
                  <Text style={styles.addButtonText}>Güncelle</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.addButton, !(selectedDrug && dose && time) && { opacity: 0.5 }]} onPress={addDrug} disabled={!(selectedDrug && dose && time)}>
                  <Text style={styles.addButtonText}>Ekle</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        <Text style={styles.sectionTitle}>İlaçlarım</Text>
        <FlatList
          data={userDrugs.filter(drug => drug.isActive !== false)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardIcon}>💊</Text>
              <View style={styles.cardInfoBox}>
                <Text style={styles.medName}>{item.name}</Text>
                <Text style={styles.etkenList}>Etken Madde: {item.etkenMadde}</Text>
                <View style={styles.cardRow}>
                  <View style={styles.doseBox}><Text style={styles.dose}>{item.dose}</Text></View>
                  <View style={styles.timeBox}><Text style={styles.time}>{item.time}</Text></View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#E3F2FD', marginRight: 8 }]} onPress={() => startEditDrug(item)}>
                    <Text style={{ color: '#1976D2', fontWeight: '700' }}>Düzenle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]} onPress={() => deleteDrug(item.id)}>
                    <Text style={{ color: '#D32F2F', fontWeight: '700' }}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={<View style={styles.emptyBox}><Text style={styles.emptyText}>Henüz ilaç eklenmedi.</Text></View>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
        <TouchableOpacity style={styles.historyButton} onPress={() => setHistoryModalVisible(true)}>
          <Text style={styles.historyButtonText}>Geçmişi Gör</Text>
        </TouchableOpacity>
        <Modal
          visible={historyModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setHistoryModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>İlaç Geçmişi</Text>
              <FlatList
                data={[...userDrugs].sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''))}
                keyExtractor={item => item.id + '_history'}
                renderItem={({ item }) => (
                  <DrugHistoryItem item={item} formatDateTime={formatDateTime} />
                )}
                ListEmptyComponent={<View style={styles.emptyBox}><Text style={styles.emptyText}>Henüz geçmiş yok.</Text></View>}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setHistoryModalVisible(false)}>
                <Text style={styles.closeModalButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Animatable.View>
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
  input: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee', padding: 12, fontSize: 15 },
  autocompleteBox: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginTop: 2, marginBottom: 8, maxHeight: 120 },
  autocompleteItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  autocompleteContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  autocompleteDrugName: {
    fontWeight: '700',
    color: '#1976D2',
    fontSize: 16,
    marginBottom: 4,
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
  addButton: { backgroundColor: '#1976D2', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 18, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  cardIcon: { fontSize: 28, marginRight: 14 },
  cardInfoBox: { flex: 1 },
  medName: { fontSize: 16, fontWeight: '700', color: '#1976D2', marginBottom: 2 },
  etkenList: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  doseBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  dose: { fontSize: 15, color: '#1976D2', fontWeight: '500' },
  timeBox: { backgroundColor: '#E3EAFD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  time: { fontSize: 15, color: '#1976D2', fontWeight: '600' },
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
});

export default MedicationScreen;
