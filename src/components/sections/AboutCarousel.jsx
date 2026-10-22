'use client';

import { useState } from 'react';
import FlexCarousel from '@/components/ui/FlexCarousel';

const values = [
  {
    src: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&q=80&auto=format&fit=max',
    alt: 'Futuristic light trails representing innovation',
    title: 'Relentless Innovation',
    subtitle: 'Always pushing boundaries',
    description: 'We constantly explore emerging technologies and creative frontiers to deliver work that leads, rather than follows.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80&auto=format&fit=max',
    alt: 'Precise design tools and creative workspace',
    title: 'Precision Craftsmanship',
    subtitle: 'Details make the difference',
    description: 'From typography and responsive layouts to smooth animations and clean code, we believe extraordinary design lives in the details.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
        <line x1="9.69" y1="8" x2="21.17" y2="8" />
        <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
        <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
        <line x1="14.31" y1="16" x2="2.83" y2="16" />
        <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
      </svg>
    ),
  },
  {
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=max',
    alt: 'Data analytics dashboard showing measurable results',
    title: 'Measurable Impact',
    subtitle: 'Results you can see',
    description: 'Every visual asset, brand campaign, and website is engineered with clear business outcomes, conversion metrics, and ROI in mind.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=max',
    alt: 'Team collaborating around a table',
    title: 'True Partnership',
    subtitle: 'Together we grow',
    description: "We don\u2019t work for you \u2014 we work with you. Collaborative transparency and mutual trust drive our longest-standing relationships.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const carouselItems = values.map(({ src, alt, title, subtitle }) => ({ src, alt, title, subtitle }));

export default function AboutCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeValue = values[activeIndex] || values[0];

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <FlexCarousel
        items={carouselItems}
        preset="liquid"
        intro="rise"
        cardHeight={0.5}
        gap={12}
        squeeze={0.2}
        focusOnClick
        captions
        onChange={(index) => setActiveIndex(index)}
      />

      {/* Floating value description card */}
      <div
        key={activeIndex}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '480px',
          width: '90%',
          background: 'rgba(10, 10, 20, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 24px',
          color: '#fff',
          pointerEvents: 'none',
          zIndex: 10,
          animation: 'floatCardIn 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #e53e3e, #c53030)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {activeValue.icon}
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            {activeValue.title}
          </span>
        </div>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.55,
            opacity: 0.7,
            margin: 0,
          }}
        >
          {activeValue.description}
        </p>
      </div>

      <style>{`
        @keyframes floatCardIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
