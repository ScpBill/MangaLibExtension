import React from 'react';
import { createRoot } from 'react-dom/client';
import { waitForDOMLoading } from '../../utils';
import { TimecodeModalBody } from './modals/main';
import styles from './index.css';


let players_data: EpisodeResponse['data']['players'] | undefined;
let episodes_data: AnimeEpisodesResponse['data'] | undefined;
export { players_data, episodes_data };


// Keep eye the URL changes to enable or disable the observer
window.addEventListener('urlchange', () => {
  if (!/^\/ru\/anime\/\d+--[\w\d-]+\/episodes\/\d+\/player\/\d+\/?$/.test(document.location.pathname))
    observer.disconnect();
  waitForDOMLoading().then(() => {
    observer.observe(document, { childList: true, subtree: true });
  });
});


// Keep eye the Requests to save needed
window.addEventListener('responseloaded', (event: Event) => {
  if (event instanceof CustomEvent && event.detail.type === 'url') {
    switch (true) {
      case /^https:\/\/api\.lib\.social\/api\/episodes\/\d+(\??.*)?$/.test(event.detail.url.toString()):
        players_data = (event.detail.response as EpisodeResponse).data.players;
        break;
      case /^https:\/\/api\.lib\.social\/api\/episodes\?anime_id=\d+--[\w\d-]+$/.test(event.detail.url.toString()):
        episodes_data = (event.detail.response as AnimeEpisodesResponse).data;
        break;
    }
  }
});


// Wait when DOM loaded to insert styles to head of document
waitForDOMLoading().then(() => {
  const style = document.createElement('style');
  style.textContent = styles;
  document.head.appendChild(style);
});


// Keep eye the document mutations to track down of the modal
const observer = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type !== 'childList') continue;
    for (const node of mutation.addedNodes) {

      // Check that is needed node
      if (!(node instanceof Element && node.className.includes('popup is-hidden'))) continue;
      if (node.querySelector('.popup-header__title')?.textContent !== 'Редактирование тайм кодов') continue;

      // Fetch data if it isn't exists
      if (!players_data) fetch(`https://api.lib.social/api/episodes/${document.location.pathname.match(/\/ru\/anime\/\d+--[\w\d-]+\/episodes\/(\d+)/)![0]}`);
      if (!episodes_data) fetch(`https://api.lib.social/api/episodes?anime_id=${document.location.pathname.match(/\/ru\/anime\/(\d+--[\w\d-]+)/)![0]}`);

      // Render modal component
      const root = createRoot(node.querySelector('.popup-body')!);
      root.render(<TimecodeModalBody/>);
    }
  }
});
