import { enumerate, formatDateString } from '../../utils';
import { anime_response } from '.';


/**
 * Observer to information page by anime title
 */
export const page_info = new MutationObserver((mutationList: MutationRecord[], observer: MutationObserver) => {

  function fetchComponent (node: Node | null): Element | null | undefined {
    if (!node) return;

    // Global page update calls to load whole page component
    if (node instanceof Element && node.matches('.fade.container')) {
      observer.disconnect();
      return new Array(...node.querySelectorAll('.media-content.paper > *')).find((element) => element.firstChild?.firstChild?.textContent === ' Дата выхода серий ');
    }

    // Local page update calls to load all page's components
    if (node instanceof Element && node.firstChild?.firstChild?.textContent === ' Дата выхода серий ') {
      observer.disconnect();
      return node;
    }
  }

  function getComponent (): Element | null | undefined {

    // Prefer check for exists schedule component
    for (const node of document.querySelectorAll('.media-content.paper > *')) {
      const component = fetchComponent(node);
      if (component) return component;
    }
    
    // Find component in mutations
    for (const mutation of mutationList) {
      if (mutation.type !== 'childList') continue;
      for (const node of mutation.addedNodes) {

        // Checking for schedule component
        const component = fetchComponent(node);
        if (component) return component;
      }
    }
  }

  function handleComponent (root?: Element | null): void {
    if (!root) return;

    // Get the data
    const timezoneOffset = -new Date().getTimezoneOffset() / 60;
    const UTC = () => `UTC${ timezoneOffset < 0 ? '' : '+' }${ timezoneOffset }`;
    const schedules = anime_response?.data?.episodes_schedule;

    // Apply changes
    root.firstChild!.lastChild!.textContent = `Указана дата и время в вашем часовом поясе (${UTC()})`;
    for (const [ index, dateComponent ] of enumerate(root.children[1].children)) {
      dateComponent.lastChild!.textContent = formatDateString(schedules?.[index]?.airing_at, 'small');
    }
  }
  
  // Run action
  handleComponent(getComponent());

});


/**
 * Observer to information modal by anime title
 */
export const modal_info = new MutationObserver((mutationList: MutationRecord[]) => {

  function getComponent (): Element | null | undefined {

    // Find component in mutations
    for (const mutation of mutationList) {
      if (mutation.type !== 'childList') continue;
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element && node.className.includes('popup is-hidden'))) continue;
        if (node.querySelector('.popup-header__title')?.textContent !== 'Календарь релизов') continue;

        // Return component
        return node.querySelector('.popup__content.scrollable');
      }
    }
  }

  function handleComponent (root?: Element | null) {
    if (!root?.lastChild?.previousSibling) return;
    
    // Get the data
    const schedules = anime_response?.data?.episodes_schedule;

    // Apply changes
    for (const [ index, dateComponent ] of enumerate(root.lastChild.previousSibling.childNodes)) {
      const component = dateComponent.nextSibling?.lastChild;
      if (component) component.textContent = formatDateString(schedules?.[index]?.airing_at, 'small');
    }
  }

  // Run action
  handleComponent(getComponent());
  
});


/**
 * Observer to episodes modal by anime title
 */
export const modal_watch = new MutationObserver((mutationList: MutationRecord[]) => {

  function getClassName (element: Element) {
    if (element.className.split(' ').length === 2) return element.className;
    return [ element.className.split(' ')[0], element.className.split(' ')[2] ].join(' ');
  }

  function renderInfoElement (example: Element): HTMLDivElement {

    // Create text item into the div
    const span = document.createElement('span');
    span.setAttribute('class', (example.querySelectorAll('span')[1] as Element)?.className);
    span.setAttribute('style', 'text-align: center;');
    span.innerText = 'Будущие эпизоды';

    // Create the new div with someone data
    const div = document.createElement('div');
    div.setAttribute('class', getClassName(example));
    div.appendChild(span);

    // Return the new component
    return div;
  }

  function renderScheduleElement (example: Element, number: string, airing_at: string): Node {

    // Create the new div with the all data
    const div = document.createElement('div');
    div.setAttribute('class', getClassName(example));

    // Append childs to div
    for (const component of example.childNodes) {

      // Create the clone at child
      const copy = component.cloneNode(true);

      // Parse clone
      if ((copy as Element).tagName === 'SPAN') {
        if (!(copy as Element)?.className) {
          copy.textContent = `${number} эпизод`;
          div.appendChild(copy);
        } else {
          copy.textContent = '';
          div.appendChild(copy);
        }
      } else if ((copy as Element).tagName === 'DIV') {
        if ((copy as Element).className === 'date') {
          copy.textContent = formatDateString(airing_at, 'compact');
          div.appendChild(copy);
        } else {
          div.appendChild(copy);
        }
      }
    }

    // Return the new component
    return div;
  }
  
  function getComponent (): Element | null | undefined {

    // Find component in mutations
    for (const mutation of mutationList) {
      if (mutation.type !== 'childList') continue;
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element && node.className.includes('popup is-hidden'))) continue;
        if (node.querySelector('.popup-header__title > span')?.textContent !== 'Список эпизодов') continue;

        // Return component
        return node.querySelector('.popup__content.scrollable > .scrollable');
      }
    }
  }

  function handleComponent (root?: Element | null) {
    if (!root?.lastChild?.previousSibling) return;
    if (!anime_response?.data?.episodes_schedule?.length) return;

    // Get example component
    const example = root.lastChild.previousSibling;

    // Append childs to root
    root.appendChild(renderInfoElement(example as Element));
    anime_response?.data?.episodes_schedule.forEach(({ number, airing_at }) => {
      root.appendChild(renderScheduleElement(example as Element, number, airing_at));
    });
  }

  // Run action
  handleComponent(getComponent());

});
