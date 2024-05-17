import React, {  } from 'react';
import TimecodeInline from './timecode_inline';
import FullWidthButton from '../../components/buttons/fullwidth';
import AddSVG from '../../../../assets/svgs/add.svg';


interface Props<T = Timecode[]> {
  data: T,
  onchange: (value: T) => void,
}
const TimecodeBlock: React.FC<Props> = ({ data, onchange }) => {
  
  // Events
  function AddTimecodeEvent () {
    onchange([ ...data, { type: 'opening', from: '', to: '' } ]);
  }
  function TimecodeUpdateEvent (this: number, value: Timecode) {
    onchange(data.map((v, i) => this !== i ? v : value));
  }
  function TimecodeRemoveEvent (this: number) {
    onchange(data.filter((_, i) => this !== i));
  }

  // React component
  return <>
    {
      data.map((timecode, index) => <TimecodeInline key={ index } data={ timecode } onupdate={ TimecodeUpdateEvent.bind(index) } onremove={ TimecodeRemoveEvent.bind(index) }/>)
    }
    <FullWidthButton onclick={ AddTimecodeEvent } text='Добавить тайм-код' icon={ <AddSVG/> }/>
  </>;
};


export default TimecodeBlock;
