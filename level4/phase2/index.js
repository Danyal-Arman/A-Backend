import express from "express"
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";import { ChatGroq } from "@langchain/groq"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import {QdrantVectorStore} from "@langchain/qdrant"
import fs from "fs"
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// import { Annotation, MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph"
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { TavilySearch } from "@langchain/tavily";
dotenv.config()
const app = express()
const port = 5000
app.use(express.json())


const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
    maxTokens: 3000,
    maxRetries: 2,
})

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});


const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "grocery-store",
});

const upload = async()=>{
    const pdfPath = "./knowledge.pdf";
    const buffer = fs.readFileSync(pdfPath)
    const parse = new PDFParse({data:buffer})
    const result = await parse.getText()
    const text = result.text
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 200,
    })
    const texts = await splitter.createDocuments([text])
    await vectorStore.addDocuments(texts)
};

app.post("/ai", async (req, res) => {
    const { input } = req.body 

    const docs = await vectorStore.similaritySearch(input, 5);
    const context = docs.map((e)=>e.pageContent).join("\n\n")
    
      const response = await llm.invoke([
        new SystemMessage(`You are a RAG AI assistant.

STRICT RULES:
- Answer ONLY from context
- Do not use outside knowledge
- If format required in response then add proper format.
- If answer need mathematic calculation then calculate and give exact answer.
- If answer not found say:
  "I don't know from uploaded PDF."

Context:
${context}`)
,
new HumanMessage(input)
    ])
    

    return res.status(200).json({ai:response.content})
})
 

app.get("/", (req, res) => {
    return res.json({ message: "hello from level4" })
})

 
app.listen(port, () => {
    console.log("server started")
})