import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'SocialBoost Pro - Authentic Social Media Growth Services',
  description:
    'Your trusted partner for authentic social media growth through manual verification, quality assurance, and personalized support.',
};

export default function Page() {
  return <HomePageClient />;
}
