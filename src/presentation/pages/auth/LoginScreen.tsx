import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useLoginViewModel } from '../../viewmodels/useLoginViewModel';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const { login, loading, error } = useLoginViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Giriş Yap</Text>
      <CustomInput
        label="E-posta"
        placeholder="E-posta adresinizi girin"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomInput
        label="Şifre"
        placeholder="Şifrenizi girin"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <CustomButton
        title={loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        onPress={() => login(email, password)}
        disabled={loading}
      />
      <TouchableOpacity onPress={onRegister} style={styles.linkContainer}>
        <Text style={styles.linkText}>Hesabın yok mu? <Text style={{ fontWeight: 'bold' }}>Kayıt Ol</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    alignSelf: 'center',
    color: '#222',
  },
  error: {
    color: '#e53935',
    marginBottom: 8,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#1976D2',
    fontSize: 15,
  },
});

export default LoginScreen;