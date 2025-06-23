import { User } from '../models/User';

export const getUser = async (id: string): Promise<User> => {
  // Burada gerçek API çağrısı yapılacak
  return {
    id,
    name: 'Test User',
    email: 'test@example.com',
    diagnosisDate: '2023-01-01',
    treatmentProcess: 'Kemoterapi',
    doctorName: 'Dr. Smith',
  };
}; 