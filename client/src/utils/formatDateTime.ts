
export function formatDateTime(
  date: string | null,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = "medium",
  timeStyle: Intl.DateTimeFormatOptions["timeStyle"] = "short",
  timeZone = "Asia/Manila"
){

    if(!date) return ""

    return new Date(date).toLocaleString("en-PH", { dateStyle, timeStyle, timeZone  });
}