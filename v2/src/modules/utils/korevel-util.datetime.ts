export default class KorevelUtilDateTime {
  getTimestamp({
    seconds = false,
    milliseconds = false,
  }: {
    seconds: boolean;
    milliseconds: boolean;
  }): string {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: seconds ? "2-digit" : undefined,
    });

    if (milliseconds) {
      const ms = now.getMilliseconds().toString().padStart(3, "0");
      // Splits time to insert ms before the AM/PM marker
      const [timePart, ampm] = time.split(" ");
      return `${timePart}.${ms} ${ampm}`;
    }

    return time;
  }
}
