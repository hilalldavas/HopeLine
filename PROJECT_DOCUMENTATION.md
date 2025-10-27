# HopeLineProject Dokümantasyonu

## 1. Proje Hakkında
HopeLineProject, kanser hastalarının tedavi süreçlerini kolaylaştırmak ve sağlık takibini dijitalleştirmek amacıyla geliştirilmiş bir mobil uygulamadır. Kullanıcılar; ilaç takibi, semptom, ruh hali, beslenme, randevu ve raporlama gibi birçok sağlık verisini kolayca kaydedebilir ve takip edebilir. Ayrıca, entegre yapay zeka asistanı ile anlık destek alabilirler.

## 2. Kullanılan Teknolojiler
- **React Native**: Mobil uygulama geliştirme
- **TypeScript**: Tip güvenliği için
- **@google/generative-ai**: Yapay zeka asistanı (Gemini API)
- **react-native-calendars**: Takvim ve randevu yönetimi
- **Victory Native**: Grafik ve veri görselleştirme
- **AsyncStorage**: Lokal veri saklama
- **Jest**: Test altyapısı
- **Diğerleri**: react-navigation, reanimated, animatable, svg, html-to-pdf vb.

## 3. Klasör ve Dosya Yapısı
```
HopeLineProject/
├── src/
│   ├── assets/           # Görseller ve statik dosyalar
│   ├── core/             # Tema, sabitler, servisler
│   ├── data/             # Modeller, veri kaynakları, repository'ler
│   ├── domain/           # Entity ve use-case'ler
│   ├── presentation/     # Ekranlar, component'ler, viewmodel'ler
│   │   ├── components/   # CustomButton, CustomInput, Chatbox vb.
│   │   └── pages/        # auth, dashboard, medication, profile vb.
│   ├── services/         # Harici servisler (ör: geminiService)
│   └── types/            # Tip tanımları
├── App.tsx               # Uygulama giriş noktası
├── package.json          # Bağımlılıklar
├── ...                   # Diğer config ve platform dosyaları
```

## 4. Kurulum ve Çalıştırma
1. **Projeyi klonlayın:**
   ```bash
   git clone <repo-url>
   cd HopeLineProject
   ```
2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   # veya
   yarn install
   ```
3. **iOS için pod yükleyin:**
   ```bash
   cd ios && pod install && cd ..
   ```
4. **Projeyi başlatın:**
   - Android: `npm run android`
   - iOS: `npm run ios`

## 5. Temel Özellikler
### 5.1. Giriş/Kayıt
- Kullanıcılar e-posta ve şifre ile kayıt olabilir ve giriş yapabilir.

### 5.2. Ana Sayfa (Dashboard)
- Kullanıcıya özet sağlık verileri ve hızlı erişim sunar.

### 5.3. İlaç Takibi
- Kullanıcılar ilaçlarını takvim üzerinden gün gün ekleyebilir.
- İlaç eklerken otomatik arama, doz ve etken madde desteği vardır.
- Eklenen ilaçlar modern kartlarda, etken madde ve doz bilgisiyle gösterilir.

### 5.4. Takvim & Randevu
- Kullanıcılar randevularını takvimde görebilir ve yeni randevu ekleyebilir.
- Randevu ekleme, silme ve gün bazlı listeleme desteği vardır.

### 5.5. Semptom, Ruh Hali, Beslenme, Raporlama
- Her biri için ayrı ekranlar ve veri giriş formları bulunur.
- Kullanıcılar günlük sağlık durumlarını kaydedebilir.

### 5.6. Profil
- Kullanıcı bilgileri görüntülenir ve düzenlenebilir.
- Profil fotoğrafı, isim, e-posta, tanı tarihi, tedavi süreci ve doktor bilgisi yer alır.

### 5.7. Akıllı Asistan (Chatbox)
- Kullanıcılar sağlıkla ilgili sorularını yazabilir.
- Google Gemini API ile Türkçe, empatik ve yapılandırılmış yanıtlar alınır.
- Acil durumlarda uyarı verir.

## 6. Örnek Kod Parçaları
### İlaç Ekleme Fonksiyonu
```ts
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
```

### Chatbox Kullanımı
```ts
const generateResponse = async (userMessage: string) => {
  // ...
  const prompt = `
    Context: You are an AI assistant in a health app for cancer patients. Your role is to analyze user input and provide a structured JSON response in Turkish.
    Patient's input: "${userMessage}"
    Output Format:
    Return ONLY a valid JSON object with this structure:
    {
      "responseText": "Your empathetic, reassuring response in Turkish.",
      "identifiedSymptom": "The main symptom identified in Turkish, or null.",
      "isUrgent": true if urgent, otherwise false.
    }
  `;
  // ...
};
```

## 7. Geliştirici Notları ve Katkı Sağlama
- Kodda Clean Architecture prensipleri uygulanmıştır.
- Katmanlar arası bağımlılık minimumda tutulmuştur.
- Katkı sağlamak için fork'layıp PR gönderebilirsiniz.
- Sorularınız için proje sahibiyle iletişime geçebilirsiniz.

---

Her türlü katkı ve geri bildirim için teşekkürler! 