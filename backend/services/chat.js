const OpenAI = require('openai');
const BlogVector = require('../models/BlogVector');
const ChatHistory = require('../models/ChatHistory');
const axios = require('axios');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to perform vector search
const vectorSearch = async (queryEmbedding, limit = 5) => {
  try {
    const results = await BlogVector.aggregate([
      {
        $search: {
          index: 'vector_index',
          knnBeta: {
            vector: queryEmbedding,
            path: 'embedding',
            k: limit,
          },
        },
      },
      {
        $project: {
          blogId: 1,
          chunkText: 1,
          metadata: 1,
          score: { $meta: 'searchScore' },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ]);
    
    return results;
  } catch (error) {
    console.error('Error performing vector search:', error);
    throw error;
  }
};

// Function to generate answer using RAG
const generateAnswer = async (query, userId, sessionId) => {
  try {
    // Generate embedding for the query
    const queryEmbedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });
    
    const embedding = queryEmbedding.data[0].embedding;
    
    // Perform vector search
    const searchResults = await vectorSearch(embedding, 8);
    
    // Check if we have relevant blog content
    let context = '';
    let sources = [];
    
    if (searchResults.length > 0) {
      // Use blog content as context
      context = searchResults.map(result => result.chunkText).join('\n\n');
      sources = searchResults.map(result => ({
        title: result.metadata.title,
        url: result.metadata.sourceUrl,
        excerpt: result.chunkText.substring(0, 100) + '...',
        sourceType: 'blog'
      }));
    } else {
      // Fallback to web search if no relevant blog content
      const webResults = await performWebSearch(query);
      context = webResults.map(result => result.snippet).join('\n\n');
      sources = webResults.map(result => ({
        title: result.title,
        url: result.link,
        excerpt: result.snippet,
        sourceType: 'web'
      }));
    }
    
    // Generate prompt for OpenAI
    const prompt = `
      You are a helpful assistant for VIT-Chennai freshmen. Answer the following question using the provided context.
      If the context doesn't contain relevant information, use your general knowledge but prioritize the context.
      
      Context:
      ${context}
      
      Question: ${query}
      
      Please provide a concise answer followed by a "Sources" section that lists the sources used.
      Format your response as JSON with the following structure:
      {
        "answer": "Your answer here",
        "sources": [
          {
            "title": "Source title",
            "url": "Source URL",
            "excerpt": "Short excerpt from source (max 30 words)"
          }
        ]
      }
    `;
    
    // Generate answer using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for VIT-Chennai freshmen.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const rawModelOutput = completion.choices[0].message.content;
    
    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawModelOutput);
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      parsedResponse = {
        answer: rawModelOutput,
        sources: sources
      };
    }
    
    // Save to chat history
    const chatHistory = new ChatHistory({
      userId,
      sessionId,
      query,
      answer: parsedResponse.answer,
      sources: parsedResponse.sources,
      rawModelOutput
    });
    
    await chatHistory.save();
    
    return {
      answer: parsedResponse.answer,
      sources: parsedResponse.sources,
      rawModelOutput
    };
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
};

// Function to perform web search (fallback)
const performWebSearch = async (query) => {
  try {
    // For now, we'll return mock data
    // In a real implementation, you would integrate with a web search API
    return [
      {
        title: "VIT Chennai Official Website",
        link: "https://chennai.vit.ac.in/",
        snippet: "Official website of VIT Chennai campus with information for students..."
      },
      {
        title: "VIT Chennai Student Portal",
        link: "https://vtop.vit.ac.in/",
        snippet: "Student portal for VIT Chennai with academic information..."
      }
    ];
  } catch (error) {
    console.error('Error performing web search:', error);
    return [];
  }
};

module.exports = {
  generateAnswer,
  vectorSearch,
  performWebSearch,
};
