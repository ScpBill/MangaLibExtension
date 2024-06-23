import React, { MouseEventHandler } from 'react';
import AddSVG from '../../../../../../../assets/svgs/add.svg';


interface Props {}

export const AdvanceNewCardBlock: React.FC<Props> = () => {
  const handleCardClick: MouseEventHandler<HTMLDivElement> = () => {
    return;
  };

  return (
    <div className='rule-card-item' onClick={ handleCardClick }>
      <div className='cover _shadow'>
        <div className='cover__wrap rule-card-cover'>
          <div className='cover__img rule-card-cover _loaded card-new-style'>
            <AddSVG/><span>Добавить правило</span>
          </div>
        </div>
        <div className='btns _size-sm rule-card-buttons'>
          
        </div>
      </div>
      <div className='card-item-caption'>
        <div className='card-item-caption__main'>
        </div>
      </div>
    </div>
  );
};
