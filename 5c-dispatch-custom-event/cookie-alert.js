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

function setCookie(cookieName, cookieValue, expirationDays) {
  var d = new Date();
  d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

class CookieAlert extends HTMLElement {

  static get observedAttributes() {
    return ["message"];
  }

  constructor() {
    super();
    this._message = "This website uses cookies to ensure you get the best experience.";
    this._eventListeners = [];
  }

  connectedCallback() {
    const cookiesAccepted = getCookie("cookiesAccepted");
    if (cookiesAccepted === "y") {
      this.hide();
    } else {
      this.createComponent();
    }
  }

  disconnectedCallback() {
    this._eventListeners.forEach((registration) => {
      registration.object.removeEventListener(registration.event, registration.listener);
    });
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
    const closeButtonClickHandler = () => {
      this.hide();
    };
    closeButton.addEventListener("click", closeButtonClickHandler);
    this._eventListeners.push({
      object: closeButton,
      event: "click",
      handler: closeButtonClickHandler
    });

    const acceptButton = document.createElement("button");
    acceptButton.classList.add("button");
    acceptButton.innerText = "Accept";
    const acceptButtonClickHandler = () => {
      this.hide();
      setCookie("cookiesAccepted", "y", 365);
      this.dispatchEvent(new CustomEvent("accepted", {
        detail: {
          acceptedCookieName: "cookiesAccepted",
          acceptedCookieExpiration: 365
        }
      }));
    };
    acceptButton.addEventListener("click", acceptButtonClickHandler);
    this._eventListeners.push({
      object: acceptButton,
      event: "click",
      handler: acceptButtonClickHandler
    });

    const span = document.createElement("span");

    const div = document.createElement("div");
    div.classList.add("container", "footer");

    div.appendChild(span);
    div.appendChild(closeButton);
    div.appendChild(acceptButton);
    this.appendChild(div);

    this.updateMessage();
  }

  updateMessage() {
    this.querySelector("span").innerText = this._message;
  }

  hide() {
    this.classList.add("is-hidden");
  }

}

customElements.define("cookie-alert", CookieAlert);
