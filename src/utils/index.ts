export async function waitForDOMLoading () {
  if (document.readyState !== 'loading') return;
  return new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve));
}

export function* enumerate<T> (iterable: Iterable<T>): Generator<[number, T]> {
  let i = 0;
  for (const item of iterable) {
    yield [ i++, item ];
  }
}

export function formatDateString (dateString: string | undefined, type: 'small' | 'long' | 'compact') {
  try {
    switch (type) {
      case 'small':
        return new Intl.DateTimeFormat('ru', {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(`${dateString} GMT`));
      
      case 'long':
        return 'админы пидорасы дату забыли добавить';
      case 'compact':
        return ((date) => `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`)(new Date(`${dateString} GMT`));
    }
  } catch {
    return 'хуй знает когда ^^';
  }
}
