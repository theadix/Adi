import type { Metadata } from 'next';
import PricingPackagesClient from './PricingPackagesClient';

export const metadata: Metadata = {
  title: 'Pricing Packages - SocialBoost Pro',
  description:
    'Transparent pricing for premium social media growth services.',
};

export default function Page() {
  return <PricingPackagesClient />;
}
