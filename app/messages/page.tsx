'use client'

import React, { useState } from 'react'
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatTime } from '@/lib/utils'

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1')
  const [messageInput, setMessageInput] = useState('')

  // Mock data
  const conversations = [
    {
      id: '1',
      user: {
        id: 'u1',
        name: 'Ana Horvat',
        avatar: null,
        online: true,
      },
      lastMessage: 'Vidimo se sutra u 15h!',
      lastMessageTime: '14:32',
      unread: 2,
    },
    {
      id: '2',
      user: {
        id: 'u2',
        name: 'Marko Novak',
        avatar: null,
        online: false,
      },
      lastMessage: 'Hvala na odličnoj sesiji!',
      lastMessageTime: 'Jučer',
      unread: 0,
    },
    {
      id: '3',
      user: {
        id: 'u3',
        name: 'Petra Kovačić',
        avatar: null,
        online: true,
      },
      lastMessage: 'Mogu li zakazati dodatni termin?',
      lastMessageTime: '10:15',
      unread: 1,
    },
  ]

  const messages = [
    {
      id: 'm1',
      senderId: 'u1',
      content: 'Pozdrav! Imam pitanje o današnjoj lekciji.',
      timestamp: new Date('2025-01-16T10:00:00'),
      read: true,
    },
    {
      id: 'm2',
      senderId: 'me',
      content: 'Naravno, slobodno pitaj!',
      timestamp: new Date('2025-01-16T10:05:00'),
      read: true,
    },
    {
      id: 'm3',
      senderId: 'u1',
      content: 'Možemo li dodatno pokriti temu derivacija?',
      timestamp: new Date('2025-01-16T10:10:00'),
      read: true,
    },
    {
      id: 'm4',
      senderId: 'me',
      content: 'Da, naravno! Pripremit ću dodatne materijale.',
      timestamp: new Date('2025-01-16T10:15:00'),
      read: true,
    },
    {
      id: 'm5',
      senderId: 'u1',
      content: 'Vidimo se sutra u 15h!',
      timestamp: new Date('2025-01-16T14:32:00'),
      read: true,
    },
  ]

  const handleSend = () => {
    if (messageInput.trim()) {
      // Handle sending message
      console.log('Sending:', messageInput)
      setMessageInput('')
    }
  }

  const selectedConversation = conversations.find((c) => c.id === selectedChat)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Poruke</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <Input
                placeholder="Pretraži poruke..."
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                    selectedChat === conversation.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar
                        src={conversation.user.avatar}
                        name={conversation.user.name}
                        size="md"
                      />
                      {conversation.user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.user.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessageTime}
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
                      {selectedConversation.user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.user.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.user.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === 'me' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === 'me'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="mb-1">{message.content}</p>
                        <p
                          className={`text-xs ${
                            message.senderId === 'me'
                              ? 'text-primary-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
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
                        if (e.key === 'Enter') {
                          handleSend()
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      onClick={handleSend}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-5 h-5" />
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
      </div>
    </div>
  )
}
