import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';


// ÖNEMLİ: Kendi geçerli Google Gemini API anahtarınızı buraya yapıştırın.
// Bu anahtar, kota sorunları yaşayabileceğiniz anahtardır.
// Google Cloud Console'da faturalandırmayı etkinleştirdiğinizden emin olun.
const API_KEY = 'AIzaSyD_CBfMy5KmnVi14hCUaO5l9AEbO4BWRkY'; 

interface Message {
  text: string;
  isUser: boolean;
}

// AI İstemcisini yalnızca bir kez başlatmak için component dışında tanımlıyoruz.
// Bu, gereksiz yeniden oluşturmaları önler ve hataları daha iyi yönetir.
let genAI: GoogleGenerativeAI | null = null;
let initializationError: Error | null = null;

try {
  if (!API_KEY) {
    throw new Error('API anahtarı eksik veya geçersiz. Lütfen Chatbox.tsx dosyasındaki API_KEY değişkenini güncelleyin.');
  }
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (e: any) {
  initializationError = e;
}

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Başlatma sırasında bir hata oluştuysa, component yüklendiğinde uyar.
    if (initializationError) {
        Alert.alert('Yapılandırma Hatası', initializationError.message, [{ text: 'Tamam' }]);
    }
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const generateResponse = async (userMessage: string) => {
    if (!genAI) {
        Alert.alert('Hata', 'AI istemcisi başlatılamadı. Lütfen API anahtarını kontrol edin.', [{ text: 'Tamam' }]);
        return;
    }
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro-latest',
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
      });

      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.2,
        },
      });

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

      if (!text) throw new Error('AI yanıtı boş geldi.');
      
      let parsedResponse;
      try {
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResponse = JSON.parse(cleanedText);
        if (!parsedResponse.responseText) throw new Error("Gelen JSON formatı hatalı.");
      } catch (e) {
        console.error("JSON parse hatası:", text, e);
        parsedResponse = { responseText: `Yanıt işlenemedi: ${text}`, identifiedSymptom: null, isUrgent: false };
      }

      setMessages(prev => [...prev, { text: parsedResponse.responseText, isUser: false }]);

      if (parsedResponse.isUrgent) {
        Alert.alert('Acil Durum Uyarısı!', 'Belirtileriniz acil olabilir. Lütfen derhal doktorunuzla iletişime geçin.');
      }
      
    } catch (error: any) {
      console.error('Hata:', error);
      let errorMessage = 'Üzgünüm, bir hata oluştu. ';
      if (error.message?.includes('API key not valid')) errorMessage += 'API anahtarı geçersiz.';
      else if (error.message?.includes('quota')) errorMessage += 'API kotası doldu.';
      else errorMessage += error.message;

      Alert.alert('Hata', errorMessage, [{ text: 'Tamam' }]);
      setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);

    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      generateResponse(inputText);
    }
  };

  // Başlatma hatası varsa, butonu hiç gösterme veya devre dışı bırak
  if (initializationError) {
      return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Akıllı Asistan kullanılamıyor: API hatası.</Text>
          </View>
      );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.chatContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Akıllı Asistan</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContentContainer}>
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  <Text style={message.isUser ? styles.userMessageText : styles.aiMessageText}>{message.text}</Text>
                </View>
              ))}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#666" />
                  <Text style={styles.loadingText}>Düşünüyor...</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Belirtilerinizi veya sorunuzu yazın..."
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.disabledButton]}
                onPress={handleSend}
                disabled={isLoading}
              >
                <Text style={styles.sendButtonText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatButtonText: {
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  chatContainer: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get('window').height * 0.8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#999',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContentContainer: {
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userMessageText: {
    fontSize: 16,
    color: 'white',
  },
  aiMessageText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a9a9a9',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#fdd',
    padding: 10,
    borderRadius: 10,
    elevation: 10
  },
  errorText: {
    color: '#f00',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ChatBox;
