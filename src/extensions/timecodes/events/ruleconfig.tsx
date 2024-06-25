import React from 'react';
import { createRoot } from 'react-dom/client';
import { RuleConfigModalPopup } from '../modals/ruleconfig';


export function show_modal (
  anime_slug_url: string,
  onupdate: (value: ExtensionRuleConfig) => void,
  onremove: () => void,
  rule?: ExtensionRuleConfig
) {
  function closeEventHandler () {
    popup_root.removeChild(popup);
  }
  if (!rule) rule = {
    display: {
      name: null,
      img: null,
      gif: null,
    },
    insertions: [],
    overrides: [],
    titles: [],
    onlyOnTitle: null,
  }
  const popup_root = document.querySelector('div.popup-root')!
  const popup = document.createElement('div');
  popup.setAttribute('class', 'popup is-hidden');
  popup.setAttribute('data-size', 'xs');
  popup.setAttribute('data-type', 'default');
  popup_root.appendChild(popup);
  const root = createRoot(popup);
  root.render(<RuleConfigModalPopup
    anime_slug_url={ anime_slug_url }
    data={ rule }
    onupdate={ onupdate }
    onremove={ onremove }
    onclose={ closeEventHandler }
    onleave={ closeEventHandler }
  />);
}
