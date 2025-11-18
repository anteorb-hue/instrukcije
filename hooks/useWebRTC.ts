import { useEffect, useRef, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'

interface UseWebRTCProps {
  socket: Socket | null
  currentUserId: string
  otherUserId: string
  callType: 'VIDEO' | 'AUDIO'
  isInitiator: boolean
  callId?: string
  roomId: string
  onCallEnd?: () => void
}

export function useWebRTC({
  socket,
  currentUserId,
  otherUserId,
  callType,
  isInitiator,
  callId,
  roomId,
  onCallEnd,
}: UseWebRTCProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const currentCallIdRef = useRef<string | undefined>(callId)

  // ICE servers configuration (STUN/TURN)
  const iceServers: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  }

  // Initialize local media stream
  const initializeLocalStream = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callType === 'VIDEO' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        } : false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setLocalStream(stream)
      return stream
    } catch (err) {
      console.error('Error accessing media devices:', err)
      setError('Greška pri pristupu kameri/mikrofonu')
      throw err
    }
  }, [callType])

  // Create peer connection
  const createPeerConnection = useCallback((stream: MediaStream) => {
    const pc = new RTCPeerConnection(iceServers)

    // Add local tracks to peer connection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream)
    })

    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind)
      setRemoteStream(event.streams[0])
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log('Sending ICE candidate')
        socket.emit('call:ice-candidate', {
          targetUserId: otherUserId,
          candidate: event.candidate.toJSON(),
        })
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState)
      if (pc.connectionState === 'connected') {
        setIsConnected(true)
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsConnected(false)
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState)
    }

    peerConnectionRef.current = pc
    return pc
  }, [socket, otherUserId, iceServers])

  // Create and send offer (for initiator)
  const createOffer = useCallback(async (pc: RTCPeerConnection) => {
    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      if (socket && currentCallIdRef.current) {
        socket.emit('call:offer', {
          callId: currentCallIdRef.current,
          offer: offer,
          receiverId: otherUserId,
        })
        console.log('Offer sent')
      }
    } catch (err) {
      console.error('Error creating offer:', err)
      setError('Greška pri kreiranju poziva')
    }
  }, [socket, otherUserId])

  // Handle incoming offer (for receiver)
  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      const pc = peerConnectionRef.current
      if (!pc) return

      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      if (socket && currentCallIdRef.current) {
        socket.emit('call:answer', {
          callId: currentCallIdRef.current,
          answer: answer,
          callerId: otherUserId,
        })
        console.log('Answer sent')
      }
    } catch (err) {
      console.error('Error handling offer:', err)
      setError('Greška pri prihvatanju poziva')
    }
  }, [socket, otherUserId])

  // Handle incoming answer (for initiator)
  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      const pc = peerConnectionRef.current
      if (!pc) return

      await pc.setRemoteDescription(new RTCSessionDescription(answer))
      console.log('Answer received and set')
    } catch (err) {
      console.error('Error handling answer:', err)
      setError('Greška pri povezivanju')
    }
  }, [])

  // Handle incoming ICE candidate
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    try {
      const pc = peerConnectionRef.current
      if (!pc) return

      await pc.addIceCandidate(new RTCIceCandidate(candidate))
      console.log('ICE candidate added')
    } catch (err) {
      console.error('Error adding ICE candidate:', err)
    }
  }, [])

  // Initialize call
  useEffect(() => {
    let mounted = true

    const setupCall = async () => {
      try {
        // Get local media stream
        const stream = await initializeLocalStream()
        if (!mounted) return

        // Create peer connection
        const pc = createPeerConnection(stream)

        // If initiator, create and send offer
        if (isInitiator) {
          await createOffer(pc)
        }
      } catch (err) {
        console.error('Error setting up call:', err)
      }
    }

    setupCall()

    return () => {
      mounted = false
    }
  }, [initializeLocalStream, createPeerConnection, isInitiator, createOffer])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    // Update call ID ref when it changes
    currentCallIdRef.current = callId

    // Listen for offer
    socket.on('call:offer', (data: { callId: string; offer: RTCSessionDescriptionInit }) => {
      if (data.callId === currentCallIdRef.current) {
        handleOffer(data.offer)
      }
    })

    // Listen for answer
    socket.on('call:answer', (data: { callId: string; answer: RTCSessionDescriptionInit }) => {
      if (data.callId === currentCallIdRef.current) {
        handleAnswer(data.answer)
      }
    })

    // Listen for ICE candidates
    socket.on('call:ice-candidate', (data: { candidate: RTCIceCandidateInit }) => {
      handleIceCandidate(data.candidate)
    })

    // Listen for call ended
    socket.on('call:ended', () => {
      cleanup()
      onCallEnd?.()
    })

    return () => {
      socket.off('call:offer')
      socket.off('call:answer')
      socket.off('call:ice-candidate')
      socket.off('call:ended')
    }
  }, [socket, callId, handleOffer, handleAnswer, handleIceCandidate, onCallEnd])

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop all tracks in local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    setRemoteStream(null)
    setIsConnected(false)
  }, [localStream])

  // End call
  const endCall = useCallback(() => {
    if (socket && currentCallIdRef.current) {
      socket.emit('call:end', {
        callId: currentCallIdRef.current,
        userId: currentUserId,
        otherUserId: otherUserId,
      })
    }
    cleanup()
    onCallEnd?.()
  }, [socket, currentUserId, otherUserId, cleanup, onCallEnd])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return audioTrack.enabled
      }
    }
    return false
  }, [localStream])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream && callType === 'VIDEO') {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return videoTrack.enabled
      }
    }
    return false
  }, [localStream, callType])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    localStream,
    remoteStream,
    isConnected,
    error,
    endCall,
    toggleAudio,
    toggleVideo,
  }
}
