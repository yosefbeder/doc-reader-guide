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
  _count: {
    subjects: number;
  };
}

export interface Module extends DatabaseTable {
  name: string;
  icon: string;
  yearId: number;
  semesterName: number;
}

export interface Subject extends DatabaseTable {
  name: string;
  icon: string;
  moduleId: number;
}

export interface Lecture extends DatabaseTable {
  title: string;
  subTitle: string;
  subjectId: number;
  date: string;
}

interface Link extends DatabaseTable {
  title: string;
  subTitle: string;
  url: string;
  type: "Video" | "Record" | "PDF" | "Data";
  category: "Data" | "College" | "Summary";
}

export interface LectureLink extends Link {
  lectureId: number;
}

export interface FinalRevisionLink extends Link {
  finalRevisionId: number;
}

export interface PracticalLink extends Link {
  practicalId: number;
}
