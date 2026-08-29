import React from 'react'
import { colors, spacing, borderRadius } from '@/theme/colors'

interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showPercent?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  color = colors.gold,
  size = 'md',
  style,
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  const sizeStyles: Record<string, number> = {
    sm: 4,
    md: 8,
    lg: 12,
  }

  const height = sizeStyles[size]

  return (
    <div style={style}>
      {(label || showPercent) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: spacing.sm,
            fontSize: '14px',
            color: colors.textSecondary,
          }}
        >
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div
        style={{
          backgroundColor: colors.blackSurface,
          borderRadius: borderRadius.md,
          height: `${height}px`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: color,
            height: '100%',
            width: `${clampedValue}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
