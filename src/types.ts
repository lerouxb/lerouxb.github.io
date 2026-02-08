export type Post = {
  data: {
    title?: string;
    mood?: string;
    draft?: boolean;
  };
  content: string;
};
