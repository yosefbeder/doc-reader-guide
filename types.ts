export type FormStateType = "fail" | "warning" | "success" | "information";

export interface FormState {
  type?: FormStateType;
  message?: string;
  resetKey?: number;
}

export interface DatabaseTable {
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
  markedQuestions: Question[];
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
  moduleId: number;
  module: ModuleSimple;
  _count: {
    lectures: number;
  };
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
  category: "Data" | "College" | "Summary" | "Questions";
  lectureData: LectureSimple;
}

export interface Quiz extends DatabaseTable {
  title: string;
  questions: Question[];
  lectureData: LectureSimple;
}

export interface Question extends DatabaseTable {
  image?: string;
  explanation?: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  quizId: number;
}

export interface PracticalQuiz extends DatabaseTable {
  title: string;
  questions: PracticalQuestion[];
  lectureData: LectureSimple;
}

export interface PracticalQuestion extends DatabaseTable {
  image: string;
  width: number;
  height: number;
  masks: Rect[];
  tapes: Rect[];
  writtenQuestions: WrittenQuestion[];
  quizId: number;
}

export interface Rect extends DatabaseTable {
  tapeQuestionId: number;
  maskQuestionId: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WrittenQuestion extends DatabaseTable {
  text: string;
  answer: string;
}
