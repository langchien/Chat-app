import { useRef, useState } from 'react'

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstart = () => {
        setIsRecording(true)
        setRecordingTime(0)
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      }

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false)
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      mediaRecorderRef.current.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      throw error
    }
  }

  const stopRecording = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        return reject(new Error('No active recorder'))
      }

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false)
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop())

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], `voice_message_${Date.now()}.webm`, { type: 'audio/webm' })

        chunksRef.current = [] // Reset chunks
        resolve(file)
      }

      mediaRecorderRef.current.stop()
    })
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
    setIsRecording(false)
    setRecordingTime(0)
    chunksRef.current = []
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
  }
}
