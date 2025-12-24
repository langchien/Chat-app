import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { Smile } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../theme/theme-provider'

export function InputEmoji({ addEmoji }: { addEmoji: (emoji: string) => void }) {
  const { theme } = useTheme()
  const emojiTheme: Theme = theme === 'dark' ? Theme.DARK : Theme.LIGHT
  const [isOpen, setIsOpen] = useState(false)
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <Smile />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <EmojiPicker
          open={isOpen}
          onEmojiClick={(emojiData) => addEmoji(emojiData.emoji)}
          theme={emojiTheme}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
