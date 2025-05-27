import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { pdfBase64 } = await request.json()

    if (!pdfBase64) {
      return NextResponse.json(
        { error: 'PDF base64 data is required' },
        { status: 400 }
      )
    }

    console.log("PDF base64 length:", pdfBase64.length)

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
    Please analyze this PDF document and create comprehensive flashcards for studying. 
    
    Requirements:
    - Generate 1-2 flashcards for each page covering the main concepts
    - Each flashcard should have a clear, specific question
    - Answers should be concise (2-3 lines maximum)
    - Include the page number where the information can be found
    - Focus on key concepts, definitions, important facts, and relationships
    - Vary the difficulty levels
    
    Return the response as a JSON array with this exact structure:
    [
      {
        "id": "unique_id",
        "question": "Clear, specific question",
        "answer": "Concise answer in 1-2 lines",
        "page_no": page_number,
        "difficulty": "easy|medium|hard"
      }
    ]
    
    Only return the JSON array, no additional text or explanations.
    `

    console.log("Sending request to Gemini API...")
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64
              }
            }
          ]
        },
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    })

    console.log("Gemini API response received")
    const response = await result.response
    const text = response.text()
    console.log("Raw Gemini response:", text)

    // Clean the response to extract JSON
    let jsonString = text.trim()

    // Remove markdown code blocks if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\n?/, '').replace(/\n?```$/, '')
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```\n?/, '').replace(/\n?```$/, '')
    }

    // Parse the JSON response
    let flashcards
    try {
      flashcards = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw response:', text)
      // Fallback: try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Invalid JSON response from Gemini')
      }
    }

    // Validate the response structure
    if (!Array.isArray(flashcards)) {
      throw new Error('Response is not an array')
    }

    // Ensure each flashcard has the required fields
    const validatedFlashcards = flashcards.map((card, index) => ({
      id: card.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(card.id) ? card.id : uuidv4(),
      question: card.question || 'Question not available',
      answer: card.answer || 'Answer not available',
      page_no: card.page_no || 1,
      difficulty: card.difficulty || 'medium'
    }))

    console.log("Validated flashcards:", validatedFlashcards)

    return NextResponse.json({
      flashcards: validatedFlashcards,
      total: validatedFlashcards.length
    })

  } catch (error) {
    console.error('Error generating flashcards:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Error details:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate flashcards',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}