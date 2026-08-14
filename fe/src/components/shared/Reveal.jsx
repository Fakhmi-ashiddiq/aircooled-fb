import React from 'react';
import useReveal from '../../hooks/useReveal';

export default function Reveal({ children, delay = 0, as = 'div', style = {} }) {
  const [ref, visible] = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...style
      }}
    >
      {children}
    </Tag>
  );
}