import { useState } from 'react';
import { apiLogin } from '../../core/services/apiService'; // API servisini import et

export const useLoginViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(email, password);
      console.log('Giriş başarılı:', data); // Gelen veriyi (token vs.) burada yönetebilirsin
      // Örneğin, token'ı kaydet ve ana ekrana yönlendir.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}; 