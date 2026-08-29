import React from 'react'
import { colors, spacing, borderRadius } from '@/theme/colors'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  fullWidth?: boolean
  disabled?: boolean
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  fullWidth = true,
  disabled = false,
}) => {
  const selectStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.blackSurface,
    border: `1px solid ${error ? colors.redExpense : colors.border}`,
    borderRadius: borderRadius.md,
    color: colors.textPrimary,
    fontSize: '16px',
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={selectStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.gold
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.redExpense : colors.border
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
