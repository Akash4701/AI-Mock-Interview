import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, feedback, userAnswer, mockInterviewId, videoUrl } = body;
    console.log("feedback", feedback.correctAnswer);
    console.log("userAnswer", userAnswer);
    console.log("mockInterviewId", mockInterviewId);
    console.log("question", question);
    
    // Validate request body
    if (!question || !feedback?.rating || !feedback?.feedback || !feedback.correctAnswer || !userAnswer || !mockInterviewId) {
      return NextResponse.json({ error: 'Missing or invalid fields in request.' }, { status: 400 });
    }

    // Get the current user
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
    }

    const userId = user.id;

    // Fetch existing answer
    const existingAnswer = await db.userAnswer.findFirst({
      where: {
        mockInterviewId: mockInterviewId,
        question: question
      }
    });

    // Fetch existing user topic ratings
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      select: { TopicRating: true }
    });

    let updatedTopicRating = existingUser?.TopicRating || {};

    // Loop through feedback.topicAnalysis and add missing topics
    for (const topic in feedback.topicAnalysis) {
      // if (updatedTopicRating[topic]) {
        updatedTopicRating[topic] = feedback.topicAnalysis[topic];
      // }else{

      // }
    }

    if (existingAnswer) {
      await db.userAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          Intervieweerating: feedback.rating,
          Intervieweefeedback: feedback.feedback,
          voiceTone: feedback?.videoAnalysis?.voiceTone,
          bodyLanguage: feedback?.videoAnalysis?.bodyLanguage,
          facialExpressions: feedback?.videoAnalysis?.facialExpressions,
          confidence: feedback?.videoAnalysis?.confidence,
          speakingPace: feedback?.videoAnalysis?.speakingPace,
          overallPresentation: feedback?.videoAnalysis?.overallPresentation,
          improvementSuggestions: feedback?.videoAnalysis?.improvementSuggestions,
          videoUrl,
          TopicRating: feedback.topicAnalysis,
          userAnswer,
          correctAnswer: answer,
        }
      });
    } else {
      await db.userAnswer.create({
        data: {
          question,
          Intervieweerating: feedback.rating,
          Intervieweefeedback: feedback.feedback,
          voiceTone: feedback?.videoAnalysis?.voiceTone,
          bodyLanguage: feedback?.videoAnalysis?.bodyLanguage,
          facialExpressions: feedback?.videoAnalysis?.facialExpressions,
          confidence: feedback?.videoAnalysis?.confidence,
          speakingPace: feedback?.videoAnalysis?.speakingPace,
          overallPresentation: feedback?.videoAnalysis?.overallPresentation,
          improvementSuggestions: feedback?.videoAnalysis?.improvementSuggestions,
          videoUrl,
          userAnswer,
          userId,
          TopicRating: feedback?.topicAnalysis,
          correctAnswer: answer,
          mockInterviewId: mockInterviewId.toString()
        }
      });
    }

    // Update the user's TopicRating field
    await db.user.update({
      where: { id: userId },
      data: { TopicRating: updatedTopicRating }
    });

    return NextResponse.json({ message: 'Mock Answer processed successfully' });

  } catch (error: any) {
    console.error('Error saving mock interview answer:', error.message || error);
    return NextResponse.json({ error: 'Error saving mock interview answer' }, { status: 500 });
  }
}
