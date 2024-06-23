import React from 'react';
import { localize_type } from '../../../../../utils/timecode';


interface Props {
  anime_slug_url: string,
  data: ExtensionRuleConfig,
  onchange: (value: ExtensionRuleConfig) => void,
}

export const AdvanceCardBlock: React.FC<Props> = ({ anime_slug_url, data, onchange }) => {

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = () => {
    const titles = data.titles ?? [];
    const index = titles.findIndex((curr) => curr === anime_slug_url)
    if (index >= 0) titles.splice(index, 1)
    else titles.push(anime_slug_url)
    onchange({ ...data, titles })
  };

  const getCover = () => {
    const render = (src: string) => <img src={ src } className='cover__img _loaded' loading='lazy'/>
    if (data.display.gif) return render(data.display.gif.url);
    else if (data.display.img) return render(data.display.img.url);
    else return <div style={({ border: 'solid 1px var(--border-base);' })}/>
  }

  const getName = () => {
    if (data.display.name)
      return data.display.name;
    return (
      data.overrides.length ? ['Переопределения'] : []
    ).concat(
      data.insertions.map((ins) => localize_type(ins.type))
    ).join(', ')
  }

  return (
    <div className='rule-card-item'>
      <div className='cover _shadow' onClick={ handleCardClick }>
        <div className={'cover__wrap rule-card-cover' + (data.titles?.includes(anime_slug_url) ? ' card-is-selected': ' card-is-not-selected')}>
          { getCover() }
        </div>
        <div className='btns _size-sm rule-card-buttons'>

        </div>
      </div>
      <div className='card-item-caption'>
        <div className='card-item-caption__main'>
          { getName() }
        </div>
      </div>
    </div>
  );
};
