export type FormStateType = "fail" | "success";

export interface FormState {
  type?: FormStateType;
  message?: string;
}

interface DatabaseTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faculty extends DatabaseTable {
  name: string;
  city: string;
}

export interface Year extends DatabaseTable {
  title: string;
  facultyId: number;
}

export interface User extends DatabaseTable {
  name: string;
  email: string;
  status: boolean;
  role: "Admin" | "User";
  facultyId: number;
  yearId: number;
}

export interface Module extends DatabaseTable {
  name: string;
  icon: string;
  yearId: number;
  _count: {
    subjects: number;
  };
}
