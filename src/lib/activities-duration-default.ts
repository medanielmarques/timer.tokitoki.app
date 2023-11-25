const activitiesDurationDev = {
  pomodoro: 1000 * 4,
  short_break: 1000 * 2,
  long_break: 1000 * 3,
}

const activitiesDurationProd = {
  pomodoro: 1000 * 60 * 25,
  short_break: 1000 * 60 * 5,
  long_break: 1000 * 60 * 15,
}

export const activitiesDurationDefault =
  process.env.NODE_ENV === "production"
    ? activitiesDurationProd
    : activitiesDurationDev
