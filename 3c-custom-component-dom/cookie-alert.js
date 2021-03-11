const styleRules = `
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
`;

class CookieAlert extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.createComponent();
  }

  createComponent() {
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(styleRules));
    this.appendChild(style);

    const span = document.createElement("span");
    span.innerText = "This website uses cookies to ensure you get the best experience.";
    const div = document.createElement("div");
    div.classList.add("container", "footer");
    div.appendChild(span);
    this.appendChild(div);
  }

}

customElements.define("cookie-alert", CookieAlert);
