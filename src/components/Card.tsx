import React from 'react'
import { colors, spacing, shadows, borderRadius } from '@/theme/colors'

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  style,
  hover = false,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.blackCard,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    boxShadow: shadows.sm,
    ...style,
  }

  if (hover) {
    return (
      <div
        style={cardStyle}
        className={className}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = shadows.md
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = shadows.sm
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div style={cardStyle} className={className}>
      {children}
    </div>
  )
}
