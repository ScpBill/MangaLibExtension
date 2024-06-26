import React from 'react';
import { AdvanceCardBlock } from './card/rule';
import { AdvanceNewCardBlock } from './card/new';


interface Props {
  anime_slug_url: string,
  team: EpisodeResponse['data']['players'][0]['team'],
  data: ExtensionTeamConfig | undefined,
  onchange: (value: ExtensionTeamConfig) => void,
  oncreate: (value: ExtensionTeamConfig) => void,
}

export const AdvanceTeamBlock: React.FC<Props> = ({ anime_slug_url, team, data, onchange, oncreate }) => {

  function renderCardsGrid () {
    return (data ? data.rules.map((rule, index) => {
      return <AdvanceCardBlock
        key={ index }
        anime_slug_url={ anime_slug_url }
        data={ rule }
        onchange={ RuleUpdateEvent.bind(index) }
        onremove={ RuleRemoveEvent.bind(index) }
      />;
    }) : []).concat([
      <AdvanceNewCardBlock
        key={ 0 }
        anime_slug_url={ anime_slug_url }
        oncreate={ RuleCreateEvent }
      />
    ]);
  }

  function RuleCreateEvent (value: ExtensionRuleConfig) {
    if (!data) return oncreate({
      slug_url: team.slug_url,
      rules: [value],
    });
    return onchange({ ...data, rules: data.rules.concat([value]) });
  }

  function RuleUpdateEvent (this: number, value: ExtensionRuleConfig) {
    if (!data) return;
    return onchange({ ...data, rules: data.rules.map((v, i) => this !== i ? v : value) });
  }

  function RuleRemoveEvent (this: number) {
    if (!data) return;
    const rules = data.rules;
    rules.splice(this, 1);
    return onchange({ ...data, rules });
  }

  return (
    <>
      <div className='section-body team-name-section'>
        { team.name }
      </div>
      <div className='team-cards-grid'>
        { renderCardsGrid() }
      </div>
    </>
  );
};

