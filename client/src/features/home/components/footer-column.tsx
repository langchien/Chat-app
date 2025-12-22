import { Link } from 'react-router'

interface FooterLink {
  label: string
  href: string
}

interface FooterColumnProps {
  title: string
  links: FooterLink[]
}

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className='font-bold mb-4'>{title}</h4>
      <ul className='space-y-3 text-sm text-gray-400'>
        {links.map((link, index) => (
          <li key={index}>
            <Link className='hover:text-primary transition-colors' to={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
