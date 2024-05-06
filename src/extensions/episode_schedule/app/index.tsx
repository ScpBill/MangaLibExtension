function getAnimeSlug () {
  return new URL(document.URL).pathname.split('/').at(-1)!;
}

async function getSheduleElement () {
  return new Promise((resolve: (value: Element) => any) => {
    const interval = setInterval(() => {
      const paper = document.querySelectorAll('.media-content.paper > *');
      if (paper) {
        clearInterval(interval);
        for (const element of paper) {
          if (element.previousElementSibling?.className.includes('section-body') && element.nextElementSibling?.className.includes('section-body')) {
            resolve(element);
          }
        }
      }
    }, 60);
  });
}

async function getShedule (anime_slug: string) {
  return (await (await fetch(`https://api.lib.social/api/anime/${anime_slug}?fields[]=episodesSchedule`)).json() as AnimeSchedule).data.episodes_schedule;
}


function getFormattedDateString (dateString: string) {
  try {
    return new Intl.DateTimeFormat('ru', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(`${dateString} GMT`));
  } catch {
    return 'хуй знает когда ^^';
  }
}


function contstruct (element: Element, modal: Element, scheduleList: AnimeSchedule['data']['episodes_schedule']) {
  const subtext = element.firstChild?.lastChild;
  const UTC = -new Date().getTimezoneOffset() / 60;
  if (subtext) subtext.textContent = `Указана дата и время в вашем часовом поясе (UTC${UTC < 0 ? UTC : `+${UTC}`})`;
  const schedulesOfListElement = element.children[1].children;
  for (let index = 0; index < schedulesOfListElement.length; index++) {
    schedulesOfListElement[index].lastChild!.textContent = getFormattedDateString(scheduleList[index].airing_at);
  }
}


export default async function run_action () {
  const scheduleLineElement = await getSheduleElement();
  const scheduleList = await getShedule(getAnimeSlug());
  if (!scheduleLineElement || !scheduleList) return;
  contstruct(scheduleLineElement, scheduleLineElement, scheduleList);
}
