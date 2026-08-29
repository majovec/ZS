import React from 'react'
import { colors, spacing, borderRadius } from '@/theme/colors'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  fullWidth = true,
  disabled = false,
  className = '',
}) => {
  const inputStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.blackSurface,
    border: `1px solid ${error ? colors.redExpense : colors.border}`,
    borderRadius: borderRadius.md,
    color: colors.textPrimary,
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        marginBottom: spacing.md,
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: spacing.sm,
            color: colors.textSecondary,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={inputStyle}
        className={className}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.gold
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.redExpense : colors.border
        }}
      />
      {error && (
        <span
          style={{
            display: 'block',
            marginTop: spacing.sm,
            color: colors.redExpense,
            fontSize: '14px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}
