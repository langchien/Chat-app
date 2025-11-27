import type { IMedia } from '@/services/api.types'
import { FileDownIcon } from 'lucide-react'
import { Link } from 'react-router'

/**
 * A component to display a file attachment in a message.
 * It shows the filename and provides a download button.
 * @param media - The media object containing the file url.
 */
export function MessageFile({ medias }: { medias: IMedia[] }) {
  const files = medias.filter((media) => media.type === 'file')
  const file = files[0]
  if (!file) return null
  // Extract filename from URL.
  const fileName = file.url.split('/').pop() || 'File'

  return (
    <Link
      to={file.url}
      rel='noopener noreferrer'
      target='_blank'
      className='flex max-w-sm items-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800'
    >
      <div className='shrink-0'>
        <FileDownIcon className='h-8 w-8 text-gray-500' />
      </div>
      <div className='ml-3 flex-1 min-w-0'>
        <p className='truncate text-sm font-medium text-gray-900 dark:text-white'>{fileName}</p>
      </div>
    </Link>
  )
}
