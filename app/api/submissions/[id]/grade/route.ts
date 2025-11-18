import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/submissions/[id]/grade - Grade submission (for manual grading)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { gradedBy, gradedAnswers, feedback } = body
    // gradedAnswers format: [{ answerId, pointsEarned, isCorrect, feedback }]

    if (!gradedBy) {
      return NextResponse.json(
        { error: 'Grader ID is required' },
        { status: 400 }
      )
    }

    // Get submission with all details
    const submission = await prisma.testSubmission.findUnique({
      where: { id: params.id },
      include: {
        test: true,
        answers: true,
      },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Update each graded answer
    if (gradedAnswers && gradedAnswers.length > 0) {
      for (const gradedAnswer of gradedAnswers) {
        await prisma.submissionAnswer.update({
          where: { id: gradedAnswer.answerId },
          data: {
            pointsEarned: gradedAnswer.pointsEarned,
            isCorrect: gradedAnswer.isCorrect,
            ...(gradedAnswer.feedback && { feedback: gradedAnswer.feedback }),
          },
        })
      }
    }

    // Recalculate total points
    const updatedAnswers = await prisma.submissionAnswer.findMany({
      where: { submissionId: params.id },
    })

    const totalPointsEarned = updatedAnswers.reduce(
      (sum, answer) => sum + (answer.pointsEarned || 0),
      0
    )

    const score = submission.pointsPossible
      ? (totalPointsEarned / submission.pointsPossible) * 100
      : 0

    const passed = score >= submission.test.passingScore

    // Update submission
    const updatedSubmission = await prisma.testSubmission.update({
      where: { id: params.id },
      data: {
        pointsEarned: totalPointsEarned,
        score,
        passed,
        isGraded: true,
        gradedAt: new Date(),
        gradedBy,
        ...(feedback && { feedback }),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        test: {
          include: {
            tutor: {
              select: { id: true, name: true, avatar: true },
            },
            subject: true,
          },
        },
        answers: true,
      },
    })

    return NextResponse.json(updatedSubmission)
  } catch (error: any) {
    console.error('Error grading submission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to grade submission' },
      { status: 500 }
    )
  }
}
