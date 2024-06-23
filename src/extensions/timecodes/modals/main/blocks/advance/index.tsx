import React from 'react';
import ExpandedSVG from '../../../../../../assets/svgs/expanded.svg';
import CollapsedSVG from '../../../../../../assets/svgs/collapsed.svg';
import { players_data } from '../../../..';
import { AdvanceTeamBlock } from './team';


interface Props {
  anime_slug_url: string,
  data: ExtensionStorage,
  onchange: (value: ExtensionStorage) => void,
}

export const AdvanceBlock: React.FC<Props> = ({ anime_slug_url, data, onchange }) => {

  const handleHeaderClick: React.MouseEventHandler<HTMLDivElement> = () => {
    onchange({ ...data, config: { ...data.config, collapsed: !data.config.collapsed } });
  };

  function renderTeamsList () {
    const teams = players_data?.filter((player) => player.player === 'Animelib')?.map((player) => ({
      team: player.team,
      data: data.teams.find((local_team) => local_team.slug_url === player.team.slug_url)
    }));
    const sort = teams?.sort((a, b) => {
      if (a.data?.rules?.length && !b.data?.rules?.length) return -1;
      if (b.data?.rules?.length && !a.data?.rules?.length) return 1;
      return 0;
    })
    return sort?.map(({ team, data }, index) => {
      return <AdvanceTeamBlock
        key={ index }
        anime_slug_url={ anime_slug_url }
        team={ team }
        data={ data }
        onchange={ TeamUpdateEvent.bind(index) }
      />;
    })
  }

  function TeamUpdateEvent (this: number, value: ExtensionTeamConfig) {
    onchange({ ...data, teams: data.teams.map((v, i) => this !== i ? v : value) });
  }

  return (
    <>
      <div className='popup-header advance-header' onClick={ handleHeaderClick }>
        <div className='popup-header__title advance-header__title'>
          Правила для текущего тайтла
          <span className='advance-icon'>
            { data.config.collapsed ? <CollapsedSVG/> : <ExpandedSVG/> }
          </span>
        </div>
      </div>
      <div className='scrollable-block'>
        { !data.config.collapsed && renderTeamsList() }
      </div>
    </>
  );
};
