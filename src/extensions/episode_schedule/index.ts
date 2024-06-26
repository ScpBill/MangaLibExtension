import { page_info, modal_info, modal_watch } from './observer';
import { waitForDOMLoading } from '../../utils';


// Initialize and export the variables
let anime_slug: string | undefined;
let anime_response: AnimeResponseWithShedule | undefined;
export {
  anime_slug,
  anime_response,
};


// Listeners
window.addEventListener('urlchange', () => {
  if (anime_slug === (anime_slug = document.URL.match(/^https:\/\/anilib\.me\/ru\/anime\/(\d+--[\w\d-]+)/)?.[1])) {
    handler();
  }
});
window.addEventListener('responseloaded', (event) => {
  if (
    event instanceof CustomEvent
    && event.detail.type === 'url'
    && /^https:\/\/api\.lib\.social\/api\/anime\/\d+--[\w\d-]+\?([^&]*&)*(fields\[\]=episodesSchedule)(&[^&]*)*$/.test(event.detail.url.toString())
  ) {
    anime_response = event.detail.response;
    handler();
  }
});


// Address checking function
function addressCheck (): 'info' | 'watch' | undefined {
  switch (true) {
    case /^\/ru\/anime\/\d+--[\w\d-]+\/watch\/?$/.test(document.location.pathname):
      return 'watch';
    case /^\/ru\/anime\/\d+--[\w\d-]+\/?$/.test(document.location.pathname):
      return [ 'comments', 'review' ].includes(document.location.search.slice(1).split('&').findLast((search) => search.startsWith('section='))?.slice(8) || 'info') ? undefined : 'info';
    default:
      return;
  }
}


// General handler
async function handler () {
  switch (addressCheck()) {
    case 'info':
      await waitForDOMLoading();
      page_info.observe(document, { childList: true, subtree: true });
      modal_info.observe(document, { childList: true, subtree: true });
      break;
    case 'watch':
      await waitForDOMLoading();
      if (!anime_response) anime_response = await (await window.fetch(`https://api.lib.social/api/anime/${document.URL.match(/anime\/(\d+--[\w\d-]+)/)?.[1]}?fields[]=episodesSchedule`)).json();
      modal_watch.observe(document, { childList: true, subtree: true });
      break;
  }
}
