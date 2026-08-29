import React, { ReactNode } from 'react'
import { colors, spacing } from '@/theme/colors'
import { Card } from './Card'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '400px',
}) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: spacing.md,
      }}
      onClick={onClose}
    >
      <Card
        style={{
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: spacing.lg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2
            style={{
              marginBottom: spacing.md,
              marginTop: 0,
              color: colors.gold,
            }}
          >
            {title}
          </h2>
        )}
        {children}
      </Card>
    </div>
  )
}
