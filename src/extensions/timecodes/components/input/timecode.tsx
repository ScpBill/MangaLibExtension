import React from 'react';


interface Props {
  mode: 'from' | 'to',
  data: string,
  onchange: (value: string) => void,
}

export const TimecodeInlineInput: React.FC<Props> = ({ mode, data, onchange }) => {

  const InputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    let inputValue = event.target.value.replace(/[^0-9-]/g, '');
    if (inputValue.startsWith('-') ? inputValue.slice(1).includes('-') : inputValue.includes('-')) return;

    const getFormattedValue = () => {
      if (inputValue.length === 1) {
        return inputValue;
      } else if (inputValue.length === 2) {
        return inputValue.replace(/(\d)(\d)/, '$1:$2');
      } else if (inputValue.length === 3) {
        if (inputValue[0] === '0') {
          return inputValue.replace(/(\d)(\d{2})/, '$1:$2');
        } else {
          return inputValue.padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');
        }
      } else if (inputValue.length === 4) {
        return inputValue.padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');
      } else if (inputValue.length === 5) {
        if (inputValue[0] === '0') {
          return inputValue.slice(1, 5).replace(/(\d{2})(\d{2})/, '$1:$2');
        } else {
          return inputValue.padStart(6, '0').replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
        }
      } else {
        return inputValue.slice(0, 6).replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
      }
    };

    if (inputValue.startsWith('-')) {
      inputValue = inputValue.slice(1);
      data = `-${getFormattedValue()}`;
    } else {
      data = getFormattedValue();
    }

    onchange(data);
  };

  return (
    <div className='form-input'>
      <input className='form-input__field' type='text' inputMode='decimal' placeholder={ mode === 'from' ? 'От' : 'До' } value={ data } onChange={ InputChangeHandler }/>
    </div>
  );
};
