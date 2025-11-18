import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { prisma } from './prisma'

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  // Store active users
  const activeUsers = new Map<string, string>() // userId -> socketId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // User authentication
    socket.on('authenticate', (userId: string) => {
      activeUsers.set(userId, socket.id)
      socket.join(`user:${userId}`)

      // Broadcast online status
      io.emit('user:online', userId)
      console.log(`User ${userId} authenticated`)
    })

    // Join conversation room
    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`)
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`)
    })

    // Send message
    socket.on('message:send', async (data: {
      senderId: string
      receiverId: string
      content: string
      conversationId?: string
    }) => {
      try {
        // Save message to database
        const message = await prisma.message.create({
          data: {
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.content,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        })

        // Send to receiver if online
        const receiverSocketId = activeUsers.get(data.receiverId)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:received', message)
        }

        // Send confirmation to sender
        socket.emit('message:sent', message)

        // Create notification for receiver
        await prisma.notification.create({
          data: {
            userId: data.receiverId,
            type: 'message_received',
            title: 'Nova poruka',
            message: `${message.sender.name} vam je poslao poruku`,
            data: JSON.stringify({ messageId: message.id }),
          },
        })
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('message:error', { error: 'Failed to send message' })
      }
    })

    // Typing indicator
    socket.on('typing:start', (data: { userId: string; receiverId: string }) => {
      const receiverSocketId = activeUsers.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:started', data.userId)
      }
    })

    socket.on('typing:stop', (data: { userId: string; receiverId: string }) => {
      const receiverSocketId = activeUsers.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:stopped', data.userId)
      }
    })

    // Mark message as read
    socket.on('message:read', async (data: { messageId: string; userId: string }) => {
      try {
        await prisma.message.update({
          where: { id: data.messageId },
          data: {
            read: true,
            readAt: new Date(),
          },
        })

        // Notify sender
        const message = await prisma.message.findUnique({
          where: { id: data.messageId },
        })

        if (message) {
          const senderSocketId = activeUsers.get(message.senderId)
          if (senderSocketId) {
            io.to(senderSocketId).emit('message:read:confirmed', data.messageId)
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    })

    // Booking notifications
    socket.on('booking:created', async (data: { bookingId: string; tutorId: string }) => {
      const tutorSocketId = activeUsers.get(data.tutorId)
      if (tutorSocketId) {
        const booking = await prisma.booking.findUnique({
          where: { id: data.bookingId },
          include: {
            student: true,
            subject: true,
          },
        })

        io.to(tutorSocketId).emit('booking:new', booking)
      }
    })

    // Session reminders (15 min before)
    socket.on('session:reminder', (data: { userId: string; bookingId: string }) => {
      const userSocketId = activeUsers.get(data.userId)
      if (userSocketId) {
        io.to(userSocketId).emit('session:starting:soon', data.bookingId)
      }
    })

    // ===== WebRTC Video/Audio Call Signaling =====

    // Initiate call
    socket.on('call:initiate', async (data: {
      callerId: string
      receiverId: string
      type: 'VIDEO' | 'AUDIO'
      roomId: string
    }) => {
      try {
        const receiverSocketId = activeUsers.get(data.receiverId)
        if (!receiverSocketId) {
          socket.emit('call:error', { error: 'Korisnik nije online' })
          return
        }

        // Create call record in database
        const call = await prisma.videoCall.create({
          data: {
            callerId: data.callerId,
            receiverId: data.receiverId,
            type: data.type,
            status: 'RINGING',
            roomId: data.roomId,
          },
          include: {
            caller: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        })

        // Notify receiver about incoming call
        io.to(receiverSocketId).emit('call:incoming', {
          callId: call.id,
          caller: call.caller,
          type: data.type,
          roomId: data.roomId,
        })

        // Confirm to caller
        socket.emit('call:initiated', { callId: call.id, roomId: data.roomId })

        console.log(`Call initiated: ${data.callerId} -> ${data.receiverId}`)
      } catch (error) {
        console.error('Error initiating call:', error)
        socket.emit('call:error', { error: 'Greška pri pokretanju poziva' })
      }
    })

    // WebRTC Offer
    socket.on('call:offer', async (data: {
      callId: string
      offer: RTCSessionDescriptionInit
      receiverId: string
    }) => {
      try {
        // Save offer to database
        await prisma.videoCall.update({
          where: { id: data.callId },
          data: { offer: JSON.stringify(data.offer) },
        })

        // Forward offer to receiver
        const receiverSocketId = activeUsers.get(data.receiverId)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('call:offer', {
            callId: data.callId,
            offer: data.offer,
          })
        }
      } catch (error) {
        console.error('Error handling call offer:', error)
      }
    })

    // WebRTC Answer
    socket.on('call:answer', async (data: {
      callId: string
      answer: RTCSessionDescriptionInit
      callerId: string
    }) => {
      try {
        // Update call status and save answer
        await prisma.videoCall.update({
          where: { id: data.callId },
          data: {
            answer: JSON.stringify(data.answer),
            status: 'ANSWERED',
            startedAt: new Date(),
          },
        })

        // Forward answer to caller
        const callerSocketId = activeUsers.get(data.callerId)
        if (callerSocketId) {
          io.to(callerSocketId).emit('call:answer', {
            callId: data.callId,
            answer: data.answer,
          })
        }

        console.log(`Call answered: ${data.callId}`)
      } catch (error) {
        console.error('Error handling call answer:', error)
      }
    })

    // ICE Candidate exchange
    socket.on('call:ice-candidate', (data: {
      targetUserId: string
      candidate: RTCIceCandidateInit
    }) => {
      const targetSocketId = activeUsers.get(data.targetUserId)
      if (targetSocketId) {
        io.to(targetSocketId).emit('call:ice-candidate', {
          candidate: data.candidate,
        })
      }
    })

    // End call
    socket.on('call:end', async (data: {
      callId: string
      userId: string
      otherUserId: string
    }) => {
      try {
        // Update call record
        const call = await prisma.videoCall.findUnique({
          where: { id: data.callId },
        })

        if (call && call.startedAt) {
          const duration = Math.floor(
            (new Date().getTime() - new Date(call.startedAt).getTime()) / 1000
          )

          await prisma.videoCall.update({
            where: { id: data.callId },
            data: {
              status: 'ENDED',
              endedAt: new Date(),
              duration,
            },
          })
        } else if (call) {
          await prisma.videoCall.update({
            where: { id: data.callId },
            data: {
              status: 'ENDED',
              endedAt: new Date(),
            },
          })
        }

        // Notify other user
        const otherSocketId = activeUsers.get(data.otherUserId)
        if (otherSocketId) {
          io.to(otherSocketId).emit('call:ended', { callId: data.callId })
        }

        console.log(`Call ended: ${data.callId}`)
      } catch (error) {
        console.error('Error ending call:', error)
      }
    })

    // Reject call
    socket.on('call:reject', async (data: {
      callId: string
      callerId: string
    }) => {
      try {
        // Update call status
        await prisma.videoCall.update({
          where: { id: data.callId },
          data: {
            status: 'REJECTED',
            endedAt: new Date(),
          },
        })

        // Notify caller
        const callerSocketId = activeUsers.get(data.callerId)
        if (callerSocketId) {
          io.to(callerSocketId).emit('call:rejected', { callId: data.callId })
        }

        console.log(`Call rejected: ${data.callId}`)
      } catch (error) {
        console.error('Error rejecting call:', error)
      }
    })

    // Disconnect
    socket.on('disconnect', () => {
      // Find and remove user from active users
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId)
          io.emit('user:offline', userId)
          console.log(`User ${userId} disconnected`)
          break
        }
      }
      console.log('Socket disconnected:', socket.id)
    })
  })

  return io
}

export type SocketServer = ReturnType<typeof initializeSocket>
