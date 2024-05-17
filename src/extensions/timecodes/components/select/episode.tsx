import React from 'react';
import { episodes_data } from '../..';


interface Props {
  value: string,
  onchange: (value: string) => void,
}
const GeneralSelectEpisode: React.FC<Props> = ({ value, onchange }) => {
  const SelectChangeEvent: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    onchange(event.target.value);
  };
  return <div className='form-input size-xs'>
    <select title='episode-select' className='form-input__field' value={ value } onChange={ SelectChangeEvent }>
      { episodes_data?.map(({ id, number }, index) => <option key={ index } value={ id }>{ number }</option>) }
    </select>
  </div>;
};


export default GeneralSelectEpisode;
