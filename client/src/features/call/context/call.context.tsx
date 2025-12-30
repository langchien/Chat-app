import { SOCKET_EVENTS } from '@/constants/event.const'
import { useSocketStore } from '@/stores/socket.store'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

interface IncomingCall {
  offer: RTCSessionDescriptionInit
  from: string
  user: any // Caller user info
  socket: string // socketId of caller
  isVideo: boolean
}

interface CallContextType {
  isCalling: boolean
  incomingCall: IncomingCall | null
  activeCall: boolean
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  isVideoCall: boolean // true for video, false for voice
  remoteUser: any | null
  startCall: (targetUser: any, options: { isVideo: boolean }) => Promise<void>
  answerCall: () => void
  rejectCall: () => void
  hangUp: () => void
  toggleMic: () => void
  toggleCamera: () => void
  isMicOn: boolean
  isCameraOn: boolean
  callDuration: number // seconds
}

const CallContext = createContext<CallContextType | undefined>(undefined)

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
}

export function CallProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocketStore()

  // State
  const [isCalling, setIsCalling] = useState(false) // Outgoing pending
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const [activeCall, setActiveCall] = useState(false) // Connected
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [remoteUser, setRemoteUser] = useState<any | null>(null)

  // Media Controls State
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  // Refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const targetSocketIdRef = useRef<string | null>(null)
  const targetUserIdRef = useRef<string | null>(null) // To send socket events
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up function
  const cleanUpCall = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    setLocalStream(null)
    setRemoteStream(null)
    setIsCalling(false)
    setIncomingCall(null)
    setActiveCall(false)
    setIsMicOn(true)
    setActiveCall(false)
    setIsMicOn(true)
    setIsCameraOn(true)
    setRemoteUser(null)
    setCallDuration(0)
    targetSocketIdRef.current = null
    targetUserIdRef.current = null

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [localStream]) // LocalStream dependency is tricky, better to just suppress or check ref
  // Ideally localStream should be a ref too if we want to access it in cleanup without triggering rebuilds

  // --- Handlers ---

  // ... (keeping other handlers same but assume I only replace top and bottom)

  // --- Handlers ---

  const startCall = async (targetUser: any, { isVideo }: { isVideo: boolean }) => {
    if (activeCall || isCalling) return

    setIsCalling(true)
    setIsVideoCall(isVideo)
    setRemoteUser(targetUser)
    const targetUserId = targetUser.id || targetUser.userId
    targetUserIdRef.current = targetUserId

    try {
      // 1. Get Stream
      const myStream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true,
      })
      setLocalStream(myStream)
      if (isVideo) setIsCameraOn(true)
      setIsMicOn(true)

      // 2. Create PC
      const pc = new RTCPeerConnection(ICE_SERVERS)
      peerConnectionRef.current = pc

      // 3. Add Tracks
      myStream.getTracks().forEach((track) => {
        pc.addTrack(track, myStream!)
      })

      // 4. Handle ICE
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit(SOCKET_EVENTS.ICE_CANDIDATE, {
            to: targetUserId,
            candidate: event.candidate,
          })
        }
      }

      // 5. Handle Remote Stream
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
      }

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setActiveCall(true)
          setIsCalling(false)
          // Start timer
          timerRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1)
          }, 1000)
        }
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          hangUp()
        }
      }

      // 6. Create Offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // 7. Emit
      socket?.emit(SOCKET_EVENTS.CALL_USER, {
        to: targetUserId,
        offer,
        isVideo,
      })
    } catch (error) {
      console.error(error)
      toast.error('Không thể bắt đầu cuộc gọi')
      cleanUpCall()
    }
  }

  const answerCall = async () => {
    if (!incomingCall) return

    setIsVideoCall(incomingCall.isVideo)
    setRemoteUser(incomingCall.user)
    targetSocketIdRef.current = incomingCall.socket
    targetUserIdRef.current = incomingCall.from

    try {
      // 1. Get Stream
      const myStream = await navigator.mediaDevices.getUserMedia({
        video: incomingCall.isVideo,
        audio: true,
      })
      setLocalStream(myStream)
      if (incomingCall.isVideo) setIsCameraOn(true)
      setIsMicOn(true)

      // 2. Create PC
      const pc = new RTCPeerConnection(ICE_SERVERS)
      peerConnectionRef.current = pc

      // 3. Add tracks
      myStream.getTracks().forEach((track) => pc.addTrack(track, myStream))

      // 4. Handle ICE
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // Warning: sending to userId or socketId?
          // The server expects "to" which is userId usually for mapped lookup.
          // But wait, server logic uses `onlineUsers.get(to)`. So `to` must be userId.
          // incomingCall.from is the userId.
          socket?.emit(SOCKET_EVENTS.ICE_CANDIDATE, {
            to: incomingCall.from,
            candidate: event.candidate,
          })
        }
      }

      // 5. Remote Stream
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
      }

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setActiveCall(true)
          setIncomingCall(null) // Clear modal
          // Start timer
          timerRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1)
          }, 1000)
        }
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          hangUp()
        }
      }

      // 6. Set Remote Description
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer))

      // 7. Create Answer
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      // 8. Emit Answer
      socket?.emit(SOCKET_EVENTS.MAKE_ANSWER, {
        to: incomingCall.from,
        answer,
      })

      // Optimistic state update
      setIncomingCall(null)
      setActiveCall(true)
    } catch (error) {
      console.error(error)
      toast.error('Lỗi khi trả lời cuộc gọi')
      cleanUpCall()
    }
  }

  const rejectCall = () => {
    if (incomingCall && socket) {
      socket.emit(SOCKET_EVENTS.CALL_REJECTED, {
        to: incomingCall.from,
      })
    }
    setIncomingCall(null)
  }

  const hangUp = () => {
    if (targetUserIdRef.current && socket) {
      socket.emit(SOCKET_EVENTS.HANG_UP, {
        to: targetUserIdRef.current,
      })
    }
    cleanUpCall()
  }

  const toggleMic = () => {
    if (localStream) {
      const track = localStream.getAudioTracks()[0]
      if (track) {
        track.enabled = !isMicOn
        setIsMicOn(!isMicOn)
      }
    }
  }

  const toggleCamera = () => {
    if (localStream && isVideoCall) {
      const track = localStream.getVideoTracks()[0]
      if (track) {
        track.enabled = !isCameraOn
        setIsCameraOn(!isCameraOn)
      }
    }
  }

  // --- Socket Listeners ---
  useEffect(() => {
    if (!socket) return

    socket.on(SOCKET_EVENTS.CALL_MADE, (data) => {
      // Only accept if not currently in call
      if (activeCall || isCalling) {
        // busy?
        // optionally emit "busy"
        return
      }
      setIncomingCall({
        offer: data.offer,
        from: data.from,
        user: data.user,
        socket: data.socket,
        isVideo: data.isVideo,
      })
    })

    socket.on(SOCKET_EVENTS.ANSWER_MADE, async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer))
        setActiveCall(true)
        setIsCalling(false)
      }
    })

    socket.on(SOCKET_EVENTS.ICE_CANDIDATE, async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
      }
    })

    socket.on(SOCKET_EVENTS.HANG_UP, () => {
      toast.info('Cuộc gọi đã kết thúc')
      cleanUpCall()
    })

    socket.on(SOCKET_EVENTS.CALL_REJECTED, () => {
      toast.info('Người dùng bận hoặc từ chối cuộc gọi')
      cleanUpCall()
    })

    return () => {
      socket.off(SOCKET_EVENTS.CALL_MADE)
      socket.off(SOCKET_EVENTS.ANSWER_MADE)
      socket.off(SOCKET_EVENTS.ICE_CANDIDATE)
      socket.off(SOCKET_EVENTS.HANG_UP)
      socket.off(SOCKET_EVENTS.CALL_REJECTED)
    }
  }, [socket, activeCall, isCalling])

  return (
    <CallContext.Provider
      value={{
        isCalling,
        incomingCall,
        activeCall,
        localStream,
        remoteStream,
        isVideoCall,
        remoteUser,
        startCall,
        answerCall,
        rejectCall,
        hangUp,
        toggleMic,
        toggleCamera,
        isMicOn,
        isCameraOn,
        callDuration,
      }}
    >
      {children}
    </CallContext.Provider>
  )
}

export const useCall = () => {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error('useCall must be used within a CallProvider')
  }
  return context
}
