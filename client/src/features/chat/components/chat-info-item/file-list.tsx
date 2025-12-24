import type { IMedia } from '@/types/api.types'
import { File } from 'lucide-react'
import { use } from 'react'
import { Link } from 'react-router'

export function ChatFileList({ mediaPromise }: { mediaPromise: Promise<IMedia[]> }) {
  const allMedia = use(mediaPromise)
  const files = allMedia.filter((m) => !['image', 'video', 'video_hls'].includes(m.type))

  if (files.length === 0) {
    return <div className='text-sm text-center text-muted-foreground py-2'>Không có file nào</div>
  }

  return (
    <div className='space-y-2'>
      {files.map((file) => (
        <Link
          key={file.id}
          to={file.url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 p-2 rounded hover:bg-muted group'
        >
          <div className='bg-muted-foreground/10 p-2 rounded'>
            <File className='size-5 text-muted-foreground group-hover:text-foreground' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium truncate'>{file.originalName}</p>
            <span className='text-xs text-muted-foreground'>{file.type}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
