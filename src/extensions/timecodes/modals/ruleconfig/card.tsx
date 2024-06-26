import React, { MouseEventHandler, useState } from 'react';
import { AdvanceCardButtonsInRule } from './buttons';
import AddSVG from '../../../../assets/svgs/add.svg';


interface Props {
  type: 'image' | 'gif',
  data: { url: string } | null,
  onremove: () => void,
  oneditmode: (value: { type: 'image' | 'gif', src: string } | null) => void,
}

export const AdvanceCardBlockInRule: React.FC<Props> = ({ type, data, onremove, oneditmode }) => {
  const [ isHover, setIsHover ] = useState(false);
  
  return (
    <div className='rule-card-item' style={({ padding: '0' })} onMouseEnter={ () => setIsHover(true) } onMouseLeave={ () => setIsHover(false) }>
      <div className='cover _shadow'>
        <div className='cover__wrap rule-card-cover'>
          { data
            ? <img src={ data.url } className='cover__img _loaded cover-options' loading='lazy'/>
            : <div className='cover__img rule-card-cover _loaded card-new-style' onClick={ () => oneditmode({ type, src: '' }) }>
                <AddSVG/>
                <span>{ type === 'image' ? 'Загрузить картинку' : 'Загрузить гифку' }</span>
              </div> }
        </div>
        { data && <div className='btns _size-sm rule-card-buttons'>
          { isHover && <AdvanceCardButtonsInRule type={ type } src={ data.url } onremove={ onremove } oneditmode={ oneditmode }/> }
        </div>}
      </div>
    </div>
  );
}
