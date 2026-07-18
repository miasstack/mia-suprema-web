'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Skill } from '@/types'

interface CommandInputProps {
  onSubmit: (input: string) => void
  disabled: boolean
  skills: Skill[]
}

export default function CommandInput({ onSubmit, disabled, skills }: CommandInputProps) {
  const [value, setValue] = useState('')
  const [showSkillPicker, setShowSkillPicker] = useState(false)
  const [skillFilter, setSkillFilter] = useState('')
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filteredSkills = skills.filter((s) =>
    s.name.toLowerCase().includes(skillFilter.toLowerCase())
  )

  useEffect(() => {
    if (value.startsWith('/') && !value.includes(' ')) {
      setShowSkillPicker(true)
      setSkillFilter(value.slice(1))
      setSelectedSkillIndex(0)
    } else {
      setShowSkillPicker(false)
    }
  }, [value])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [disabled])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSkillPicker) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSkillIndex((i) => Math.min(i + 1, filteredSkills.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSkillIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && filteredSkills.length > 0)) {
        e.preventDefault()
        const skill = filteredSkills[selectedSkillIndex]
        if (skill) {
          setValue(`/${skill.name} `)
          setShowSkillPicker(false)
        }
        return
      }
      if (e.key === 'Escape') {
        setShowSkillPicker(false)
        return
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) {
        onSubmit(value)
        setValue('')
      }
    }
  }

  const adjustHeight = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    }
  }

  return (
    <div className="relative">
      {showSkillPicker && filteredSkills.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-hermes-surface border border-hermes-border rounded-lg shadow-lg overflow-hidden z-10 animate-fade-in">
          <div className="px-3 py-1.5 border-b border-hermes-border">
            <span className="text-[10px] font-mono text-hermes-text-muted uppercase tracking-wider">Skills</span>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredSkills.map((skill, i) => (
              <button
                key={skill.name}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors skill-picker-item ${
                  i === selectedSkillIndex ? 'bg-hermes-elevated' : ''
                }`}
                onClick={() => {
                  setValue(`/${skill.name} `)
                  setShowSkillPicker(false)
                  textareaRef.current?.focus()
                }}
                onMouseEnter={() => setSelectedSkillIndex(i)}
              >
                <span className="text-hermes-gold font-mono text-sm font-semibold">/{skill.name}</span>
                <span className="text-hermes-text-dim text-xs truncate">{skill.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`flex items-end gap-2 bg-hermes-surface border rounded-lg px-3 py-2 transition-colors ${
        disabled ? 'border-hermes-border opacity-60' : 'border-hermes-border-bright focus-within:border-hermes-gold'
      }`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            adjustHeight()
          }}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Processing...' : 'Message Hermes... (/ for skills)'}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-hermes-text placeholder:text-hermes-text-muted resize-none leading-relaxed"
          style={{ minHeight: '24px', maxHeight: '200px' }}
        />
        <button
          onClick={() => {
            if (value.trim() && !disabled) {
              onSubmit(value)
              setValue('')
            }
          }}
          disabled={!value.trim() || disabled}
          className={`p-1.5 rounded transition-colors shrink-0 ${
            value.trim() && !disabled
              ? 'text-hermes-gold hover:bg-hermes-gold-dim'
              : 'text-hermes-text-muted'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mt-1.5 px-1">
        <span className="text-[10px] font-mono text-hermes-text-muted">
          Enter to send · Shift+Enter for newline · / for skills
        </span>
      </div>
    </div>
  )
}
