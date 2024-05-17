import React from 'react';


interface Props {
  data: Timecode['type'],
  onchange: (value: Timecode['type']) => void,
}
const TimecodeInlineSelect: React.FC<Props> = ({ data, onchange }) => {
  const SelectChangeEvent: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    onchange(event.target.value as Timecode['type']);
  };
  return <div className='form-input' inputMode='numeric' id='timeskip-type'>
    <select title='timeskip-mode' className='form-input__field' style={({ minWidth: '100px' })} value={ data } onChange={ SelectChangeEvent }>
      <option value='opening'>Опенинг</option>
      <option value='ending'>Эндинг</option>
      <option value='ost'>OST</option>
      <option value='compilation'>Компиляция</option>
      <option value='splashScreen'>Заставка</option>
    </select>
  </div>;
};


export default TimecodeInlineSelect;
