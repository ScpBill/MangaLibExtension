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
    unifyTimecodes = unify(player_id, filteredPlayersData, storage, timecodes);
  }

  // Apply timecodes for current episode
  if (options.for_one_team) {
    const duration = await get_duration(currentPlayer!);
    await send_request(token, player_id, {
      timecode: normal(timecodes, duration),
      applyTimecodesCurrentTeam: true,
    })
  } else {
    for (const player of filteredPlayersData) {
      const duration = await get_duration(player);
      await send_request(token, `${player.id}`, {
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
          const duration = await get_duration(player);
          await send_request(token, `${player.id}`, {
            timecode: normal(timecodes, duration),
            applyTimecodesCurrentTeam: true,
          })
        }
      } else {
        for (const player of newFilteredPlayersData) {
          const duration = await get_duration(player);
          await send_request(token, `${player.id}`, {
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
async function send_request (token: string, player_id: string, body: body) {
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


async function get_duration (
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


function unify (
  player_id: string,
  players_data: EpisodeResponse['data']['players'],
  storage: ExtensionStorage,
  timecodes: Timecode[],
): Timecode[] {
  const result = copyOfArray(timecodes);
  const team_slug_url = players_data.find((player) => player.id === +player_id)?.team?.slug_url;
  const team_rules = storage.teams.find((team) => team.slug_url === team_slug_url)?.rules;
  if (!team_rules) return result;
  return result; // TODO
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
      switch (ins.regarding) {

        case 'start':
          for (let i = 0; i < result.length; i++) {
            if (!result[i].from.startsWith('-'))
              result[i].from = addSecondsToTime(result[i].from, ins.shift);
            if (!result[i].to.startsWith('-'))
              result[i].to = addSecondsToTime(result[i].to, ins.shift);
          }
          if (ins.duration && ins.position === 'after') {
            result.push({
              type: ins.type,
              from: secondsToTime(0),
              to: secondsToTime(ins.duration)
            });
          }
          break;
        
        case 'end':
          for (let i = 0; i < result.length; i++) {
            if (result[i].from.startsWith('-'))
              result[i].from = addSecondsToTime(result[i].from, ins.shift);
            if (result[i].to.startsWith('-'))
              result[i].to = addSecondsToTime(result[i].to, ins.shift);
          }
          if (ins.duration && ins.position === 'before') {
            result.push({
              type: ins.type,
              from: '-' + secondsToTime(ins.duration),
              to: '-' + secondsToTime(0)
            })
          }
          break;
        
        default:
          const timecode = result.find((timecode) => timecode.type === ins.regarding);
          if (!timecode) break;

          const time = timeToSeconds(ins.position === 'after' ? timecode.to : timecode.from);
          let start: number = time, end: number = time;
          if (time < 0) start = time + duration;
          else end = time - duration;

          for (let i = 0; i < result.length; i++) {
            if (result[i].from.startsWith('-')) {
              result[i].from = addSecondsToTime(result[i].from, timeToSeconds(result[i].from) <= end ? -ins.shift : 0);
              result[i].to = addSecondsToTime(result[i].to, timeToSeconds(result[i].to) <= end ? -ins.shift : 0);
            } else {
              result[i].from = addSecondsToTime(result[i].from, timeToSeconds(result[i].from) >= start ? ins.shift : 0);
              result[i].to = addSecondsToTime(result[i].to, timeToSeconds(result[i].to) >= start ? ins.shift : 0);
            }
          }
          if (ins.duration) {
            switch (ins.position) {
              case 'after':
                result.push({
                  type: ins.type,
                  from: timecode.to,
                  to: addSecondsToTime(timecode.to, ins.duration)
                })
              case 'before':
                result.push({
                  type: ins.type,
                  from: addSecondsToTime(timecode.from, -ins.duration),
                  to: timecode.from
                })
            }
          }
      }
    }
  }
  return result;
}
