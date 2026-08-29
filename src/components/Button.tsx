import React from 'react'
import { colors, spacing } from '@/theme/colors'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}) => {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: fullWidth ? 'block' : 'inline-block',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.gold,
      color: colors.blackDeep,
      ...baseStyles,
    },
    secondary: {
      backgroundColor: colors.blackSurface,
      color: colors.gold,
      border: `2px solid ${colors.gold}`,
      ...baseStyles,
    },
    danger: {
      backgroundColor: colors.redExpense,
      color: colors.textPrimary,
      ...baseStyles,
    },
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '14px',
    },
    md: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: '16px',
    },
    lg: {
      padding: `${spacing.lg} ${spacing.xl}`,
      fontSize: '18px',
    },
  }

  const buttonStyle: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={buttonStyle}
      className={className}
    >
      {loading ? '...' : children}
    </button>
  )
}
