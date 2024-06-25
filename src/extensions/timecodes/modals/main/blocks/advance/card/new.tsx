import React, { MouseEventHandler } from 'react';
import AddSVG from '../../../../../../../assets/svgs/add.svg';
import { show_modal } from '../../../../../events/ruleconfig';


interface Props {
  anime_slug_url: string,
  oncreate: (value: ExtensionRuleConfig) => void,
}

export const AdvanceNewCardBlock: React.FC<Props> = ({ anime_slug_url, oncreate }) => {
  
  const handleCardClick: MouseEventHandler<HTMLDivElement> = () => {
    show_modal(anime_slug_url, oncreate, () => {});
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
