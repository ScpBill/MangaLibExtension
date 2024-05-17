import React, { useState } from 'react';
import { players_data } from '..';
import TimecodeBlock from './timecode/timecode';
import GeneralBlock from './timecode/general';


const ModalBody: React.FC = () => {
  const [ , episode_id, player_id ] = document.location.pathname.match(/^\/ru\/anime\/\d+--[\w\d-]+\/episodes\/(\d+)\/player\/(\d+)\/?$/)!;
  const [ timecodes, setTimecodes ] = useState(players_data?.find((player) => player.id === +player_id)?.timecode as Timecode[] ?? []);
  const [ options, setOptions ] = useState({
    for_one_team: true,
    includes_to_episode: {
      status: false,
      id: episode_id,
    },
  });
  return <>
    <TimecodeBlock data={ timecodes } onchange={ setTimecodes }/>
    {/* <PluginBlock data={  } onchange={  }/> */}
    <GeneralBlock data={ options } onchange={ setOptions } onsave={ () => null }/>
  </>;
};


export default ModalBody;
