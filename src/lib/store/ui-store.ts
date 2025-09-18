import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  currentCourse: string | null;
  currentLesson: string | null;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCurrentCourse: (courseId: string | null) => void;
  setCurrentLesson: (lessonId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  searchQuery: '',
  currentCourse: null,
  currentLesson: null,
  
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setCurrentCourse: (courseId: string | null) => set({ currentCourse: courseId }),
  setCurrentLesson: (lessonId: string | null) => set({ currentLesson: lessonId }),
}));