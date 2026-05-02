export type Post = {
  data: {
    title?: string;
    mood?: string;
    source?: string;
    draft?: boolean;
  };
  content: string;
};
