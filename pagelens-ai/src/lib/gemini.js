import {
GoogleGenerativeAI
}
from "@google/generative-ai";

export async function analyzeWithAI(prompt){

const genAI =
new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

const model =
genAI.getGenerativeModel({

model:"gemini-2.5-flash"

});

const result =
await model.generateContent(prompt);

const text =
result.response.text();

return text;

}