export function localize_type (type: 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen') {
  switch (type) {
    case 'opening': return 'Опенинг';
    case 'ending': return 'Эндинг';
    case 'ost': return 'OST';
    case 'compilation': return 'Компиляция';
    case 'splashScreen': return 'Заставка';
  }
}
