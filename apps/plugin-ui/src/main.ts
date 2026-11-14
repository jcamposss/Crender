import messages from './i18n/pt-BR.json';

const app = document.querySelector<HTMLElement>('#app');
if (app === null) {
  throw new Error('index.html must contain the #app mount point');
}

document.title = messages.appTitle;

const heading = document.createElement('h1');
heading.textContent = messages.appTitle;

const status = document.createElement('p');
status.textContent = messages.installedMessage;

// SketchUp 2021's embedded Chromium predates Element.replaceChildren (Chrome 86).
app.append(heading, status);
