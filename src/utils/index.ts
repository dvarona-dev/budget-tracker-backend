import { prisma } from '..'

export const getWorkDays = async (
  startDate: Date,
  endDate: Date,
  userId: string
): Promise<number> => {
  const workDays: Date[] = []
  const currentDate = new Date(startDate)

  const holidayDates = await prisma.holiday.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  while (currentDate <= endDate) {
    if (
      currentDate.getDay() !== 0 &&
      currentDate.getDay() !== 6 &&
      !holidayDates.some(
        (holiday) => holiday.date.toDateString() === currentDate.toDateString()
      )
    ) {
      workDays.push(new Date(currentDate))
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return workDays.length
}
