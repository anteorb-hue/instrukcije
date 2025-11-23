'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, Send, MoreVertical, Phone, Video, Loader2 } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import VideoCall from '@/components/VideoCall'
import IncomingCall from '@/components/IncomingCall'
import { useSocket } from '@/contexts/SocketContext'
import { formatTime } from '@/lib/utils'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  readAt: Date | null
  createdAt: Date
  sender: {
    id: string
    name: string
    avatar: string | null
  }
  receiver: {
    id: string
    name: string
    avatar: string | null
  }
}

interface Conversation {
  user: {
    id: string
    name: string
    avatar: string | null
  }
  lastMessage: string
  lastMessageTime: Date
  unread: number
  messages: Message[]
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Video call states
  const [activeCall, setActiveCall] = useState<{
    callId: string
    roomId: string
    type: 'VIDEO' | 'AUDIO'
    isInitiator: boolean
    otherUser: {
      id: string
      name: string
      avatar: string | null
    }
  } | null>(null)
  const [incomingCall, setIncomingCall] = useState<{
    callId: string
    roomId: string
    type: 'VIDEO' | 'AUDIO'
    caller: {
      id: string
      name: string
      avatar: string | null
    }
  } | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Fetch messages
  useEffect(() => {
    if (status === 'authenticated') {
      fetchMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [selectedUserId, conversations])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages')

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const messages: Message[] = await response.json()

      // Group messages by conversation (by other user)
      const conversationsMap = new Map<string, Conversation>()

      messages.forEach((message) => {
        const otherUserId = message.senderId === session?.user?.id ? message.receiverId : message.senderId
        const otherUser = message.senderId === session?.user?.id ? message.receiver : message.sender

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            user: otherUser,
            lastMessage: message.content,
            lastMessageTime: new Date(message.createdAt),
            unread: 0,
            messages: [],
          })
        }

        const conversation = conversationsMap.get(otherUserId)!
        conversation.messages.push(message)

        // Update last message if this one is newer
        if (new Date(message.createdAt) > conversation.lastMessageTime) {
          conversation.lastMessage = message.content
          conversation.lastMessageTime = new Date(message.createdAt)
        }

        // Count unread messages (received by current user and not read)
        if (message.receiverId === session?.user?.id && !message.read) {
          conversation.unread++
        }
      })

      // Convert map to array and sort by last message time
      const conversationsArray = Array.from(conversationsMap.values()).sort(
        (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
      )

      setConversations(conversationsArray)

      // Auto-select first conversation if none selected
      if (!selectedUserId && conversationsArray.length > 0) {
        setSelectedUserId(conversationsArray[0].user.id)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedUserId || sending) return

    try {
      setSending(true)

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content: messageInput.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const newMessage: Message = await response.json()

      // Update conversations with new message
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) => {
          if (conv.user.id === selectedUserId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage.content,
              lastMessageTime: new Date(newMessage.createdAt),
            }
          }
          return conv
        })

        // Sort conversations by last message time
        return updatedConversations.sort(
          (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        )
      })

      setMessageInput('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Greška pri slanju poruke. Pokušajte ponovno.')
    } finally {
      setSending(false)
    }
  }

  const markAsRead = async (userId: string) => {
    const conversation = conversations.find((c) => c.user.id === userId)
    if (!conversation || conversation.unread === 0) return

    const unreadMessageIds = conversation.messages
      .filter((m) => m.receiverId === session?.user?.id && !m.read)
      .map((m) => m.id)

    if (unreadMessageIds.length === 0) return

    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageIds: unreadMessageIds,
        }),
      })

      // Update local state
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.user.id === userId) {
            return {
              ...conv,
              unread: 0,
              messages: conv.messages.map((msg) =>
                unreadMessageIds.includes(msg.id) ? { ...msg, read: true, readAt: new Date() } : msg
              ),
            }
          }
          return conv
        })
      )
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedUserId) {
      markAsRead(selectedUserId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId])

  // ===== WebRTC Call Functions =====

  // Initiate a call
  const initiateCall = (type: 'VIDEO' | 'AUDIO') => {
    if (!selectedUserId || !session?.user?.id || !socket) return

    const selectedConv = conversations.find((c) => c.user.id === selectedUserId)
    if (!selectedConv) return

    const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Emit call initiation
    socket.emit('call:initiate', {
      callerId: session.user.id,
      receiverId: selectedUserId,
      type,
      roomId,
    })

    // Listen for call initiated confirmation
    socket.once('call:initiated', (data: { callId: string; roomId: string }) => {
      setActiveCall({
        callId: data.callId,
        roomId: data.roomId,
        type,
        isInitiator: true,
        otherUser: selectedConv.user,
      })
    })

    // Listen for errors
    socket.once('call:error', (data: { error: string }) => {
      alert(data.error)
    })
  }

  // Socket listeners for incoming calls
  useEffect(() => {
    if (!socket) return

    socket.on('call:incoming', (data: {
      callId: string
      caller: {
        id: string
        name: string
        avatar: string | null
      }
      type: 'VIDEO' | 'AUDIO'
      roomId: string
    }) => {
      setIncomingCall({
        callId: data.callId,
        roomId: data.roomId,
        type: data.type,
        caller: data.caller,
      })
    })

    socket.on('call:rejected', () => {
      alert('Poziv je odbijen')
      setActiveCall(null)
    })

    return () => {
      socket.off('call:incoming')
      socket.off('call:rejected')
    }
  }, [socket])

  // Accept incoming call
  const acceptCall = () => {
    if (!incomingCall) return

    setActiveCall({
      callId: incomingCall.callId,
      roomId: incomingCall.roomId,
      type: incomingCall.type,
      isInitiator: false,
      otherUser: incomingCall.caller,
    })
    setIncomingCall(null)
  }

  // Reject incoming call
  const rejectCall = () => {
    if (!incomingCall || !socket) return

    socket.emit('call:reject', {
      callId: incomingCall.callId,
      callerId: incomingCall.caller.id,
    })
    setIncomingCall(null)
  }

  // Close active call
  const closeCall = () => {
    setActiveCall(null)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const selectedConversation = conversations.find((c) => c.user.id === selectedUserId)

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Poruke</h1>

        {conversations.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nemate poruka</h3>
              <p className="text-gray-600">
                Kontaktirajte instruktore da biste započeli razgovor
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <Card className="lg:col-span-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <Input
                  placeholder="Pretraži poruke..."
                  icon={<Search className="w-5 h-5" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.user.id}
                    onClick={() => setSelectedUserId(conversation.user.id)}
                    className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                      selectedUserId === conversation.user.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar
                          src={conversation.user.avatar}
                          name={conversation.user.name}
                          size="md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.user.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {conversation.unread > 0 && (
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 overflow-hidden flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar
                          src={selectedConversation.user.avatar}
                          name={selectedConversation.user.name}
                          size="md"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.user.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => initiateCall('AUDIO')}
                        disabled={!isConnected || !selectedUserId}
                        title="Audio poziv"
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => initiateCall('VIDEO')}
                        disabled={!isConnected || !selectedUserId}
                        title="Video poziv"
                      >
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === session?.user?.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="mb-1">{message.content}</p>
                            <p
                              className={`text-xs ${
                                message.senderId === session?.user?.id
                                  ? 'text-primary-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatTime(new Date(message.createdAt))}
                            </p>
                          </div>
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Napišite poruku..."
                        className="flex-1 input-field"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        disabled={sending}
                      />
                      <Button
                        variant="primary"
                        onClick={handleSend}
                        disabled={!messageInput.trim() || sending}
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-xl mb-2">Odaberite razgovor</p>
                    <p>Započnite razgovor sa instruktorom</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Active Video Call */}
      {activeCall && session?.user?.id && (
        <VideoCall
          socket={socket}
          currentUserId={session.user.id}
          otherUser={activeCall.otherUser}
          callType={activeCall.type}
          isInitiator={activeCall.isInitiator}
          callId={activeCall.callId}
          roomId={activeCall.roomId}
          onClose={closeCall}
        />
      )}

      {/* Incoming Call */}
      {incomingCall && (
        <IncomingCall
          caller={incomingCall.caller}
          callType={incomingCall.type}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
    </div>
  )
}
