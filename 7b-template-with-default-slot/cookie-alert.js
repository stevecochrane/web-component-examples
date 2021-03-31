const template = document.createElement('template');

template.innerHTML = `
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
    .button {
      background-color: transparent;
      border-color: #fff;
      color: #fff;
      float: right;
      margin-right: 50px;
      padding: 5px 40px;
    }
  </style>
  <div class="container footer">
    <slot id="message" name="message">This is the <strong>default</strong> message.</slot>
    <slot name="reference"></slot>
    <button id="close-button" class="button">Close</button>
    <button id="accept-button" class="button">Accept</button>
  </div>
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
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._eventListeners = [];
  }

  connectedCallback() {
    const cookiesAccepted = getCookie("cookiesAccepted");
    if (cookiesAccepted === "y") {
      this.hide();
    } else {
      this.initComponent();
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

  initComponent() {
    const closeButton = this.shadowRoot.getElementById("close-button");
    const closeButtonClickHandler = () => {
      this.hide();
    };
    closeButton.addEventListener("click", closeButtonClickHandler);
    this._eventListeners.push({
      object: closeButton,
      event: "click",
      handler: closeButtonClickHandler
    });

    const acceptButton = this.shadowRoot.getElementById("accept-button");
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

    this.updateMessage();
  }

  updateMessage() {
    this.shadowRoot.getElementById("message").innerText = this._message;
  }

  hide() {
    this.style.display = "none";
  }

}

customElements.define("cookie-alert", CookieAlert);
