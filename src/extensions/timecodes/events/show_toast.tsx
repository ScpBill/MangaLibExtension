import React from 'react';
import ReactDOM from 'react-dom';
import { Toast } from '../components/toast/main';


export function show_toast(toast: ToastResponse) {
  const container = Array.from(document.querySelectorAll('#app > * > div')).at(-1)!;
  const toastContainer = document.createElement('div');
  container.appendChild(toastContainer);

  ReactDOM.render(
    <Toast type={ toast.data.toast.type } message={ toast.data.toast.message } />,
    toastContainer
  );

  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(toastContainer);
    container.removeChild(toastContainer);
  }, 5000);
}
