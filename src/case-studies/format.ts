// Dates as the case studies print them, in UK English and UTC so a build on any
// machine prints the same day.
const utc = (iso: string) => new Date(iso.slice(0, 10) + 'T00:00:00Z')

/** "6 October 2026" */
export const fmtLong = (iso: string) => utc(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "6 Oct" */
export const fmtShort = (iso: string) => utc(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
