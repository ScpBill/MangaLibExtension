import React from 'react';
import { TimecodeInlineSelect } from '../../components/select/typeskip';
import TrashSVG from '../../../../assets/svgs/trash.svg';
import QuestionSVG from '../../../../assets/svgs/question.svg';


interface Props {
  data: ExtensionRuleConfig['insertions'][0],
  onchange: (value: ExtensionRuleConfig['insertions'][0]) => void,
  onremove: () => void,
};

export const AdvanceTimecodeInRule: React.FC<Props> = ({ data, onchange, onremove }) => {
  return (
    <div className='inputs _inline'>
      <TimecodeInlineSelect data={ data.type } onchange={ (type) => onchange({ ...data, type }) }/>
      <div className='inputs _inline _group'>
        <div className='form-input'>
          <input
            className='form-input__field'
            type='text'
            inputMode='numeric'
            placeholder='Длительность'
            value={ data.duration }
            onChange={ (event) => onchange({ ...data, duration: +event.target.value, shift: +event.target.value }) }
          />
        </div>
        <div className='form-input'>
          <input
            className='form-input__field'
            type='text'
            inputMode='numeric'
            placeholder='Смещение'
            value={ data.shift }
            onChange={ (event) => onchange({ ...data, shift: +event.target.value }) }
          />
        </div>
      </div>
      <button className='btn is-icon variant-danger' type='button' onClick={ onremove }>
        <TrashSVG/>
      </button>
      <button className='btn is-icon is-rounded variant-info' type='button' onClick={ () => {} }>
        <QuestionSVG/>
      </button>
    </div>
  );
}
