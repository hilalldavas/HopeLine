// Basit bir mock ilaç veri kaynağı
export interface Medication {
  id: string;
  name: string;
  dose: string;
  time: string;
}

const mockMedications: Medication[] = [
  { id: '1', name: 'Parol', dose: '500mg', time: '08:00' },
  { id: '2', name: 'Aferin', dose: '1 tablet', time: '20:00' },
];

export const getMedications = async (): Promise<Medication[]> => {
  // Gerçek uygulamada burada API çağrısı olur
  return Promise.resolve(mockMedications);
}; 