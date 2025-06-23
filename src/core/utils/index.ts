// Genel yardımcı fonksiyonlar burada tanımlanır
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
}; 