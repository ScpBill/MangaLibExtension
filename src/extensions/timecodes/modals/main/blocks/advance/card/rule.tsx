import React, { useState } from 'react';
import { AdvanceCardButtons } from './hover/buttons';
import { AdvanceCardDescription } from './hover/description';
import { localize_type } from '../../../../../utils/timecode';


interface Props {
  anime_slug_url: string,
  data: ExtensionRuleConfig,
  onchange: (value: ExtensionRuleConfig) => void,
  onremove: () => void,
}

export const AdvanceCardBlock: React.FC<Props> = ({ anime_slug_url, data, onchange, onremove }) => {

  const [ isHovered, setIsHovered ] = useState(false);
  const [ onClick, setOnClick ] = useState(true);

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!onClick) return;
    const titles = data.titles ?? [];
    const index = titles.findIndex((curr) => curr === anime_slug_url)
    if (index >= 0) titles.splice(index, 1)
    else titles.push(anime_slug_url)
    onchange({ ...data, titles })
  };

  const getCover = () => {
    const render = (src: string) => <img src={ src } className='cover__img _loaded cover-options' loading='lazy'/>
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

  function RuleUpdateEvent (rule: ExtensionRuleConfig) {
    onchange(rule);
  }

  return (
    <div className='rule-card-item'>
      <div className='cover _shadow' onClick={ handleCardClick } onMouseEnter={ () => setIsHovered(true) } onMouseLeave={ () => setIsHovered(false) }>
        <div className={'cover__wrap rule-card-cover' + (data.titles?.includes(anime_slug_url) ? ' card-is-selected': ' card-is-not-selected') + (isHovered ? ' card-is-hovered' : '')}>
          { getCover() }
        </div>
        <div className='btns _size-sm rule-card-buttons' onMouseEnter={ () => setOnClick(false) } onMouseLeave={ () => setOnClick(true) }>
          { isHovered && <AdvanceCardButtons anime_slug_url={ anime_slug_url } data={ data } onupdate={ RuleUpdateEvent } onremove={ onremove }/> }
        </div>
        <div className='_size-sm rule-card-description'>
          { isHovered && <AdvanceCardDescription data={ data }/> }
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
