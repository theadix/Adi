'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import VerificationBadge from '@/components/common/VerificationBadge';

interface Feature {
  text: string;
  included: boolean;
}

interface Package {
  id: string;
  name: string;
  platform: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  description: string;
  deliveryTime: string;
  features: Feature[];
  quantity: string;
  retention: string;
}

interface PackageCardProps {
  package: Package;
  onConsultation: (pkg: Package) => void;
}

const PackageCard = ({ package: pkg, onConsultation }: PackageCardProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const savings = pkg.originalPrice ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100) : 0;

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-subtle">
        <div className="h-6 bg-surface rounded mb-4 animate-pulse" />
        <div className="h-10 bg-surface rounded mb-4 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-surface rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-card rounded-xl border ${pkg.popular ? 'border-primary shadow-premium' : 'border-border shadow-subtle'} p-6 smooth-transition hover:shadow-lg ${pkg.popular ? 'scale-105' : 'hover:scale-102'}`}>
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <VerificationBadge label="Most Popular" size="sm" />
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-headline font-bold text-text-primary mb-2">
          {pkg.name}
        </h3>
        <p className="text-sm text-text-secondary mb-4">{pkg.description}</p>
        
        {pkg.price > 0 ? (
          <>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-headline font-bold text-primary">
                ₹{pkg.price}
              </span>
              {pkg.originalPrice && (
                <span className="text-xl text-text-secondary line-through">
                  ₹{pkg.originalPrice}
                </span>
              )}
            </div>
            
            {savings > 0 && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-semibold">
                <Icon name="ArrowTrendingDownIcon" size={16} variant="solid" />
                <span>Save {savings}%</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-2xl font-headline font-bold text-primary">
            Contact for Pricing
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-3 border-t border-border">
          <span className="text-sm text-text-secondary">Quantity</span>
          <span className="font-semibold text-text-primary">{pkg.quantity}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-border">
          <span className="text-sm text-text-secondary">Delivery Time</span>
          <span className="font-semibold text-text-primary">{pkg.deliveryTime}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {pkg.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Icon
              name={feature.included ? 'CheckCircleIcon' : 'XCircleIcon'}
              size={20}
              variant="solid"
              className={feature.included ? 'text-success' : 'text-text-secondary/30'}
            />
            <span className={`text-sm ${feature.included ? 'text-text-primary' : 'text-text-secondary/50'}`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onConsultation(pkg)}
        className={`w-full py-3 rounded-lg font-headline font-semibold smooth-transition ${
          pkg.popular
            ? 'bg-primary text-white hover:bg-secondary shadow-subtle hover:shadow-premium'
            : 'bg-surface text-primary border border-primary hover:bg-primary hover:text-white'
        }`}
      >
        Chat on WhatsApp/Telegram
      </button>
    </div>
  );
};

export default PackageCard;
