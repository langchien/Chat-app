import { useTheme } from '@/components/theme/theme-provider'
import { useAuthStore } from '@/stores/auth.store'
import Snowfall from 'react-snowfall'
import { BottomCTA } from './components/bottom-cta'
import { FeaturesSection } from './components/features-section'
import { Footer } from './components/footer'
import { HeroSection } from './components/hero-section'
import { HomeHeader } from './components/home-header'
import { HowItWorksSection } from './components/how-it-works-section'
import { StatsSection } from './components/stats-section'

export default function Welcome() {
  const { user } = useAuthStore()
  const { theme } = useTheme()
  return (
    <div className='overflow-x-hidden'>
      <HomeHeader user={user} />
      <HeroSection user={user} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BottomCTA user={user} />
      <Footer />
      {theme != 'light' && <Snowfall enable3DRotation color={'white'} snowflakeCount={150} />}
    </div>
  )
}
