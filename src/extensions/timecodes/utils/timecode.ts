export function localize_type (type: 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen') {
  switch (type) {
    case 'opening': return 'Опенинг';
    case 'ending': return 'Эндинг';
    case 'ost': return 'OST';
    case 'compilation': return 'Компиляция';
    case 'splashScreen': return 'Заставка';
  }
}


export function addSecondsToTime (time: string, seconds: number, atSeconds: number | null = null, minSeconds: number | null = null): string {
  const secTime = timeToSeconds(time);
  if (atSeconds !== null) {
    if (time.startsWith('-') && secTime > atSeconds)
      return time;
    if (!time.startsWith('-') && secTime < atSeconds)
      return time;
  }
  let sum = secTime + seconds;
  if (minSeconds !== null) {
    if (time.startsWith('-') && sum > minSeconds)
      sum = minSeconds;
    if (!time.startsWith('-') && sum < minSeconds)
      sum = minSeconds;
  }
  return secondsToTime(sum, time.startsWith('-'));
}


export function timeToSeconds (time: string): number {
  const minus = time.startsWith('-') ? -1 : 1;
  if (minus === -1) time = time.slice(1);
  const vars = time.split(':');
  if (vars.length > 2) {
    return ((+vars[0]) * 3600 + (+vars[1]) * 60 + (+vars[2])) * minus;
  } else {
    return ((+vars[0]) * 60 + (+vars[1])) * minus;
  }
}


export function secondsToTime (seconds: number, signIsMinus: boolean = false): string {
  if (!seconds)
    return (signIsMinus ? '-' : '') + '00:00';
  const minus = seconds < 0 ? '-' : '';
  if (minus === '-') seconds *= -1;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - (h * 3600)) / 60);
  const s = seconds - (h * 3600) - (m * 60);
  if (h) {
    return minus + `${h}`.padStart(2, '0') + ':' + `${m}`.padStart(2, '0') + ':' + `${s}`.padStart(2, '0');
  } else {
    return minus + `${m}`.padStart(2, '0') + ':' + `${s}`.padStart(2, '0');
  }
}


export function copyOfArray (array: Timecode[]): Timecode[] {
  return array.map(item => ({ ...item }));
}
