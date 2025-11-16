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
