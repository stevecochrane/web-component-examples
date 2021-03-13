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
  .button {
    background-color: transparent;
    border-color: #fff;
    color: #fff;
    float: right;
    margin-right: 50px;
    padding: 5px 40px;
  }
  .is-hidden {
    display: none;
  }
`;

class CookieAlert extends HTMLElement {

  static get observedAttributes() {
    return ["message"];
  }

  constructor() {
    super();
    this._message = "This website uses cookies to ensure you get the best experience.";
  }

  connectedCallback() {
    this.createComponent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "message") {
        this._message = newValue;
        this.updateMessage();
      }
    }
  }

  get message() {
    return this._message;
  }

  set message(value) {
    this._message = value;
    this.setAttribute("message", value);
    this.updateMessage();
  }

  createComponent() {
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(styleRules));
    this.appendChild(style);

    const closeButton = document.createElement("button");
    closeButton.classList.add("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => {
      this.classList.add("is-hidden");
    });

    const span = document.createElement("span");
    const div = document.createElement("div");
    div.classList.add("container", "footer");
    div.appendChild(span);
    div.appendChild(closeButton);
    this.appendChild(div);

    this.updateMessage();
  }

  updateMessage() {
    this.querySelector("span").innerText = this._message;
  }

}

customElements.define("cookie-alert", CookieAlert);
