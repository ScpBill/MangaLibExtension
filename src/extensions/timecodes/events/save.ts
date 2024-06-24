import { addSecondsToTime, timeToSeconds, secondsToTime, copyOfArray } from '../utils/timecode';
import { show_toast } from './show_toast';


export async function save (
  anime_slug_url: string,
  episode_id: string,
  player_id: string,
  players_data: EpisodeResponse['data']['players'],
  episodes_data: AnimeEpisodesResponse['data'],
  timecodes: Timecode[],
  storage: ExtensionStorage,
  options: Options,
): Promise<void> {
  const token = JSON.parse(window.localStorage.getItem('auth')!).token.access_token;
  const filteredPlayersData = players_data.filter((player) => player.player === 'Animelib') as EpisodeResponse['data']['players'];

  let currentPlayer: EpisodeResponse['data']['players'][0];
  let unifyTimecodes: Timecode[];

  if (options.for_one_team) {
    currentPlayer = getPlayerById(filteredPlayersData, player_id)!;
  } else {
    currentPlayer = getPlayerById(filteredPlayersData, player_id)!;
    unifyTimecodes = unify(timecodes, await getDuration(currentPlayer), anime_slug_url, currentPlayer.team.slug_url, storage);
  }

  // Apply timecodes for current episode
  if (options.for_one_team) {
    const duration = await getDuration(currentPlayer!);
    await sendRequest(token, player_id, {
      timecode: normal(timecodes, duration),
      applyTimecodesCurrentTeam: true,
    })
  } else {
    for (const player of filteredPlayersData) {
      const duration = await getDuration(player);
      await sendRequest(token, `${player.id}`, {
        timecode: modify(unifyTimecodes!, duration, anime_slug_url, player.team.slug_url, storage),
        applyTimecodesCurrentTeam: true,
      })
    }
  }

  // Apply timecodes for another episodes without current episode
  if (options.includes_to_episode.status && episode_id !== options.includes_to_episode.id) {
    episodes_data.splice(0, 1 + episodes_data.findIndex((episode) => episode.id === +episode_id));

    for (const episode of episodes_data) {
      const newPlayersData = (await (await fetch(`https://api.lib.social/api/episodes/${episode.id}`)).json() as EpisodeResponse).data.players;
      const newFilteredPlayersData = newPlayersData.filter((player) => player.player === 'Animelib') as EpisodeResponse['data']['players']

      if (options.for_one_team) {
        const player = getPlayerByTeam(newFilteredPlayersData, currentPlayer!.team.slug_url);
        if (player) {
          const duration = await getDuration(player);
          await sendRequest(token, `${player.id}`, {
            timecode: normal(timecodes, duration),
            applyTimecodesCurrentTeam: true,
          })
        }
      } else {
        for (const player of newFilteredPlayersData) {
          const duration = await getDuration(player);
          await sendRequest(token, `${player.id}`, {
            timecode: normal(modify(unifyTimecodes!, duration, anime_slug_url, player.team.slug_url, storage), duration),
            applyTimecodesCurrentTeam: true,
          })
        }
      }

      if (`${episode.id}` === options.includes_to_episode.id) break;
    }
  }
}


function getPlayerById (
  players_data: EpisodeResponse['data']['players'],
  player_id: string | number,
) {
  return players_data.find((player) => `${player.id}` === `${player_id}`);
}


function getPlayerByTeam (
  players_data: EpisodeResponse['data']['players'],
  team_slug_url: string,
) {
  return players_data.find((player) => player.team.slug_url === team_slug_url);
}


interface body {
  timecode: Timecode[]
  applyTimcodesUntilEpisode?: number
  applyTimecodesCurrentTeam?: boolean
}
async function sendRequest (token: string, player_id: string, body: body) {
  const response = await fetch(`https://api.lib.social/api/players/${player_id}/timecodes`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'mangalib-extension/api',
      'Access-Control-Allow-Origin': 'https://anilib.me',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    }
  });
  const toast = await response.json() as ToastResponse;
  show_toast(toast);
}


async function getDuration (
  player: EpisodeResponse['data']['players'][0],
): Promise<number> {
  const video_href = player.video?.quality.at(-1)?.href;
  if (!video_href) return 0;

  const video = document.createElement('video');
  video.setAttribute('src', 'https://video1.anilib.me/.%D0%B0s/' + video_href);
  await new Promise<void>(resolve => (video.onloadeddata = () => resolve()));

  return video.duration;
}


function normal (
  timecodes: Timecode[],
  duration: number,
): Timecode[] {
  const result = copyOfArray(timecodes);
  for (const timecode of result) {
    if (timecode.from.startsWith('-'))
      timecode.from = addSecondsToTime(timecode.from, duration);
    if (timecode.to.startsWith('-'))
      timecode.to = addSecondsToTime(timecode.to, duration);
  }
  return result;
}


function getTimecodes (
  timecodes: Timecode[],
  insertion: ExtensionRuleConfig['insertions'][0],
  duration: number,
): {
  from?: string,
  to?: string,
  timeAtStart: number,
  timeAtEnd: number,
} | undefined {
  let { from, to } = timecodes.find((timecode) => timecode.type === insertion.regarding) ?? {};
  let timeAtStart: number, timeAtEnd: number;

  switch (insertion.regarding) {
    case 'start':
      to = '00:00';
      timeAtStart = 0;
      timeAtEnd = -duration;
      break;
    case 'end':
      from = '-00:00';
      timeAtEnd = -0;
      timeAtStart = duration;
      break;
    default:
      if (from === undefined || to === undefined) return;
      const timeCode = insertion.position === 'after' ? to : from;
      if (timeCode.startsWith('-')) {
        timeAtEnd = timeToSeconds(timeCode);
        timeAtStart = timeAtEnd + duration;
      } else {
        timeAtStart = timeToSeconds(timeCode);
        timeAtEnd = timeAtStart - duration;
      }
  }
  return { from, to, timeAtStart, timeAtEnd };
}


function unify (
  timecodes: Timecode[],
  duration: number,
  anime_slug_url: string,
  team_slug_url: string,
  storage: ExtensionStorage,
): Timecode[] {
  const result = copyOfArray(timecodes);
  const team_rules = storage.teams.find((team) => team.slug_url === team_slug_url)?.rules;
  if (!team_rules) return result;
  
  for (const rule of team_rules) {
    if (!rule.titles?.includes(anime_slug_url)) continue;

    for (const ins of rule.insertions) {
      const data = getTimecodes(result, ins, duration);
      if (!data) continue;
      const { timeAtStart, timeAtEnd } = data;

      for (let i = 0; i < result.length; i++) {
        if (result[i].from.startsWith('-'))
          result[i].from = addSecondsToTime(result[i].from, ins.shift, timeAtEnd, timeAtEnd);
        else
          result[i].from = addSecondsToTime(result[i].from, -ins.shift, timeAtStart, timeAtStart);
        if (result[i].to.startsWith('-'))
          result[i].to = addSecondsToTime(result[i].to, ins.shift, timeAtEnd, timeAtEnd);
        else
          result[i].to = addSecondsToTime(result[i].to, -ins.shift, timeAtStart, timeAtStart);
        if (result[i].from === result[i].to)
          result.splice(i, 1);
      }
    }
  }
  return result;
}


function modify (
  timecodes: Timecode[],
  duration: number,
  anime_slug_url: string,
  team_slug_url: string,
  storage: ExtensionStorage,
): Timecode[] {
  const result = copyOfArray(timecodes);
  const team_rules = storage.teams.find((team) => team.slug_url === team_slug_url)?.rules;
  if (!team_rules) return result;

  for (const rule of team_rules) {
    if (!rule.titles?.includes(anime_slug_url)) continue;

    for (const ins of rule.insertions) {
      const data = getTimecodes(result, ins, duration);
      if (!data) continue;
      const { from, to, timeAtStart, timeAtEnd } = data;

      for (let i = 0; i < result.length; i++) {
        if (result[i].from.startsWith('-'))
          result[i].from = addSecondsToTime(result[i].from, -ins.shift, timeAtEnd);
        else
          result[i].from = addSecondsToTime(result[i].from, ins.shift, timeAtStart);
        if (result[i].to.startsWith('-'))
          result[i].to = addSecondsToTime(result[i].to, -ins.shift, timeAtEnd);
        else
          result[i].to = addSecondsToTime(result[i].to, ins.shift, timeAtStart);
      }
      if (ins.duration) {
        switch (ins.position) {
          case 'after':
            if (to) result.push({
              type: ins.type,
              from: to,
              to: addSecondsToTime(to, ins.duration)
            })
            break;
          case 'before':
            if (from) result.push({
              type: ins.type,
              from: addSecondsToTime(from, -ins.duration),
              to: from
            })
            break;
        }
      }
    }
  }
  return result;
}
