import { WebLogo } from '@/components/web-logo'
import { FileText, Globe, Rss } from 'lucide-react'
import { Link } from 'react-router'
import { FooterColumn } from './footer-column'

export function Footer() {
  return (
    <footer className='border-t border-border-dark pt-16 pb-8 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12'>
          <div className='lg:col-span-2'>
            <WebLogo />
            <p className='text-gray-400 text-sm leading-relaxed max-w-xs mb-6'>
              Nền tảng tất cả trong một cho giao tiếp nhóm hiện đại. Nhanh chóng, an toàn và đáng
              tin cậy.
            </p>
            <div className='flex gap-4'>
              <Link className='text-gray-400 hover:text-primary transition-colors' to='#'>
                <Globe className='w-6 h-6' />
              </Link>
              <Link className='text-gray-400 hover:text-primary transition-colors' to='#'>
                <FileText className='w-6 h-6' />
              </Link>
              <Link className='text-gray-400 hover:text-primary transition-colors' to='#'>
                <Rss className='w-6 h-6' />
              </Link>
            </div>
          </div>
          <FooterColumn
            title='Sản phẩm'
            links={[
              { label: 'Tính năng', href: '#features' },
              { label: 'Bảng giá', href: '#' },
              { label: 'Tải xuống', href: '#' },
              { label: 'Tích hợp', href: '#' },
            ]}
          />
          <FooterColumn
            title='Tài nguyên'
            links={[
              { label: 'Tài liệu', href: '#' },
              { label: 'API', href: '#' },
              { label: 'Blog', href: '#' },
              { label: 'GitHub', href: '#' },
            ]}
          />
          <FooterColumn
            title='Công ty'
            links={[
              { label: 'Về chúng tôi', href: '#' },
              { label: 'Liên hệ', href: '#' },
              { label: 'Chính sách riêng tư', href: '#' },
              { label: 'Điều khoản dịch vụ', href: '#' },
            ]}
          />
        </div>
        <div className='border-t border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-gray-500'>
            © 2025 ChatApp Inc. Tất cả các quyền được bảo vệ.
          </p>
          <div className='flex gap-6'>
            <span className='text-xs text-gray-500'>Tiếng Việt (VN)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
