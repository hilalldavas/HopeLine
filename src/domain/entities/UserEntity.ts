export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public diagnosisDate: string,
    public treatmentProcess: string,
    public doctorName: string
  ) {}
} 