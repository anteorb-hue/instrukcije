'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  sendMessage: (data: {
    conversationId: string
    senderId: string
    receiverId: string
    content: string
    senderName?: string
  }) => void
  startTyping: (conversationId: string, userId: string, userName: string) => void
  stopTyping: (conversationId: string, userId: string) => void
  markAsRead: (messageId: string, userId: string) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinConversation: () => {},
  leaveConversation: () => {},
  sendMessage: () => {},
  startTyping: () => {},
  stopTyping: () => {},
  markAsRead: () => {},
})

export const useSocket = () => useContext(SocketContext)

interface SocketProviderProps {
  children: React.ReactNode
  userId?: string
}

export function SocketProvider({ children, userId }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize Socket.io client
    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    })

    socketInstance.on('connect', () => {
      console.log('Socket.io connected:', socketInstance.id)
      setIsConnected(true)

      // Join user's personal room
      if (userId) {
        socketInstance.emit('join', userId)
        socketInstance.emit('user_online', userId)
      }
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket.io disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [userId])

  const joinConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('join_conversation', conversationId)
    }
  }

  const leaveConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId)
    }
  }

  const sendMessage = (data: {
    conversationId: string
    senderId: string
    receiverId: string
    content: string
    senderName?: string
  }) => {
    if (socket) {
      socket.emit('send_message', data)
    }
  }

  const startTyping = (conversationId: string, userId: string, userName: string) => {
    if (socket) {
      socket.emit('typing_start', { conversationId, userId, userName })
    }
  }

  const stopTyping = (conversationId: string, userId: string) => {
    if (socket) {
      socket.emit('typing_stop', { conversationId, userId })
    }
  }

  const markAsRead = (messageId: string, userId: string) => {
    if (socket) {
      socket.emit('mark_read', { messageId, userId })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        startTyping,
        stopTyping,
        markAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
