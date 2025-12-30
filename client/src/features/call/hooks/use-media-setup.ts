import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

async function getConnectedDevices(type: 'videoinput' | 'audioinput' | 'audiooutput') {
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter((device) => device.kind === type)
}

export function useMediaSetup() {
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Danh sách thiết bị
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [microDevices, setMicroDevices] = useState<MediaDeviceInfo[]>([])
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([])

  // Thiết bị đang chọn
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [selectedMicro, setSelectedMicro] = useState<string>('')
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('')

  // Trạng thái Media controls
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [audioLevel, setAudioLevel] = useState(0)

  // Trạng thái lỗi
  const [errorMessage, setErrorMessage] = useState<string>()
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [microError, setMicroError] = useState<string | null>(null)
  const [speakerError, setSpeakerError] = useState<string | null>(null)

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const requestRef = useRef<number | null>(null)

  // 1. Helper: Cập nhật danh sách thiết bị
  const updateDeviceList = async (mounted = true) => {
    try {
      const cameras = await getConnectedDevices('videoinput')
      const mics = await getConnectedDevices('audioinput')
      const speakers = await getConnectedDevices('audiooutput')

      if (mounted) {
        setCameraDevices(cameras)
        if (cameras.length === 0) setCameraError('Không tìm thấy camera')
        else setCameraError(null)

        setMicroDevices(mics)
        if (mics.length === 0) setMicroError('Không tìm thấy micro')
        else setMicroError(null)

        setSpeakerDevices(speakers)
        if (speakers.length === 0) setSpeakerError('Không tìm thấy loa')
        else setSpeakerError(null)
      }
    } catch (error) {
      if (mounted) {
        setCameraError('Lỗi tải danh sách thiết bị')
      }
    }
  }

  // 2. Initial Setup: Yêu cầu quyền truy cập thiết bị
  useEffect(() => {
    let mounted = true

    async function initDevices() {
      try {
        const initialStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (mounted) {
          setErrorMessage(undefined)
          setCameraError(null)
          setMicroError(null)
          setSpeakerError(null)
        }

        await updateDeviceList(mounted)

        // Dừng stream ban đầu
        initialStream.getTracks().forEach((t) => t.stop())
      } catch (error: any) {
        toast.error('Lỗi khi truy cập thiết bị')
        if (mounted) {
          setErrorMessage(undefined)
          let msg = 'Lỗi truy cập thiết bị'
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            msg = 'Bạn đã chặn quyền truy cập Camera/Micro'
          } else if (error.name === 'NotFoundError') {
            msg = 'Không tìm thấy thiết bị phù hợp'
          } else if (error.name === 'NotReadableError') {
            msg = 'Thiết bị đang được sử dụng bởi ứng dụng khác'
          }
          setErrorMessage(msg)
        }
      }
    }

    initDevices()

    const handleDeviceChange = () => updateDeviceList(mounted)
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)

    return () => {
      mounted = false
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [])

  // 3. Tự động chọn thiết bị mặc định
  useEffect(() => {
    if (cameraDevices.length > 0 && !selectedCamera) setSelectedCamera(cameraDevices[0].deviceId)
  }, [cameraDevices, selectedCamera])

  useEffect(() => {
    if (microDevices.length > 0 && !selectedMicro) setSelectedMicro(microDevices[0].deviceId)
  }, [microDevices, selectedMicro])

  useEffect(() => {
    if (speakerDevices.length > 0 && !selectedSpeaker)
      setSelectedSpeaker(speakerDevices[0].deviceId)
  }, [speakerDevices, selectedSpeaker])

  // 4. Setup Stream & Mic Test
  useEffect(() => {
    if (!selectedCamera && !selectedMicro) return

    let curStream: MediaStream | null = null

    async function startStream() {
      // Dừng stream cũ & audio context cũ
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }

      try {
        if (errorMessage || cameraError || microError) return

        const constraints: MediaStreamConstraints = {
          video: selectedCamera ? { deviceId: { exact: selectedCamera } } : false,
          audio: selectedMicro ? { deviceId: { exact: selectedMicro } } : false,
        }

        const newStream = await navigator.mediaDevices.getUserMedia(constraints)

        // Cập nhật trạng thái ban đầu
        newStream.getVideoTracks().forEach((t) => (t.enabled = isCameraOn))
        newStream.getAudioTracks().forEach((t) => (t.enabled = isMicOn))

        setStream(newStream)
        curStream = newStream
        setErrorMessage(undefined)

        // VISUALIZE MIC
        if (newStream.getAudioTracks().length > 0) {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext
          const audioContext = new AudioContext()
          const analyser = audioContext.createAnalyser()
          const microphone = audioContext.createMediaStreamSource(newStream)

          microphone.connect(analyser)
          analyser.fftSize = 256

          audioContextRef.current = audioContext
          analyserRef.current = analyser

          const bufferLength = analyser.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)

          const updateAudioLevel = () => {
            if (!analyserRef.current) return
            analyserRef.current.getByteFrequencyData(dataArray)

            let sum = 0
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i]
            }
            const average = sum / bufferLength
            setAudioLevel(Math.min(100, average * 2.5))

            requestRef.current = requestAnimationFrame(updateAudioLevel)
          }

          updateAudioLevel()
        }
      } catch (error) {
        toast.error('Lỗi khi truy cập thiết bị')
        // todo: handle error
      }
    }

    startStream()

    return () => {
      if (curStream) {
        curStream.getTracks().forEach((t) => t.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCamera, selectedMicro, errorMessage])

  // 5. Toggle Actions
  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMicOn
        setIsMicOn(!isMicOn)
      }
    }
  }

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn
        setIsCameraOn(!isCameraOn)
      }
    }
  }

  // 6. Set Speaker
  const setSpeaker = async (videoElement: HTMLVideoElement | null) => {
    const el = videoElement as any
    if (el && 'setSinkId' in el && selectedSpeaker) {
      try {
        await el.setSinkId(selectedSpeaker)
      } catch (err) {
        toast.error('Lỗi khi truy cập thiết bị')
        // todo: handle error
      }
    }
  }

  return {
    stream,
    devices: {
      cameras: cameraDevices,
      mics: microDevices,
      speakers: speakerDevices,
    },
    selection: {
      camera: selectedCamera,
      micro: selectedMicro,
      speaker: selectedSpeaker,
      setCamera: setSelectedCamera,
      setMicro: setSelectedMicro,
      setSpeaker: setSelectedSpeaker,
    },
    status: {
      isMicOn,
      isCameraOn,
      audioLevel,
      toggleMic,
      toggleCamera,
    },
    errors: {
      global: errorMessage,
      camera: cameraError,
      micro: microError,
      speaker: speakerError,
    },
    setSpeakerHelper: setSpeaker,
  }
}
