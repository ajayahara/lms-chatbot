export type Message = {
  id?: string;
  interaction_id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};
export type Interaction = {
  id: string;
  title: string;
  user_id?: string;
  messages?: string[];
};
