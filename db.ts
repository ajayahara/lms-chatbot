import { Interaction, Message } from "./types";

export const interactions: Interaction[] = [
  {
    id: "1",
    title: "Meeting",
    user_id: "101",
    messages: ["1", "2"],
  },
  {
    id: "2",
    title: "Project Update",
    user_id: "202",
    messages: ["3","4","5"],
  },
  {
    id: "3",
    title: "How to apply",
    user_id: "101",
    messages: ["6","7"],
  },
  {
    id: "4",
    title: "About ISA",
    user_id: "202",
    messages: ["8","9","10"],
  },
];
export const chats: Message[] = [
  { id: "1", interaction_id: "1", role: "user", content: "Hi there!" },
  {
    id: "2",
    interaction_id: "1",
    role: "assistant",
    content: "Hello! How can I assist you?",
  },
  { id: "3", interaction_id: "2", role: "user", content: "Hello team!" },
  {
    id: "4",
    interaction_id: "2",
    role: "system",
    content: "System message: Important update.",
  },
  {
    id: "5",
    interaction_id: "2",
    role: "assistant",
    content: "Here's the project update.",
  },
  { id: "6", interaction_id: "3", role: "user", content: "Hi there!" },
  {
    id: "7",
    interaction_id: "3",
    role: "assistant",
    content: "Hello! How can I assist you?",
  },
  { id: "8", interaction_id: "4", role: "user", content: "Hello team!" },
  {
    id: "9",
    interaction_id: "4",
    role: "system",
    content: "System message: Important update.",
  },
  {
    id: "10",
    interaction_id: "4",
    role: "assistant",
    content: "Here's the project update.",
  },
];
