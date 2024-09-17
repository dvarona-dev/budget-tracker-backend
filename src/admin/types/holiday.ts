import { Holiday } from '@prisma/client'

export type GetHolidaysResponse = {
  message: 'success' | string
  holidays?: Holiday[]
}

export type THoliday = {
  id?: string
  description: string
  date: Date
}

export type UpdateHolidayBody = {
  holidays: (Required<Pick<THoliday, 'id'>> & Omit<THoliday, 'id'>)[]
}

export type UpdateHolidayResponse = {
  message: string
}
