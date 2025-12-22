import type { IMedia } from '@/types/api.types'

import { FileDownIcon } from 'lucide-react'
import { Link } from 'react-router'

export function MessageFile({ files }: { files: IMedia[] }) {
  return (
    <div className='flex flex-col space-y-2'>
      {files.map((file) => (
        <Link
          key={file.id}
          to={file.url}
          rel='noopener noreferrer'
          target='_blank'
          className='flex w-min space-x-2 items-center rounded-lg bg-gray-200 p-2 dark:bg-gray-800'
        >
          <p className='max-w-40 truncate text-sm font-medium text-gray-900 dark:text-white'>
            {file.originalName}
          </p>
          <FileDownIcon className='size-7 text-gray-500' />
        </Link>
      ))}
    </div>
  )
}
