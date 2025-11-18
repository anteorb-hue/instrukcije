const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
    },
  })

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join user's personal room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`)
      console.log(`User ${userId} joined their room`)
    })

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`)
      console.log(`Socket ${socket.id} joined conversation:${conversationId}`)
    })

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`)
      console.log(`Socket ${socket.id} left conversation:${conversationId}`)
    })

    // Send message
    socket.on('send_message', async (data) => {
      const { conversationId, senderId, receiverId, content } = data

      try {
        // Save message to database via API
        const response = await fetch(`http://localhost:${port}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId,
            receiverId,
            content,
          }),
        })

        if (response.ok) {
          const message = await response.json()

          // Emit to conversation room
          io.to(`conversation:${conversationId}`).emit('new_message', message)

          // Emit to receiver's personal room (for notifications)
          io.to(`user:${receiverId}`).emit('message_notification', {
            messageId: message.id,
            senderId,
            senderName: data.senderName,
            preview: content.substring(0, 50),
          })
        }
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('message_error', { error: 'Failed to send message' })
      }
    })

    // Typing indicator
    socket.on('typing_start', ({ conversationId, userId, userName }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', { userId, userName })
    })

    socket.on('typing_stop', ({ conversationId, userId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', { userId })
    })

    // Mark message as read
    socket.on('mark_read', async ({ messageId, userId }) => {
      try {
        await fetch(`http://localhost:${port}/api/messages/${messageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        })

        io.to(`user:${userId}`).emit('message_read', { messageId })
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    })

    // User online/offline status
    socket.on('user_online', (userId) => {
      socket.broadcast.emit('user_status_change', { userId, status: 'online' })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  // Make io accessible globally
  global.io = io

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> Socket.io server running`)
    })
})
