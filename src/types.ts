export type Post = {
  data: {
    date?: string;
    title?: string;
    mood?: string;
    draft?: boolean;
  };
  content: string;
};
