import OpenAI from "openai";
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};
const openai = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY||"",
  dangerouslyAllowBrowser:true
});
export const chatResponse = async (messages:Message[]) => {
  console.log(messages)
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...messages,
    ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content || "";
};
