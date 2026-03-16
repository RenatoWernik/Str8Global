'use client';

import Balancer from 'react-wrap-balancer';

// Typography: react-wrap-balancer prevents orphan lines in headlines
// Wraps text to ensure balanced line lengths without manual <br> tags
// Especially useful for responsive headlines that reflow at different breakpoints

interface BalancedHeadlineProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'p';
}

export function BalancedHeadline({
  children,
  className = '',
  as = 'h2',
}: BalancedHeadlineProps) {
  const Tag = as;

  return (
    <Tag className={className}>
      <Balancer>{children}</Balancer>
    </Tag>
  );
}
