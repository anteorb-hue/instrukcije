import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/tests/[id]/submit - Submit test answers
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { submissionId, answers, timeSpent } = body
    // answers format: [{ questionId, answerText?, selectedOptionId? }]

    if (!submissionId || !answers) {
      return NextResponse.json(
        { error: 'Submission ID and answers are required' },
        { status: 400 }
      )
    }

    // Get submission and test details
    const submission = await prisma.testSubmission.findUnique({
      where: { id: submissionId },
      include: {
        test: {
          include: {
            questions: {
              include: {
                question: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    if (submission.submittedAt) {
      return NextResponse.json(
        { error: 'Test already submitted' },
        { status: 400 }
      )
    }

    // Auto-grade answers
    let totalPointsEarned = 0
    const gradedAnswers = []

    for (const answer of answers) {
      const testQuestion = submission.test.questions.find(
        tq => tq.questionId === answer.questionId
      )

      if (!testQuestion) continue

      const question = testQuestion.question
      const pointsPossible = testQuestion.pointOverride || question.points
      let isCorrect = false
      let pointsEarned = 0

      // Auto-grade based on question type
      if (question.type === 'MULTIPLE_CHOICE') {
        const selectedOption = question.options.find(
          opt => opt.id === answer.selectedOptionId
        )
        isCorrect = selectedOption?.isCorrect || false
        pointsEarned = isCorrect ? pointsPossible : 0
      } else if (question.type === 'TRUE_FALSE') {
        isCorrect = answer.answerText?.toLowerCase() === question.correctAnswer?.toLowerCase()
        pointsEarned = isCorrect ? pointsPossible : 0
      } else if (question.type === 'SHORT_ANSWER' || question.type === 'FILL_IN_BLANK') {
        // For short answer, check if correct answer is provided
        if (question.correctAnswer) {
          isCorrect =
            answer.answerText?.toLowerCase().trim() ===
            question.correctAnswer.toLowerCase().trim()
          pointsEarned = isCorrect ? pointsPossible : 0
        } else {
          // Needs manual grading
          isCorrect = null
          pointsEarned = 0
        }
      } else if (question.type === 'ESSAY') {
        // Essays need manual grading
        isCorrect = null
        pointsEarned = 0
      }

      totalPointsEarned += pointsEarned

      gradedAnswers.push({
        submissionId,
        questionId: answer.questionId,
        answerText: answer.answerText,
        selectedOptionId: answer.selectedOptionId,
        isCorrect,
        pointsEarned,
        pointsPossible,
      })
    }

    // Create all answers
    await prisma.submissionAnswer.createMany({
      data: gradedAnswers,
    })

    // Calculate score
    const score = submission.pointsPossible
      ? (totalPointsEarned / submission.pointsPossible) * 100
      : 0

    const passed = score >= submission.test.passingScore

    // Determine if fully graded (no essays or short answers without correct answers)
    const needsManualGrading = gradedAnswers.some(a => a.isCorrect === null)

    // Update submission
    const updatedSubmission = await prisma.testSubmission.update({
      where: { id: submissionId },
      data: {
        submittedAt: new Date(),
        timeSpent,
        pointsEarned: totalPointsEarned,
        score,
        passed,
        isGraded: !needsManualGrading,
        gradedAt: !needsManualGrading ? new Date() : null,
      },
      include: {
        test: {
          include: {
            tutor: {
              select: { id: true, name: true, avatar: true },
            },
            subject: true,
          },
        },
        answers: {
          include: {
            submission: false,
          },
        },
      },
    })

    return NextResponse.json({
      ...updatedSubmission,
      needsManualGrading,
    })
  } catch (error: any) {
    console.error('Error submitting test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit test' },
      { status: 500 }
    )
  }
}
