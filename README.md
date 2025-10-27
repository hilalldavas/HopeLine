<div align="center">

# 🌟 HopeLine

### A Comprehensive Health Management App for Cancer Patients

[![React Native](https://img.shields.io/badge/React_Native-0.80-blue.svg?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

<div align="center">

### 📱 Choose Language / Dil Seçin

**[🇺🇸 Read in English](#english)** | **[🇹🇷 Türkçe Oku](#turkish)**

---

</div>

---

<div id="english"></div>

## 🇺🇸 English

### 📖 Overview

HopeLine is a comprehensive mobile health application designed to support cancer patients throughout their treatment journey. The app provides tools for medication tracking, symptom monitoring, mood tracking, nutrition management, appointment scheduling, and comprehensive health reporting. It features an integrated AI assistant powered by Google Gemini that provides empathetic support in Turkish.

### ✨ Key Features

#### 🔐 Authentication
- User registration and login
- Email and password authentication
- Secure user sessions

#### 📊 Dashboard
- Overview of health data and quick access to all features
- Personalized health insights
- Quick action buttons

#### 💊 Medication Management
- Calendar-based medication tracking
- Auto-search from oncology drug database
- Dosage and active ingredient information
- Daily medication reminders
- Medication history tracking

#### 📅 Calendar & Appointments
- Visual calendar interface
- Schedule and manage medical appointments
- View appointments by date
- Add, edit, and delete appointments

#### 📝 Symptom Tracking
- Daily symptom logging
- Detailed symptom descriptions
- Symptom history and trends
- Export capabilities

#### 😊 Mood Tracking
- Daily mood monitoring
- Emotional wellness tracking
- Mood patterns and analytics
- Visual representation of emotional journey

#### 🍎 Nutrition Management
- Track daily meals and nutrition
- Nutrition insights
- Meal planning assistance
- Dietary recommendations

#### 📈 Health Reports
- Comprehensive health data visualization
- Export reports in PDF format
- Historical data analysis
- Trend monitoring

#### 👤 Profile Management
- Personal information management
- Profile photo upload
- Diagnosis date tracking
- Treatment progress tracking
- Doctor information management

#### 🤖 AI Assistant (Chatbox)
- 24/7 health support
- Empathetic responses in Turkish
- Structured advice based on symptoms
- Emergency situation alerts
- Powered by Google Gemini AI

### 🛠️ Technology Stack

- **Frontend:** React Native 0.80
- **Language:** TypeScript
- **AI:** Google Gemini API (@google/generative-ai)
- **UI Components:**
  - react-native-calendars (Calendar management)
  - victory-native (Data visualization)
  - react-native-animatable (Animations)
- **Storage:** AsyncStorage
- **Navigation:** Custom state-based navigation
- **Other Libraries:**
  - react-native-reanimated
  - react-native-gesture-handler
  - react-native-svg
  - react-native-html-to-pdf

### 📁 Project Structure

```
HopeLineProject/
├── src/
│   ├── assets/              # Images and static assets
│   ├── core/                # Theme, constants, services
│   ├── data/                # Models, data sources, repositories
│   ├── domain/              # Entities and use-cases
│   ├── presentation/        # Screens, components, viewmodels
│   │   ├── components/      # Reusable UI components
│   │   └── pages/           # Application screens
│   ├── services/            # External services (AI, API)
│   └── types/               # Type definitions
├── App.tsx                   # Application entry point
├── package.json              # Dependencies
└── ...                       # Config and platform files
```

### 🚀 Getting Started

#### Prerequisites

- Node.js >= 18
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Git

#### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd HopeLineProject
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS pods (iOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the application:**
   ```bash
   # Android
npm run android

   # iOS
   npm run ios
   ```

### 📱 Usage

1. **Register/Login:** Create an account or login with your credentials
2. **Dashboard:** Access all features from the main dashboard
3. **Add Medication:** Select a date, search for your medication, add dosage
4. **Track Symptoms:** Log your daily symptoms
5. **Monitor Mood:** Track your emotional wellness
6. **Manage Appointments:** Add and view medical appointments
7. **Generate Reports:** Export your health data
8. **Chat with AI:** Ask health-related questions to the AI assistant

### 🎨 Features Highlight

#### Clean Architecture
The project follows Clean Architecture principles with clear separation of concerns:
- **Presentation Layer:** UI components and screens
- **Domain Layer:** Business logic and entities
- **Data Layer:** Data sources and repositories

#### Beautiful UI/UX
- Modern, clean interface
- Smooth animations
- User-friendly navigation
- Intuitive design

#### Multi-language Support
- Turkish interface
- Turkish AI responses
- Ready for additional languages

### 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### 📄 License

This project is licensed under the MIT License.

---

<div id="turkish"></div>

## 🇹🇷 Türkçe

### 📖 Genel Bakış

HopeLine, kanser hastalarının tedavi sürecini desteklemek için tasarlanmış kapsamlı bir mobil sağlık uygulamasıdır. Uygulama; ilaç takibi, semptom takibi, ruh hali takibi, beslenme yönetimi, randevu planlama ve kapsamlı sağlık raporlama gibi araçlar sunmaktadır. Google Gemini ile güçlendirilmiş entegre yapay zeka asistanı, Türkçe empatik destek sağlar.

### ✨ Temel Özellikler

#### 🔐 Kimlik Doğrulama
- Kullanıcı kaydı ve girişi
- E-posta ve şifre ile kimlik doğrulama
- Güvenli kullanıcı oturumları

#### 📊 Ana Sayfa (Dashboard)
- Sağlık verilerinin özet görünümü
- Tüm özelliklere hızlı erişim
- Kişiselleştirilmiş sağlık içgörüleri

#### 💊 İlaç Takibi
- Takvim tabanlı ilaç takibi
- Onkoloji ilaç veritabanından otomatik arama
- Doz ve etken madde bilgisi
- Günlük ilaç hatırlatıcıları
- İlaç geçmişi takibi

#### 📅 Takvim ve Randevular
- Görsel takvim arayüzü
- Tıbbi randevuları planlama ve yönetme
- Tarihe göre randevu görüntüleme
- Randevu ekleme, düzenleme ve silme

#### 📝 Semptom Takibi
- Günlük semptom kaydı
- Detaylı semptom açıklamaları
- Semptom geçmişi ve trendleri
- Dışa aktarma özelliği

#### 😊 Ruh Hali Takibi
- Günlük ruh hali izleme
- Duygusal sağlık takibi
- Ruh hali desenleri ve analizleri
- Duygusal yolculuğun görsel temsili

#### 🍎 Beslenme Yönetimi
- Günlük yemek ve beslenme takibi
- Beslenme içgörüleri
- Yemek planlama yardımı
- Diyet önerileri

#### 📈 Sağlık Raporları
- Kapsamlı sağlık verisi görselleştirme
- PDF formatında rapor dışa aktarma
- Geçmiş veri analizi
- Trend izleme

#### 👤 Profil Yönetimi
- Kişisel bilgi yönetimi
- Profil fotoğrafı yükleme
- Tanı tarihi takibi
- Tedavi ilerlemesi takibi
- Doktor bilgisi yönetimi

#### 🤖 Yapay Zeka Asistanı (Chatbox)
- 7/24 sağlık desteği
- Türkçe empatik yanıtlar
- Semptomlara dayalı yapılandırılmış tavsiyeler
- Acil durum uyarıları
- Google Gemini AI ile güçlendirilmiş

### 🛠️ Kullanılan Teknolojiler

- **Frontend:** React Native 0.80
- **Programlama Dili:** TypeScript
- **Yapay Zeka:** Google Gemini API (@google/generative-ai)
- **UI Bileşenleri:**
  - react-native-calendars (Takvim yönetimi)
  - victory-native (Veri görselleştirme)
  - react-native-animatable (Animasyonlar)
- **Depolama:** AsyncStorage
- **Navigasyon:** Özel state tabanlı navigasyon
- **Diğer Kütüphaneler:**
  - react-native-reanimated
  - react-native-gesture-handler
  - react-native-svg
  - react-native-html-to-pdf

### 📁 Proje Yapısı

```
HopeLineProject/
├── src/
│   ├── assets/              # Görseller ve statik dosyalar
│   ├── core/                # Tema, sabitler, servisler
│   ├── data/                # Modeller, veri kaynakları, repository'ler
│   ├── domain/              # Entity ve use-case'ler
│   ├── presentation/        # Ekranlar, bileşenler, viewmodel'ler
│   │   ├── components/      # Yeniden kullanılabilir UI bileşenleri
│   │   └── pages/           # Uygulama ekranları
│   ├── services/            # Harici servisler (AI, API)
│   └── types/               # Tip tanımları
├── App.tsx                   # Uygulama giriş noktası
├── package.json              # Bağımlılıklar
└── ...                       # Konfigürasyon ve platform dosyaları
```

### 🚀 Kurulum

#### Ön Gereksinimler

- Node.js >= 18
- React Native geliştirme ortamı
- Android Studio (Android için)
- Xcode (iOS için, yalnızca macOS)
- Git

#### Kurulum Adımları

1. **Depoyu klonlayın:**
   ```bash
   git clone <repository-url>
   cd HopeLineProject
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   # veya
   yarn install
   ```

3. **iOS pod'larını yükleyin (sadece iOS):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Uygulamayı çalıştırın:**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

### 📱 Kullanım

1. **Kayıt/Giriş:** Hesap oluşturun veya giriş yapın
2. **Ana Sayfa:** Tüm özelliklere ana sayfadan erişin
3. **İlaç Ekle:** Tarih seçin, ilacınızı arayın, doz ekleyin
4. **Semptom Takibi:** Günlük semptomlarınızı kaydedin
5. **Ruh Hali İzleme:** Duygusal sağlığınızı takip edin
6. **Randevu Yönetimi:** Tıbbi randevularınızı ekleyin ve görüntüleyin
7. **Rapor Oluştur:** Sağlık verilerinizi dışa aktarın
8. **AI ile Sohbet:** Sağlıkla ilgili sorularınızı yapay zeka asistanına sorun

### 🎨 Özellikler

#### Temiz Mimari
Proje, endişelerin net bir şekilde ayrılmasıyla Clean Architecture prensiplerini takip eder:
- **Sunum Katmanı:** UI bileşenleri ve ekranlar
- **Domain Katmanı:** İş mantığı ve entity'ler
- **Veri Katmanı:** Veri kaynakları ve repository'ler

#### Modern UI/UX
- Modern, temiz arayüz
- Akıcı animasyonlar
- Kullanıcı dostu navigasyon
- Sezgisel tasarım

#### Çoklu Dil Desteği
- Türkçe arayüz
- Türkçe AI yanıtları
- Ek diller için hazır

### 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir Pull Request göndermekten çekinmeyin.

### 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

---

<div align="center">

### 🌟 HopeLine - Bringing Hope to Your Journey

**Made with ❤️ for cancer patients and their families**

[Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues) · [Documentation](./PROJECT_DOCUMENTATION.md)

</div>
