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


// Replace default fetch request method
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
        if (this.readyState === 4) {
          window.dispatchEvent(new CustomEvent('xmlresponseloaded', { detail: { url, response: this.response } }));
        }
      });
    }
    open.call(this, method, url, async, username, password);
  };
})();
