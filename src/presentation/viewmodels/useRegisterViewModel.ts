import { useState } from 'react';
import { apiRegister } from '../../core/services/apiService'; // API servisini import et

export const useRegisterViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRegister(name, email, password);
      console.log('Kayıt başarılı:', data);
      // Başarılı kayıt sonrası kullanıcıyı bilgilendirip login ekranına yönlendirebilirsin.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
}; 