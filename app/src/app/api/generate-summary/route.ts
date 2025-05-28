import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { pdfBase64 } = await request.json();

    if (!pdfBase64) {
      return NextResponse.json({ error: 'PDF base64 data is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Please analyze this PDF document and provide a comprehensive summary in the following JSON format. Make sure your response is valid JSON and includes all the required fields:

    {
      "overallSummary": "A comprehensive 3-4 paragraph summary of the entire document covering main themes, objectives, and conclusions",
      "keyTopics": [
        {
          "topic": "Topic name",
          "description": "Brief description of what this topic covers",
          "pageNumbers": [1, 2, 3],
          "importance": "high|medium|low"
        }
      ],
      "learningRecommendations": [
        {
          "type": "prerequisite|follow_up|practice|resource",
          "title": "Recommendation title",
          "description": "Detailed description of the recommendation",
          "priority": "high|medium|low"
        }
      ],
      "documentStats": {
        "totalPages": number,
        "estimatedReadingTime": number_in_minutes,
        "difficulty": "beginner|intermediate|advanced",
        "category": "Subject or field category"
      }
    }

    Guidelines for analysis:
    1. **Overall Summary**: Provide a comprehensive overview that captures the main purpose, key findings, and conclusions of the document. Include the document's scope and target audience.

    2. **Key Topics**: Identify 5-10 major topics or themes covered in the document. For each topic:
       - Use clear, descriptive names
       - Provide a brief explanation of what the topic covers
       - List the specific page numbers where this topic is discussed
       - Rate importance based on how central it is to the document's main purpose

    3. **Learning Recommendations**: Provide 4-8 actionable recommendations:
       - **Prerequisites**: What should readers know before studying this document
       - **Follow-up**: What to study next after mastering this content
       - **Practice**: Exercises, problems, or activities to reinforce learning
       - **Resources**: Additional materials, tools, or references that would be helpful

    4. **Document Stats**: 
       - Count actual pages in the document
       - Estimate reading time based on content density (average 250 words per minute)
       - Assess difficulty based on vocabulary, concepts, and assumed knowledge
       - Categorize by academic field or professional domain

    Focus on accuracy and provide specific, actionable insights. Ensure page numbers are accurate and recommendations are practical for learners.

    Please respond with only the JSON object, no additional text or formatting.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64
        }
      },
      prompt
    ]);

    const response = await result.response;
    const text = response.text();

    console.log("Raw Gemini response:", text);

    // Clean up the response to ensure it's valid JSON
    let cleanedText = text.trim();
    
    // Remove any markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const summaryData = JSON.parse(cleanedText);
      
      // Validate required fields and provide defaults
      const validatedSummary = {
        overallSummary: summaryData.overallSummary || 'Summary not available',
        keyTopics: Array.isArray(summaryData.keyTopics) ? summaryData.keyTopics : [],
        learningRecommendations: Array.isArray(summaryData.learningRecommendations) ? summaryData.learningRecommendations : [],
        documentStats: {
          totalPages: summaryData.documentStats?.totalPages || 0,
          estimatedReadingTime: summaryData.documentStats?.estimatedReadingTime || 0,
          difficulty: summaryData.documentStats?.difficulty || 'intermediate',
          category: summaryData.documentStats?.category || 'General'
        }
      };

      return NextResponse.json(validatedSummary);
      
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Cleaned text that failed to parse:', cleanedText);
      
      // Fallback: try to extract information manually
      const fallbackSummary = {
        overallSummary: 'Unable to generate structured summary. Please try again.',
        keyTopics: [],
        learningRecommendations: [],
        documentStats: {
          totalPages: 0,
          estimatedReadingTime: 0,
          difficulty: 'intermediate' as const,
          category: 'General'
        }
      };
      
      return NextResponse.json(fallbackSummary);
    }

  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}