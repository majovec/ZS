import React from 'react'
import { colors, spacing, borderRadius } from '@/theme/colors'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style,
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.gold,
      color: colors.blackDeep,
    },
    success: {
      backgroundColor: colors.greenSuccess,
      color: colors.textPrimary,
    },
    danger: {
      backgroundColor: colors.redExpense,
      color: colors.textPrimary,
    },
    warning: {
      backgroundColor: colors.orangeWarning,
      color: colors.blackDeep,
    },
    info: {
      backgroundColor: colors.blueInfo,
      color: colors.textPrimary,
    },
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: '12px',
      fontWeight: '600',
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '14px',
      fontWeight: '600',
    },
  }

  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: borderRadius.full,
    whiteSpace: 'nowrap',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  }

  return (
    <span style={badgeStyle} className={className}>
      {children}
    </span>
  )
}
