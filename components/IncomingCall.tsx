'use client'

import React from 'react'
import { Phone, PhoneOff, Video } from 'lucide-react'
import Avatar from './ui/Avatar'
import Button from './ui/Button'

interface IncomingCallProps {
  caller: {
    id: string
    name: string
    avatar: string | null
  }
  callType: 'VIDEO' | 'AUDIO'
  onAccept: () => void
  onReject: () => void
}

export default function IncomingCall({
  caller,
  callType,
  onAccept,
  onReject,
}: IncomingCallProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Caller Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Avatar src={caller.avatar} name={caller.name} size="xl" />
              <div className="absolute -bottom-2 -right-2 bg-primary-600 rounded-full p-2">
                {callType === 'VIDEO' ? (
                  <Video className="w-5 h-5 text-white" />
                ) : (
                  <Phone className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Caller Info */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{caller.name}</h3>
          <p className="text-gray-600 mb-8">
            {callType === 'VIDEO' ? 'Video poziv...' : 'Audio poziv...'}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {/* Reject */}
            <button
              onClick={onReject}
              className="p-6 bg-red-500 hover:bg-red-600 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>

            {/* Accept */}
            <button
              onClick={onAccept}
              className="p-6 bg-green-500 hover:bg-green-600 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Phone className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Hint */}
          <p className="text-sm text-gray-500 mt-6">
            Pritisnite zeleno dugme da prihvatite poziv
          </p>
        </div>
      </div>
    </div>
  )
}
