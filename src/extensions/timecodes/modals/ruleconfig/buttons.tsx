import React from 'react';
import EditSVG from '../../../../assets/svgs/edit.svg';
import TrashSVG from '../../../../assets/svgs/trash.svg';


interface Props {
  type: 'image' | 'gif',
  src: string,
  onremove: () => void,
  oneditmode: (value: { type: 'image' | 'gif', src: string }) => void,
}

export const AdvanceCardButtonsInRule: React.FC<Props> = ({ type, src, onremove, oneditmode }) => {
  return (
    <>
      <button className='btn is-filled is-icon variant-light size-sm' type='button' onClick={ () => oneditmode({ type, src }) }>
        <EditSVG/>
      </button>
      <button className='btn is-filled is-icon variant-danger size-sm' type='button' onClick={ onremove }>
        <TrashSVG/>
      </button>
    </>
  );
}
