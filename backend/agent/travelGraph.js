import 'dotenv/config';
import { ChatGroq } from '@langchain/groq';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { SystemMessage } from '@langchain/core/messages';
import { getTripInfoTool, saveBookingTool } from './tools.js';

const tools = [getTripInfoTool, saveBookingTool];
const toolNode = new ToolNode(tools);

const model = new ChatGroq({
  model: 'openai/gpt-oss-120b',
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.3
}).bindTools(tools);

function shouldContinue(state) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.tool_calls?.length) {
    return 'tools';
  }
  return '__end__';
}

async function callModel(state) {
  const systemPrompt = new SystemMessage(
    `You are an interactive, friendly, and helpful AI Travel Agent for our Travel platform.
     - Help users query trip details, hotels, and travel policies using get_trip_info tool.
     - When a user wants to book, politely collect: Customer Name, Customer Email, Destination, Package Title, Guest Count, and Start Date.
     - Once all details are collected, execute the save_booking tool to store the booking into the system.`
  );
  
  const response = await model.invoke([systemPrompt, ...state.messages]);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('agent', callModel)
  .addNode('tools', toolNode)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', shouldContinue, ['tools', '__end__'])
  .addEdge('tools', 'agent');

export const travelAgentApp = workflow.compile();