import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, error, style, ...props }) => (
  <View style={{ marginBottom: 16 }}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={[styles.input, style, error && styles.inputError]}
      placeholderTextColor="#aaa"
      {...props}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: '#333',
    fontWeight: '500',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
  inputError: {
    borderColor: '#e53935',
  },
  error: {
    color: '#e53935',
    marginTop: 4,
    fontSize: 13,
  },
});

export default CustomInput; 