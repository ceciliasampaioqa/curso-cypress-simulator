import 'cypress-axe' //module for accessibility testing
import './commands' //module for custom commands

const app = window.top
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style')
  style.innerHTML = `
  .command-name-request,
  .command-name-xhr,
  .command-name-page-load,
  .command-name-new-url,
  .command-name-page-load-start,
  .command-name-page-load-end {
  display: none;
  }
  .command-method::before {
  content: none !important;
  background-color: red;
  }
  .command-method {
  background-color:rgb(233, 120, 205);
  color: white;
  border-radius: 3px;
  padding: 3px 5px;
  }
  .command-method span {
  color: white;
  }
  .reporter .command-name-assert .command-state-passed .command-method span {
  background-color: unset !important;
  color: white !important;
  }
  .reporter .command-name-assert .command-state-passed .command-method {
    background-color: #1fa971;
}
    .reporter .command-name-assert .command-state-failed .command-method span {
    background-color: unset !important;
  color: white !important;
}
    .reporter .command-name-assert .command-state-failed .command-method {
    background-color: #df092f;
}
  `
  style.setAttribute('data-hide-command-log-request', '')
  app.document.head.appendChild(style)
}
