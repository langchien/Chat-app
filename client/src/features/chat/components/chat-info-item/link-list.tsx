import { use } from 'react'
import { Link } from 'react-router'
import type { IChatLink } from '../../services'

export function LinksList({ linksPromise }: { linksPromise: Promise<IChatLink[]> }) {
  const links = use(linksPromise)
  if (links.length === 0) {
    return (
      <div className='text-sm text-center text-muted-foreground py-2'>Không có liên kết nào</div>
    )
  }
  return (
    <div className='space-y-2'>
      {links.map((link, i) => (
        <Link
          key={i}
          to={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='block p-2 text-sm bg-muted/50 rounded hover:bg-muted break-all text-blue-500 hover:underline'
        >
          {link.url}
        </Link>
      ))}
    </div>
  )
}
