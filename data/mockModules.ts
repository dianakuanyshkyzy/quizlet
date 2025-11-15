export type Word = {
    term: string;
    translation: string;
  };
  
  export type Module = {
    id: number;
    name: string;
    description: string;
    words: Word[];
  };
  
  export const mockModules: Module[] = [
    {
      id: 1,
      name: "Biology Basics",
      description: "Cells and stuff",
      words: [
        { term: "Cell", translation: "Клетка" },
        { term: "Mitochondria", translation: "Митохондрия" },
        { term: "Nucleus", translation: "Ядро" }
      ]
    },
    {
      id: 2,
      name: "French Verbs",
      description: "Common verbs",
      words: [
        { term: "Manger", translation: "Есть" },
        { term: "Aller", translation: "Идти" }
      ]
    }, 
    {
        id: 3,
        name: "Fruits",
        description: "Translation of fruits from en to rus",
        words: [
            { term: "Apple", translation: "Яблоко" },
            { term: "Pear", translation: "Груша" },
            { term: "Pomegranate", translation: "Гранат" },
            { term: "Orange", translation: "Апельсин" },
            { term: "Pineapple", translation: "Ананас" },
            { term: "Peach", translation: "Персик" }
        ]
    }
  ];
  