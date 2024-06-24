import React, { useState, useEffect } from 'react';
import { players_data, episodes_data } from '../..';
import { TimecodeBlock } from './blocks/timecode';
import { GeneralBlock } from './blocks/general';
import { AdvanceBlock } from './blocks/advance';
import { storage as Storage } from '../../utils/storage';
import { save } from '../../events/save';


export const TimecodeModalBody: React.FC = () => {
  const [ , anime_slug_url, episode_id, player_id ] = document.location.pathname.match(/^\/ru\/anime\/(\d+--[\w\d-]+)\/episodes\/(\d+)\/player\/(\d+)\/?$/)!;
  const [ timecodes, setTimecodes ] = useState(players_data?.find((player) => player.id === +player_id)?.timecode as Timecode[] ?? []);
  const [ storage, setStorage ] = useState(Storage.get());
  const [ options, setOptions ] = useState<Options>({
    for_one_team: true,
    includes_to_episode: {
      status: false,
      id: episode_id,
    },
  });

  useEffect(() => {
    Storage.set(storage);
  }, [storage]);

  return (
    <div className='content-block'>
      <TimecodeBlock data={ timecodes } onchange={ setTimecodes }/>
      <AdvanceBlock anime_slug_url={ anime_slug_url } data={ storage } onchange={ setStorage }/>
      <GeneralBlock data={ options } onchange={ setOptions } onsave={ async () => await save(
        anime_slug_url,
        episode_id,
        player_id,
        players_data as EpisodeResponse['data']['players'],
        episodes_data as AnimeEpisodesResponse['data'],
        timecodes,
        storage,
        options
      ) }/>
    </div>
  );
};
