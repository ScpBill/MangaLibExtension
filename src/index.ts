// Replace default methods to change url
(function (history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function (data: any, unused: string, url?: string | URL | null | undefined) {
    pushState.call(history, data, unused, url);
    window.dispatchEvent(new Event('urlchange'));
  };

  history.replaceState = function (data: any, unused: string, url?: string | URL | null | undefined) {
    replaceState.call(history, data, unused, url);
    window.dispatchEvent(new Event('urlchange'));
  };
})(window.history);


// Replace default fetch request methods
(function () {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null,
  ) {
    if (/^https:\/\/api\.lib\.social\/api\/?/.test(url.toString())) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState !== 4) return;
        window.dispatchEvent(new CustomEvent('responseloaded', { detail: { type: 'url', url, response: this.response } }));
      });
    }
    open.call(this, method, url, async, username, password);
  };
})();

(function () {
  const fetch = window.fetch;
  window.fetch = async function (input: URL | RequestInfo, init?: RequestInit | undefined) {
    const url = input instanceof Request ? input.url : input.toString();
    if (/^https:\/\/api\.lib\.social\/api\/?/.test(url)) {
      const response = await fetch(input, init);
      const data = await response.clone().json();
      window.dispatchEvent(new CustomEvent('responseloaded', { detail: { type: 'url', url, response: data } }));
      return response;
    }
    return fetch(input, init);
  };
})();
