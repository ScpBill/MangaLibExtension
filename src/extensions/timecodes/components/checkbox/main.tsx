import React from 'react';
import CheckboxEnabledSVG from '../../../../assets/svgs/checkbox/enabled.svg';
import CheckboxDisabledSVG from '../../../../assets/svgs/checkbox/disabled.svg';


interface Props {
  checked: boolean,
  disabled: boolean,
  text: string,
  onchange: (state: boolean) => void,
}
const GeneralCheckBox: React.FC<Props> = ({ checked, disabled, text, onchange }) => {
  const ChangeEventHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    return onchange(event.target.checked);
  };
  return <label className='control disable-truncate'>
    <input className='control__input' type='checkbox' checked={ checked } disabled={ disabled } onChange={ ChangeEventHandler }/>
    <span className='control__indicator' data-type='checkbox'>
      <CheckboxEnabledSVG/>
      <CheckboxDisabledSVG/>
    </span>
    <span className='control__text'>
      <span>{ text }</span>
    </span>
  </label>;
};


export default GeneralCheckBox;
