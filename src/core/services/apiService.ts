const API_BASE_URL = 'https://your-api-url.com/api'; // Burayı kendi API adresinle değiştir

// Login işlemi için API isteği
export const apiLogin = async (email: string, password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Giriş işlemi başarısız.');
  }

  return response.json(); // { token: '...', user: {...} } gibi bir veri dönebilir
};

// Register işlemi için API isteği
export const apiRegister = async (name: string, email: string, password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Kayıt işlemi başarısız.');
  }

  return response.json();
};

// Temel API servis fonksiyonu
export const apiFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('API Error');
  }
  return response.json();
}; 