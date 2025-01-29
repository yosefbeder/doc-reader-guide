export type FormStateType = "fail" | "success";

export interface FormState {
  type?: FormStateType;
  message?: string;
}

interface DatabaseTable {
  id: number;
  createdAt: string;
  updatedAt: string;
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

export interface Faculty extends DatabaseTable {
  name: string;
  city: string;
  years: Year[];
}

export interface Year extends DatabaseTable {
  title: string;
  facultyId: number;
}

export interface Module extends DatabaseTable {
  name: string;
  icon: string;
  yearId: number;
  semesterName: number;
}

interface ModuleSimple {
  id: number;
  semesterName: number;
  name: string;
  yearId: number;
}

export interface Subject extends DatabaseTable {
  name: string;
  icon: string;
  module: ModuleSimple;
}

interface SubjectSimple {
  id: number;
  name: string;
  module: ModuleSimple;
}

export interface Lecture extends DatabaseTable {
  title: string;
  type: "Normal" | "Practical" | "FinalRevision";
  subTitle: string;
  date: string;
  subject: SubjectSimple;
}

interface LectureSimple {
  id: number;
  title: string;
  subject: SubjectSimple;
}

export interface Link extends DatabaseTable {
  title: string;
  subTitle: string;
  url: string;
  type: "Video" | "Record" | "PDF" | "Data";
  category: "Data" | "College" | "Summary";
  lecture: LectureSimple;
}
