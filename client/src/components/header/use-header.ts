import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { toast } from 'sonner'

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

  const handleClose = () => {
    toast.warning('Trình duyệt chặn đóng tab tự động. Vui lòng đóng thủ công.')
  }

  const handleMinimize = () => {
    toast.warning('Minimize không được hỗ trợ trong môi trường trình duyệt')
  }

  // Phần title của app
  const location = useLocation()
  return {
    isFullscreen,
    toggleFullscreen,
    handleClose,
    handleMinimize,
    pathname: location.pathname,
  }
}
