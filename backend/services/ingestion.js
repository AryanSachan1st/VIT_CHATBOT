const OpenAI = require('openai');
const Blog = require('../models/Blog');
const BlogVector = require('../models/BlogVector');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to split text into chunks
const chunkText = (text, chunkSize = 800, overlap = 100) => {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.substring(start, end);
    chunks.push(chunk);
    
    // If we've reached the end of the text, break
    if (end >= text.length) break;
    
    // Move start position by chunkSize minus overlap
    start = end - overlap;
  }
  
  return chunks;
};

// Function to generate embeddings for text
const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

// Function to ingest all blogs
const ingestBlogs = async () => {
  try {
    // Get all published blogs
    const blogs = await Blog.find({ published: true });
    
    // Clear existing vectors
    await BlogVector.deleteMany({});
    
    let totalChunks = 0;
    
    // Process each blog
    for (const blog of blogs) {
      // Split blog content into chunks
      const chunks = chunkText(blog.content);
      
      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // Generate embedding for the chunk
        const embedding = await generateEmbedding(chunk);
        
        // Create metadata
        const metadata = {
          title: blog.title,
          authorName: blog.authorName,
          sourceUrl: blog.sourceUrl || '',
          chunkIndex: i,
        };
        
        // Save vector to database
        const blogVector = new BlogVector({
          blogId: blog._id,
          chunkText: chunk,
          embedding: embedding,
          metadata: metadata,
        });
        
        await blogVector.save();
        totalChunks++;
      }
    }
    
    return {
      success: true,
      message: `Ingested ${blogs.length} blogs with ${totalChunks} chunks`,
      blogCount: blogs.length,
      chunkCount: totalChunks,
    };
  } catch (error) {
    console.error('Error ingesting blogs:', error);
    return {
      success: false,
      message: 'Failed to ingest blogs',
      error: error.message,
    };
  }
};

module.exports = {
  chunkText,
  generateEmbedding,
  ingestBlogs,
};
