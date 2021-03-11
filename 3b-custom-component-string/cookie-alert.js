const styleMarkup = `
  <style>
    .container {
      background-color: #237afc;
      color: #fff;
      padding: 1em 1.8em;
      width: 100%;
    }
    .footer {
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
    }
  </style>
`;

const componentMarkup = `
  <div class="container footer">
    <span>This website uses cookies to ensure you get the best experience.</span>
  </div>
`;

class CookieAlert extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = styleMarkup + componentMarkup;
  }

}

customElements.define("cookie-alert", CookieAlert);
