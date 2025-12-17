import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

export function useHeader() {
  // Phần fake window, chỉ có chức năng full screen hoạt động
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Phần title của app
  const location = useLocation()
  return {
    isFullscreen,
    toggleFullscreen,
    pathname: location.pathname,
  }
}
