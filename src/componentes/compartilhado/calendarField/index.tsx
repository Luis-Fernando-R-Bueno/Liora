import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatDate, formatMonthLabel } from '../../../utils/dateUtils'
import './styles.css'

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function padDatePart(value) {
  return String(value).padStart(2, '0')
}

function parseDateValue(value) {
  if (!value) {
    return null
  }

  const [year, month, day] = String(value).split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

function toDateValue(date) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-')
}

function getMonthTitle(date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function getShortMonthLabel(monthKey) {
  if (!monthKey) {
    return 'Todos'
  }

  const [year, month] = monthKey.split('-')
  return `${MONTHS[Number(month) - 1].slice(0, 3)}/${year}`
}

function buildCalendarDays(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const firstCell = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      firstCell.getFullYear(),
      firstCell.getMonth(),
      firstCell.getDate() + index,
    )

    return {
      date,
      dateValue: toDateValue(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    }
  })
}

function isSameDate(dateValue, date) {
  return dateValue === toDateValue(date)
}

function CalendarField({ buttonRef, label, onChange, value }) {
  const fieldRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => parseDateValue(value) ?? new Date())
  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleClickOutside(event) {
      if (!fieldRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function openCalendar() {
    setViewDate(parseDateValue(value) ?? new Date())
    setIsOpen((currentState) => !currentState)
  }

  function changeMonth(offset) {
    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate)
      nextDate.setMonth(currentDate.getMonth() + offset)
      return nextDate
    })
  }

  function selectDate(date) {
    onChange(toDateValue(date))
    setIsOpen(false)
  }

  return (
    <div className="calendar-field" ref={fieldRef}>
      <span className="calendar-field__label">{label}</span>
      <button
        ref={buttonRef}
        className="calendar-field__trigger"
        type="button"
        onClick={openCalendar}
      >
        <span>{value ? formatDate(value) : 'Selecionar data'}</span>
        <CalendarDays size={17} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="calendar-field__popover">
          <div className="calendar-field__header">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <strong>{getMonthTitle(viewDate)}</strong>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="calendar-field__weekdays" aria-hidden="true">
            {WEEK_DAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-field__days">
            {calendarDays.map((day) => (
              <button
                key={day.dateValue}
                className={[
                  'calendar-field__day',
                  day.isCurrentMonth ? '' : 'is-muted',
                  value === day.dateValue ? 'is-selected' : '',
                  isSameDate(toDateValue(new Date()), day.date) ? 'is-today' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                type="button"
                onClick={() => selectDate(day.date)}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function MonthField({ label, onChange, value }) {
  const fieldRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => {
    const currentYear = new Date().getFullYear()
    return value ? Number(value.slice(0, 4)) : currentYear
  })

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleClickOutside(event) {
      if (!fieldRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function openMonthPicker() {
    if (value) {
      setViewYear(Number(value.slice(0, 4)))
    }

    setIsOpen((currentState) => !currentState)
  }

  function selectMonth(monthIndex) {
    onChange(`${viewYear}-${padDatePart(monthIndex + 1)}`)
    setIsOpen(false)
  }

  return (
    <div className="calendar-field month-field" ref={fieldRef}>
      {label ? <span className="calendar-field__label">{label}</span> : null}
      <button
        className="calendar-field__trigger calendar-field__trigger--compact"
        type="button"
        onClick={openMonthPicker}
        title={value ? formatMonthLabel(value) : 'Todos os meses'}
      >
        <span>{getShortMonthLabel(value)}</span>
        <CalendarDays size={17} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="calendar-field__popover calendar-field__popover--month">
          <div className="calendar-field__header">
            <button type="button" onClick={() => setViewYear((year) => year - 1)} aria-label="Ano anterior">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <strong>{viewYear}</strong>
            <button type="button" onClick={() => setViewYear((year) => year + 1)} aria-label="Próximo ano">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="calendar-field__months">
            {MONTHS.map((month, index) => {
              const monthValue = `${viewYear}-${padDatePart(index + 1)}`

              return (
                <button
                  key={month}
                  className={value === monthValue ? 'is-selected' : ''}
                  type="button"
                  onClick={() => selectMonth(index)}
                >
                  {month.slice(0, 3)}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CalendarField
