import type { ColumnType } from "kysely"

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Timer = {
  id: string
  pomodoroCount: Generated<number>
  shortBreakCount: Generated<number>
  longBreakCount: Generated<number>
  pomodoroTime: Generated<number>
  shortBreakTime: Generated<number>
  longBreakTime: Generated<number>
  longBreakInterval: Generated<number>
  currentLongBreakIntervalCount: Generated<number>
  autoStartPomodoros: Generated<boolean>
  autoStartBreaks: Generated<boolean>
  alarmVolume: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  userId: string
}
export type User = {
  id: string
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}
export type DB = {
  Timer: Timer
  User: User
}
