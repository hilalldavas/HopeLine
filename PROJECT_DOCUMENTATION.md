# HopeLine Projesi Teknik Dokümantasyonu

Bu doküman, HopeLine projesinin teknik yapısı, mimarisi, özellikleri ve kurulum adımları hakkında detaylı bilgi sağlamak amacıyla oluşturulmuştur.

## 1. Proje Hakkında

HopeLine, kanser hastalarının tedavi süreçlerini kolaylaştırmayı hedefleyen bir mobil sağlık uygulamasıdır. Kullanıcıların ilaç takibi, semptom yönetimi, ruh hali ve beslenme takibi gibi önemli sağlık verilerini kaydetmelerine ve bu verileri raporlamalarına olanak tanır. Ayrıca, entegre yapay zeka asistanı ile kullanıcılara anlık destek sunar.

## 2. Teknoloji Yığını

Proje, modern ve yaygın olarak kullanılan teknolojiler üzerine kurulmuştur:

- **Platform:** React Native
- **Dil:** TypeScript
- **Yapay Zeka:** Google Gemini (`@google/generative-ai`)
- **UI Kütüphaneleri:**
  - `react-native-calendars`: Takvim özellikleri için.
  - `victory-native` & `react-native-svg`: Veri görselleştirme ve grafikler için.
  - `react-native-animatable`: Animasyonlar için.
- **Navigasyon:** Özel state-tabanlı yönlendirme (`App.tsx` içinde).
- **Asenkron Depolama:** `@react-native-async-storage/async-storage`
- **Kod Kalitesi:** ESLint, Prettier
- **Test:** Jest

## 3. Proje Mimarisi

Proje, sürdürülebilir ve ölçeklenebilir bir kod tabanı sağlamak için **Katmanlı Mimari (Layered Architecture)** prensiplerini benimser. Ana kaynak kodu `src/` dizini altında aşağıdaki gibi organize edilmiştir:

```
/src
├── assets/         # Resimler, fontlar gibi statik varlıklar
├── core/           # Uygulama genelindeki temel mantık (tema, sabitler, servisler)
├── data/           # Veri katmanı (veri kaynakları, repolar, modeller)
├── domain/         # İş mantığı katmanı (entity'ler, use case'ler)
├── presentation/   # Sunum katmanı (ekranlar, component'ler, view-model'ler)
│   ├── components/ # Yeniden kullanılabilir UI component'leri (Button, Input, Chatbox)
│   └── pages/      # Uygulama ekranları (Login, Dashboard, Medication vb.)
└── services/       # Üçüncü parti servislerle iletişim (örn: geminiService.ts)
```

Bu yapı, sorumlulukların ayrılmasını (Separation of Concerns) sağlayarak kodun daha okunabilir, yönetilebilir ve test edilebilir olmasına yardımcı olur.

## 4. Kurulum ve Başlatma

Projeyi yerel geliştirme ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone <repository-url>
    cd HopeLineProject
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    # veya
    yarn install
    ```

3.  **iOS için Pod'ları Yükleyin:**
    ```bash
    cd ios && pod install && cd ..
    ```

4.  **Uygulamayı Başlatın:**
    - **Android:**
      ```bash
      npm run android
      ```
    - **iOS:**
      ```bash
      npm run ios
      ```

## 5. Uygulama Akışı ve Navigasyon

Proje, `React Navigation` gibi standart bir kütüphane yerine `App.tsx` dosyasında yönetilen **state tabanlı** özel bir navigasyon yapısı kullanır.

-   **Giriş Durumu (`isLoggedIn`):** Kullanıcının giriş yapıp yapmadığını kontrol eden bir state mevcuttur. Bu state, gösterilecek ekranları belirler (Giriş/Kayıt veya Ana Uygulama).
-   **Ekran Yönlendirme (`renderScreen`):** Bu fonksiyon, `isLoggedIn` ve `activeTab` state'lerine göre hangi ekranın render edileceğine karar verir.
-   **Sekme Çubuğu (`TabBar`):** Kullanıcı giriş yaptığında, ekranın altında `TabBar` componenti belirir ve `activeTab` state'ini güncelleyerek ekranlar arası geçişi sağlar.

**`App.tsx`'den Örnek Kod:**

```javascript
// App.tsx

const App = () => {
  // Aktif sekmeyi ve giriş durumunu yöneten state'ler
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Başlangıçta giriş yapılmış varsayılıyor

  const renderScreen = () => {
    // Eğer giriş yapılmamışsa, login veya register ekranını göster
    if (!isLoggedIn) {
      // ... kimlik doğrulama ekranları
    }

    // Giriş yapılmışsa, aktif sekmeye göre ilgili ekranı göster
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'medication':
        return <MedicationScreen />;
      // ... diğer ekranlar
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {/* Giriş yapılmışsa TabBar'ı göster */}
      {isLoggedIn && (
        <TabBar 
          activeTab={activeTab} 
          onTabPress={setActiveTab} 
        />
      )}
    </SafeAreaView>
  );
};
```

## 6. Öne Çıkan Özellikler ve Modüller

### Akıllı Asistan (Chatbox)

Uygulamanın en önemli özelliklerinden biri, kullanıcılara destek olmak için tasarlanmış yapay zeka tabanlı sohbet kutusudur. Bu component, `src/presentation/components/Chatbox.tsx` dosyasında yer alır ve Google Gemini API'sini kullanır.

**Temel İşleyiş:**

1.  **Başlatma:** Component, `GoogleGenerativeAI` istemcisini `API_KEY` ile başlatır.
2.  **Kullanıcı Girdisi:** Kullanıcı, belirtilerini veya sorusunu metin giriş alanına yazar.
3.  **API İsteği (`generateResponse`):** `Gönder` butonuna basıldığında, kullanıcının mesajı özel bir prompt şablonu ile Gemini API'sine gönderilir. Bu prompt, yapay zekadan belirli bir `JSON` formatında cevap vermesini ister.
4.  **JSON Yanıtı:** API'den gelen yanıt, içerisinde `responseText`, `identifiedSymptom` ve `isUrgent` alanlarını içeren bir JSON nesnesidir.
5.  **Yanıtın İşlenmesi:** Gelen JSON parse edilir. Yanıt metni ekranda gösterilir ve eğer `isUrgent` (acil) durumu `true` ise kullanıcıya bir uyarı gösterilir.

**`Chatbox.tsx`'den Örnek Kod:**

```javascript
// src/presentation/components/Chatbox.tsx

const generateResponse = async (userMessage: string) => {
    // ... (istemci kontrolü)
    try {
      setIsLoading(true);
      // ...

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest', /* ... safety settings */ });
      
      // AI'dan yapısal JSON dönmesini isteyen özel prompt
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

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      // Yanıtı parse et ve state'i güncelle
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResponse = JSON.parse(cleanedText);
      
      setMessages(prev => [...prev, { text: parsedResponse.responseText, isUser: false }]);

      // Acil durum kontrolü
      if (parsedResponse.isUrgent) {
        Alert.alert('Acil Durum Uyarısı!', '...');
      }
      
    } catch (error: any) {
      // ... (hata yönetimi)
    } finally {
      // ...
    }
};
```

### Uygulama Ekranları

Uygulama, `src/presentation/pages/` dizini altında çeşitli modüllere ayrılmış ekranlardan oluşur:

-   **auth:** `LoginScreen`, `RegisterScreen`
-   **dashboard:** `DashboardScreen` (Ana karşılama ekranı)
-   **calendar:** `CalendarScreen` (Randevu ve etkinlik takvimi)
-   **medication:** `MedicationScreen` (İlaç takip ve hatırlatma)
-   **mood:** `MoodScreen` (Ruh hali takibi)
-   **nutrition:** `NutritionScreen` (Beslenme takibi)
-   **profile:** `ProfileScreen` (Kullanıcı profili ve ayarlar)
-   **report:** `ReportScreen` (Sağlık verilerinin raporlanması)
-   **symptom:** `SymptomScreen` (Semptom takibi) 