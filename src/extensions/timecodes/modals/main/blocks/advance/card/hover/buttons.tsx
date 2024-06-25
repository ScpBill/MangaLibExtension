import React, { MouseEventHandler } from 'react';
import EditSVG from '../../../../../../../../assets/svgs/edit.svg';
import TrashSVG from '../../../../../../../../assets/svgs/trash.svg';
import MultilineSVG from '../../../../../../../../assets/svgs/multiline.svg';
import { show_modal } from '../../../../../../events/ruleconfig';


interface Props {
  anime_slug_url: string,
  data: ExtensionRuleConfig,
  onupdate: (value: ExtensionRuleConfig) => void,
  onremove: () => void,
}

export const AdvanceCardButtons: React.FC<Props> = ({ anime_slug_url, data, onupdate, onremove }) => {

  const handleCardEdit: MouseEventHandler<HTMLButtonElement> = () => {
    show_modal(anime_slug_url, onupdate, onremove, data);
  };

  return (
    <>
      <button className='btn is-filled is-icon variant-light size-sm' type='button' onClick={ handleCardEdit }>
        <EditSVG/>
      </button>
      <span>
        <div className='btn is-icon variant-light size-sm'>
          <MultilineSVG/>
        </div>
      </span>
    </>
  );
}
