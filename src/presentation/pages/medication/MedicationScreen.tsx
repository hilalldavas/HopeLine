import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import allDrugs from '../../../data/oncologydrugdata.json';

interface Drug {
  id: string;
  name: string;
  dose: string;
  time: string;
  etkenMadde?: string;
}

const MedicationScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filteredDrugs, setFilteredDrugs] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<any | null>(null);
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [userDrugs, setUserDrugs] = useState<Drug[]>([]);

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
        id: Date.now().toString(),  // id'yi benzersiz tutmaya devam et
        name: selectedDrug["ÜRÜN ADI"],
        dose,
        time,
        etkenMadde: selectedDrug["ETKEN MADDE"]
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
              <TouchableOpacity style={[styles.addButton, !(selectedDrug && dose && time) && { opacity: 0.5 }]} onPress={addDrug} disabled={!(selectedDrug && dose && time)}>
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Text style={styles.sectionTitle}>İlaçlarım</Text>
        <FlatList
          data={userDrugs}
          keyExtractor={item => item.id} // keyExtractor kullanarak benzersiz ID sağladık
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
              </View>
            </View>
          )}
          ListEmptyComponent={<View style={styles.emptyBox}><Text style={styles.emptyText}>Henüz ilaç eklenmedi.</Text></View>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
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
});

export default MedicationScreen;
