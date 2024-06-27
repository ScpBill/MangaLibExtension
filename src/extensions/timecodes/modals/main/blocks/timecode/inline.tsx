import React from 'react';
import { TimecodeInlineSelect } from '../../../../components/select/typeskip';
import { TimecodeInlineInput } from '../../../../components/input/timecode';
import TrashSVG from '../../../../../../assets/svgs/trash.svg';
import { addSecondsToTime } from '../../../../utils/timecode';


interface Props {
  data: Timecode,
  onupdate: (value: Timecode) => void,
  onremove: () => void,
}

export const TimecodeInline: React.FC<Props> = ({ data, onupdate, onremove }) => {
  return (
    <div className='inputs _inline' style={({ marginBottom: '12px' })}>
      <TimecodeInlineSelect data={ data.type } onchange={ (type) => onupdate({ ...data, type }) }/>
      <div className='inputs _inline _group'>
        <TimecodeInlineInput mode='from' data={ data.from } onchange={ (from) => onupdate({ ...data, from, to: addSecondsToTime(from, 90, null, 0) }) }/>
        <TimecodeInlineInput mode='to' data={ data.to } onchange={ (to) => onupdate({ ...data, to }) }/>
      </div>
      <button title='remove-timeskip' className='btn is-icon variant-danger' type='button' onClick={ onremove }>
        <TrashSVG/>
      </button>
    </div>
  );
};
