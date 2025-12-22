import { MessageSquare, PlayCircle, Radio, Shield, UploadCloud, Video } from 'lucide-react'

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Tin nhắn thời gian thực',
    description: 'Gửi tin nhắn tức thì với chỉ báo đang nhập, thông báo đã đọc và lưu trữ lịch sử.',
  },
  {
    icon: Video,
    title: 'Gọi Thoại & Video',
    description: 'Âm thanh trong trẻo và gọi video HD. Cuộc gọi 1-1 hoặc họp nhóm đơn giản.',
  },
  {
    icon: UploadCloud,
    title: 'Tải tệp lên',
    description:
      'Chia sẻ tài liệu, hình ảnh và tệp dự án an toàn với nhóm của bạn. Hỗ trợ kéo thả.',
  },
  {
    icon: PlayCircle,
    title: 'Lưu trữ Video',
    description:
      'Tải lên và lưu trữ nội dung video trực tiếp trên nền tảng cho các cập nhật không đồng bộ.',
  },
  {
    icon: Radio,
    title: 'Phát trực tiếp',
    description: 'Phát sóng cho toàn bộ tổ chức hoặc thế giới với khả năng streaming độ trễ thấp.',
  },
  {
    icon: Shield,
    title: 'Bảo mật & Riêng tư',
    description:
      'Dữ liệu của bạn là của bạn. Chúng tôi sử dụng các giao thức mã hóa tiêu chuẩn ngành.',
  },
]

export function FeaturesSection() {
  return (
    <section className='py-20 lg:py-28' id='features'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='text-3xl md:text-4xl font-black dark:text-white mb-4'>
            Mọi thứ bạn cần để giao tiếp
          </h2>
          <p className='text-lg font-bold text-gray-400'>
            Từ tin nhắn văn bản đến streaming video HD, nền tảng của chúng tôi cung cấp bộ công cụ
            hoàn chỉnh để cộng tác hiệu quả.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className='group p-8 rounded-xl bg-surface-dark border border-border-dark hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5'
            >
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors'>
                <feature.icon className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
              <p className='text-gray-400 leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
