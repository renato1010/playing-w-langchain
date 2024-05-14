import { openaiKey } from "@/env-vars.js";
import { ChatOpenAI } from "@langchain/openai";

export const openAIChatModel = new ChatOpenAI({
  model: 'gpt-4-0125-preview',
  temperature: 0,
  apiKey: openaiKey
});