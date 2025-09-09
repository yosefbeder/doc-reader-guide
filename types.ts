export type FormStateType = "fail" | "warning" | "success" | "information";

export interface FormState {
  type?: FormStateType;
  message?: string;
  resetKey?: number;
}

export enum Resource {
  USER = "USER",
  MODULE = "MODULE",
  SUBJECT = "SUBJECT",
  LECTURE = "LECTURE",
  LINK = "LINK",
  MCQ_QUIZ = "MCQ_QUIZ",
  WRITTEN_QUIZ = "WRITTEN_QUIZ",
  MCQ_QUESTION = "MCQ_QUESTION",
  WRITTEN_QUESTION = "WRITTEN_QUESTION",
  SUB_QUESTION = "SUB_QUESTION",
  RECT = "RECT",
}

export enum Action {
  NAVIGATE = "NAVIGATE",
  NAVIGATE_TO_PROFILE = "NAVIGATE_TO_PROFILE",
  UPDATE = "UPDATE",
  TOGGLE_SETTING = "TOGGLE_SETTING",
  NAVIGATE_TO_HOME = "NAVIGATE_TO_HOME",
  SEARCH = "SEARCH",
  APPLY_FILTER = "APPLY_FILTER",
  END_QUIZ = "END_QUIZ",
  RESTART_QUIZ = "RESTART_QUIZ",
  PRINT_QUIZ = "PRINT_QUIZ",
  PRINT_SUMMARY = "PRINT_SUMMARY",
  GO_TO_QUESTION = "GO_TO_QUESTION",
  SELECT_OPTION = "SELECT_OPTION",
  DICUSS_WITH_CHATGPT = "DICUSS_WITH_CHATGPT",
  SHOW_ANSWER = "SHOW_ANSWER",
  TRUE_ANSWER = "TRUE_ANSWER",
  FALSE_ANSWER = "FALSE_ANSWER",
}

export interface DatabaseTable {
  id: number;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
}

export interface Faculty extends DatabaseTable {
  name: string;
  city: string;
}

export interface Year extends DatabaseTable {
  title: string;
  currentSemester: number;
  facultyId: number;
}

export interface User extends DatabaseTable {
  givenName: string;
  familyName: string;
  picture: string;
  email: string;
  status: boolean;
  roleId: number;
  facultyId: number | null;
  yearId: number | null;
  year: Year;
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
  year: {
    faculty: Faculty;
  };
}

interface ModuleSimple {
  id: number;
  semesterName: number;
  name: string;
  yearId: number;
  year: {
    faculty: Faculty;
  };
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

type LectureType = "Normal" | "Practical" | "FinalRevision";
export interface Lecture extends DatabaseTable {
  title: string;
  type: LectureType;
  note?: string;
  date: string;
  subject: SubjectSimple;
  links: Link[];
  writtenQuizzes: WrittenQuiz[];
  mcqQuizzes: McqQuiz[];
}

interface LectureSimple {
  id: number;
  type: LectureType;
  title: string;
  subject: SubjectSimple;
}

export interface Link extends DatabaseTable {
  title: string;
  subTitle: string;
  urls: string[];
  type: "Video" | "Record" | "PDF" | "Data";
  category: "Data" | "College" | "Summary" | "Questions";
  lectureData: LectureSimple;
}

export interface Quiz extends DatabaseTable {
  title: string;
  lectureData: LectureSimple;
}

export interface McqQuiz extends Quiz {
  questions: McqQuestion[];
}

export interface McqQuestion extends DatabaseTable {
  image?: string;
  explanation?: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  quizId: number;
}

export interface WrittenQuiz extends Quiz {
  questions: WrittenQuestion[];
}

export interface WrittenQuestion extends DatabaseTable {
  image?: string;
  width?: number;
  height?: number;
  masks: Rect[];
  tapes: Rect[];
  subQuestions: SubQuestion[];
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

export interface SubQuestion extends DatabaseTable {
  text: string;
  answer: string;
}

export enum QuestionState {
  TRUE,
  FALSE,
  UNANSWERED,
  UNSELECTED,
}
