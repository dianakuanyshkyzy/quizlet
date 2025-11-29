export type Word = {
  term: string;
  translation: string;
};

export type Module = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPrivate: boolean;
  userId: string;
  words: Word[];
};

export const mockModules: Module[] = [
  {
    id: "1",
    slug: "biology-basics",
    title: "Biology Basics",
    description: "Cells and stuff",
    isPrivate: false,
    userId: "1",
    words: [
      { term: "Cell", translation: "Клетка" },
      { term: "Mitochondria", translation: "Митохондрия" },
      { term: "Nucleus", translation: "Ядро" },
    ],
  },
  {
    id: "2",
    slug: "french-verbs",
    title: "French Verbs",
    description: "Common verbs",
    isPrivate: false,
    userId: "1",
    words: [
      { term: "Manger", translation: "Есть" },
      { term: "Aller", translation: "Идти" },
    ],
  },
  {
    id: "3",
    slug: "fruits",
    title: "Fruits",
    description: "Translation of fruits from en to rus",
    isPrivate: false,
    userId: "1",
    words: [
      { term: "Apple", translation: "Яблоко" },
      { term: "Pear", translation: "Груша" },
      { term: "Pomegranate", translation: "Гранат" },
      { term: "Orange", translation: "Апельсин" },
      { term: "Pineapple", translation: "Ананас" },
      { term: "Peach", translation: "Персик" },
    ],
  },
];
