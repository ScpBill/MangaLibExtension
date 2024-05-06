import run_action from './app';


class CustomMutationObserver {
  private status: boolean = false;
  private target: Node;
  private options?: MutationObserverInit | undefined;
  protected get check (): boolean {
    return true;
  }
  constructor (target: Node, options?: MutationObserverInit | undefined) {
    this.target = target;
    this.options = options;
  }
  public observe (callback: MutationCallback): void {
    const observer: MutationObserver = new MutationObserver(async (mutations: MutationRecord[], observer: MutationObserver) => {
      setTimeout(() => {
        if (this.status === (this.status = this.check) || !this.status) return;
        callback(mutations, observer);
      }, 60);
    });
    observer.observe(this.target, this.options);
  }
}


class UrlMutationObserver extends CustomMutationObserver {
  protected get check (): boolean {
    const check_domen = !!/^anilib\.me?$/g.exec(new URL(document.URL).host);
    const check_pathname = !!/^\/ru\/anime\/\d+--[a-z0-9-]+$/g.exec(new URL(document.URL).pathname);
    const check_search = new URL(document.URL).search.slice(1).split('&').every((search) => ![ 'section=comments', 'section=review' ].includes(search));
    return check_domen && check_pathname && check_search;
  }
}


export default async function run_observe () {
    
  // Wait for the document's DOM to load
  if (document.readyState === 'loading') {
    await new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve));
  }
  
  // Creating Mutation observers
  const options: MutationObserverInit = { childList: true, subtree: true };
  const body: HTMLBodyElement = document.querySelector('body')!;
  const url_observer: UrlMutationObserver = new UrlMutationObserver(body, options);
    
  // Observation of mutations
  url_observer.observe(async () => {
    await run_action();
  });
  
}
