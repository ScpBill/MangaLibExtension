import React, { useState } from 'react';
import GeneralInfoLabel from '../../components/label/alert';
import GeneralCheckBox from '../../components/checkbox/main';
import GeneralSelectEpisode from '../../components/select/episode';
import FullWidthButton from '../../components/buttons/fullwidth';
import SaveSVG from '../../../../assets/svgs/save.svg';


interface Props<T = {
  for_one_team: boolean,
  includes_to_episode: {
    status: boolean,
    id: string
  },
}> {
  data: T,
  onchange: (value: T) => void,
  onsave: () => void,
}
const GeneralBlock: React.FC<Props> = ({ data, onchange, onsave }) => {
  const [ disabledState, setDisabledState ] = useState(!data.includes_to_episode.status);
  return <div style={({ marginTop: 'auto' })}>
    <GeneralInfoLabel text='При включении опций ниже также будет учтён текущий эпизод'/>
    <div className='form-group _offset'>
      <div style={({ display: 'flex', alignItems: 'flex-start', gap: '6px' })}>
        <GeneralCheckBox
          checked={ data.includes_to_episode.status }
          disabled={ false }
          onchange={ (status) => { onchange({ ...data, includes_to_episode: { ...data.includes_to_episode, status } }); setDisabledState(!status); } }
          text='Применить таймкоды включительно до эпизода'
        />
        <GeneralSelectEpisode
          value={ `${data.includes_to_episode.id}` }
          onchange={ (id) => onchange({ ...data, includes_to_episode: { ...data.includes_to_episode, id } }) }
        />
      </div>
    </div>
    <div className='form-group _offset'>
      <GeneralCheckBox
        checked={ data.for_one_team }
        disabled={ disabledState }
        onchange={ (for_one_team) => onchange({ ...data, for_one_team }) }
        text='Применить таймкоды только к текущей команде в плеере'
      />
    </div>
    <FullWidthButton onclick={ onsave } text='Сохранить' icon={ <SaveSVG/> } variant='success' light={ true }/>
  </div>;
};


export default GeneralBlock;
