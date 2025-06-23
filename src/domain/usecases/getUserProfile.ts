import { getUser } from '../../data/repositories/userRepository';
import { UserEntity } from '../entities/UserEntity';

export const getUserProfile = async (id: string): Promise<UserEntity> => {
  const user = await getUser(id);
  return new UserEntity(
    user.id,
    user.name,
    user.email,
    user.diagnosisDate,
    user.treatmentProcess,
    user.doctorName
  );
}; 