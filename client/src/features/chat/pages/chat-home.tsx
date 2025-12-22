import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import Autoplay from 'embla-carousel-autoplay'
import { Lock, MessageCircle, Rocket, Smartphone, Video, Zap } from 'lucide-react'
import React from 'react'

const features = [
  {
    title: 'Kết nối mọi lúc, mọi nơi',
    description:
      'Ứng dụng chat hiện đại với tin nhắn tức thời và cuộc gọi video chất lượng cao. Kết nối với bạn bè và đồng nghiệp một cách dễ dàng.',
    icon: Zap,
  },
  {
    title: 'Chat Real-time',
    description:
      'Gửi và nhận tin nhắn tức thời với độ trễ cực thấp. Hỗ trợ văn bản, emoji, hình ảnh và file đính kèm.',
    icon: MessageCircle,
  },
  {
    title: 'Gọi Video Trực Tuyến',
    description:
      'Cuộc gọi video HD với chất lượng ổn định. Hỗ trợ gọi 1-1 và gọi nhóm với nhiều người tham gia.',
    icon: Video,
  },
  {
    title: 'Siêu nhanh',
    description: 'Tối ưu hiệu suất để mang lại trải nghiệm mượt mà, không gián đoạn.',
    icon: Rocket,
  },
  {
    title: 'Bảo mật',
    description: 'Dữ liệu của bạn được bảo vệ an toàn với các tiêu chuẩn mã hóa cao nhất.',
    icon: Lock,
  },
  {
    title: 'Đa nền tảng',
    description: 'Sử dụng trên mọi thiết bị, từ điện thoại, máy tính bảng đến máy tính.',
    icon: Smartphone,
  },
]

const ChatHome: React.FC = () => {
  const plugin = React.useRef(Autoplay({ delay: 2000 }))

  return (
    <div className='h-full w-full dark:text-white bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col space-y-6 items-center justify-center px-5'>
      <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6'>
        <Zap className='w-4 h-4 text-blue-400' />
        <span className='text-sm text-blue-400 font-medium'>Kết nối mọi lúc, mọi nơi</span>
      </div>
      <h1 className='text-xl font-bold text-slate-400 max-w-2xl mx-auto text-center'>
        Ứng dụng chat hiện đại với tin nhắn tức thời và cuộc gọi video chất lượng cao. Kết nối với
        bạn bè và đồng nghiệp một cách dễ dàng.
      </h1>
      <div className=' flex items-center justify-center px-10 w-full'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full '
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent>
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <CarouselItem key={index} className='basis-full md:basis-2/3 xl:basis-1/3 p-2'>
                  <div className='px-5'>
                    <Item
                      variant={'outline'}
                      className='h-full group mb-6 dark:bg-blue-300/20 border border-blue-300/60 dark:border-blue-500/60 hover:bg-blue-400/30 hover:border-blue-500/80 transition-all shadow-lg'
                    >
                      <ItemMedia>
                        <IconComponent className='size-20  text-blue-300 group-hover:text-blue-400' />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className='font-bold text-xl'>{feature.title}</ItemTitle>
                        <ItemDescription className='opacity-90 min-h-40'>
                          {feature.description}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default ChatHome
