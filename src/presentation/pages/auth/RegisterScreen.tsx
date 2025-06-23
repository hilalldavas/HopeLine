import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

interface RegisterScreenProps {
  goToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ goToLogin }) => {
  const { register, loading, error } = useRegisterViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Kayıt Ol</Text>
      <CustomInput
        label="İsim"
        placeholder="Adınızı girin"
        value={name}
        onChangeText={setName}
      />
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
        title={loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
        onPress={() => register(name, email, password)}
        disabled={loading}
      />
      <TouchableOpacity onPress={goToLogin} style={styles.linkContainer}>
        <Text style={styles.linkText}>Zaten hesabın var mı? <Text style={{ fontWeight: 'bold' }}>Giriş Yap</Text></Text>
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

export default RegisterScreen; 