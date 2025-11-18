'use client'

import React, { useRef, useEffect, useState } from 'react'
import { X, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react'
import { Socket } from 'socket.io-client'
import { useWebRTC } from '@/hooks/useWebRTC'
import Avatar from './ui/Avatar'
import Button from './ui/Button'

interface VideoCallProps {
  socket: Socket | null
  currentUserId: string
  otherUser: {
    id: string
    name: string
    avatar: string | null
  }
  callType: 'VIDEO' | 'AUDIO'
  isInitiator: boolean
  callId?: string
  roomId: string
  onClose: () => void
}

export default function VideoCall({
  socket,
  currentUserId,
  otherUser,
  callType,
  isInitiator,
  callId,
  roomId,
  onClose,
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const {
    localStream,
    remoteStream,
    isConnected,
    error,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useWebRTC({
    socket,
    currentUserId,
    otherUserId: otherUser.id,
    callType,
    isInitiator,
    callId,
    roomId,
    onCallEnd: onClose,
  })

  // Set local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  // Set remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  // Call duration timer
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isConnected])

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleAudio = () => {
    const enabled = toggleAudio()
    setIsMuted(!enabled)
  }

  const handleToggleVideo = () => {
    const enabled = toggleVideo()
    setIsVideoOff(!enabled)
  }

  const handleEndCall = () => {
    endCall()
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar src={otherUser.avatar} name={otherUser.name} size="md" />
            <div className="text-white">
              <h3 className="font-semibold">{otherUser.name}</h3>
              <p className="text-sm text-gray-300">
                {isConnected ? formatDuration(callDuration) : 'Povezivanje...'}
              </p>
            </div>
          </div>
          <button
            onClick={handleEndCall}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Video containers */}
      <div className="flex-1 relative">
        {/* Remote video (full screen) */}
        <div className="absolute inset-0">
          {callType === 'VIDEO' && remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <Avatar src={otherUser.avatar} name={otherUser.name} size="xl" />
                <p className="text-white mt-4 text-lg">{otherUser.name}</p>
                {!isConnected && (
                  <p className="text-gray-400 mt-2">Zove...</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local video (picture-in-picture) */}
        {callType === 'VIDEO' && (
          <div className="absolute top-20 right-4 w-40 h-30 bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-white/20">
            {localStream && !isVideoOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Audio-only indicator */}
        {callType === 'AUDIO' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
            <div className="text-center">
              <Avatar src={otherUser.avatar} name={otherUser.name} size="xl" />
              <p className="text-white mt-4 text-xl font-semibold">{otherUser.name}</p>
              <p className="text-primary-100 mt-2">
                {isConnected ? formatDuration(callDuration) : 'Pozivanje...'}
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl">
            {error}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute/Unmute */}
          <button
            onClick={handleToggleAudio}
            className={`p-4 rounded-full transition-all ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all scale-110"
          >
            <Phone className="w-6 h-6 text-white transform rotate-135" />
          </button>

          {/* Video On/Off (only for video calls) */}
          {callType === 'VIDEO' && (
            <button
              onClick={handleToggleVideo}
              className={`p-4 rounded-full transition-all ${
                isVideoOff
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6 text-white" />
              ) : (
                <Video className="w-6 h-6 text-white" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
