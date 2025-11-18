import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

// POST /api/homework/[id]/accept - Accept an answer as the solution
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { answerId } = body

    if (!answerId) {
      return NextResponse.json(
        { error: 'Answer ID is required' },
        { status: 400 }
      )
    }

    // Verify answer belongs to this question
    const answer = await prisma.homeworkAnswer.findUnique({
      where: { id: answerId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        question: {
          select: {
            id: true,
            title: true,
            studentId: true,
          },
        },
      },
    })

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }

    if (answer.questionId !== params.id) {
      return NextResponse.json(
        { error: 'Answer does not belong to this question' },
        { status: 400 }
      )
    }

    // Update question with accepted answer and mark answer as helpful
    const [question, updatedAnswer] = await Promise.all([
      prisma.homeworkQuestion.update({
        where: { id: params.id },
        data: {
          acceptedAnswerId: answerId,
          status: 'ANSWERED',
        },
        include: {
          student: { select: { id: true, name: true, avatar: true } },
          subject: true,
          acceptedAnswer: {
            include: {
              author: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
        },
      }),
      prisma.homeworkAnswer.update({
        where: { id: answerId },
        data: { isHelpful: true },
      }),
    ])

    // Send notification to answer author
    try {
      await prisma.notification.create({
        data: {
          userId: answer.author.id,
          type: 'answer_accepted',
          title: 'Odgovor prihvaćen',
          message: `Vaš odgovor na pitanje "${answer.question.title}" je prihvaćen kao rješenje!`,
          data: JSON.stringify({ questionId: params.id, answerId }),
        },
      })

      // Send email notification
      await sendEmail({
        to: answer.author.email,
        subject: `Odgovor prihvaćen - ${answer.question.title}`,
        html: `
          <h2>Pozdrav ${answer.author.name},</h2>
          <p>Čestitamo! Vaš odgovor je prihvaćen kao rješenje za pitanje:</p>
          <h3>${answer.question.title}</h3>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/homework/${params.id}">Pogledaj pitanje</a></p>
        `,
      })
    } catch (emailError) {
      console.error('Error sending notification:', emailError)
    }

    return NextResponse.json(question)
  } catch (error: any) {
    console.error('Error accepting answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to accept answer' },
      { status: 500 }
    )
  }
}
