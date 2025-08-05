import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate, truncateText, generateId } from './utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should combine class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const condition = false
      expect(cn('class1', condition && 'class2', 'class3')).toBe('class1 class3')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency with AUD default', () => {
      const result = formatCurrency(1000)
      expect(result).toContain('1,000')
      expect(result).toContain('$')
    })

    it('should format currency with custom currency', () => {
      const result = formatCurrency(1000, 'USD')
      expect(result).toContain('1,000')
      expect(result).toContain('USD')
    })
  })

  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date('2024-01-01')
      const result = formatDate(date)
      expect(result).toContain('2024')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated'
      const result = truncateText(text, 10)
      expect(result).toBe('This is a ...')
    })

    it('should not truncate short text', () => {
      const text = 'Short'
      const result = truncateText(text, 10)
      expect(result).toBe('Short')
    })
  })

  describe('generateId', () => {
    it('should generate a string ID', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })
})
