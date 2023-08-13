class KergeThemeSwitcher extends HTMLElement {
  constructor() {
    super();
    this.root = document.documentElement;
    this.attachShadow({mode: 'open'});
  }

  /**
   * @type {Record<string, string>}
   */
  static get Themes() {
    return {
      DARK: 'dark',
      LIGHT: 'light',
    };
  }

  /**
   * @type {string}
   */
  static get StorageKey() {
    return 'kerge-theme';
  }

  /**
   * @param {string} theme
   */
  saveTheme(theme) {
    if (!window.localStorage) {
      return;
    }
    window.localStorage.setItem(this.constructor.StorageKey, theme);
  }

  /**
   * @returns {string | null}
   */
  loadTheme() {
    if (!window.localStorage) {
      return;
    }
    return window.localStorage.getItem(this.constructor.StorageKey);
  }

  /**
   * @returns {boolean}
   */
  isDark() {
    return (
      (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      this.root.dataset.theme === this.constructor.Themes.DARK
    );
  }

  /**
   * @type {string}
   */
  get theme() {
    return this.isDark()
      ? this.constructor.Themes.DARK
      : this.constructor.Themes.LIGHT;
  }

  /**
   * @returns {HTMLStyleElement}
   */
  renderStyles() {
    const css = `
    button {
      align-items: center;
      background: #ddd;
      border-radius: 333px;
      border: 0;
      color: var(--c-txt);
      cursor: pointer;
      display: flex;
      font-size: 1rem;
      line-height: 0;
      padding: .5rem 1rem;
      transition: all 0.2s ease-out;
    }
    .dark {
      background: #111;
    }
    @media (prefers-color-scheme: dark) {
      button {
        background: #111;
      }
    }
    .dark .icon {
      -webkit-mask: url(/docs/assets/img/moon.svg) no-repeat left;
      mask: url(/docs/assets/img/moon.svg) no-repeat left;
    }
    .light .icon {
      -webkit-mask: url(/docs/assets/img/sun.svg) no-repeat left;
      mask: url(/docs/assets/img/sun.svg) no-repeat left;
    }
    .icon {
      display: inline-block;
      background-color: var(--c-txt);
      width: 1.5rem;
      aspect-ratio: 1;
      margin-right: .5rem;
    }`;

    const styles = document.createElement('style');
    styles.textContent = css;
    return styles;
  }

  /**
   * @param {string} theme
   */
  setTheme(theme) {
    this.root.dataset.theme = theme;
    this.saveTheme(theme);
  }

  /**
   * @returns {{label: HTMLSpanElement, button: HTMLButtonElement}}
   */
  renderButton() {
    const text = this.isDark() ? 'Dark' : 'Light';
    const theme = this.isDark()
      ? this.constructor.Themes.DARK
      : this.constructor.Themes.LIGHT;

    const tpl = `<button type="button" class="${theme}">
      <span class="icon"></span>
      <span class="label">${text}</span>
    </button>`;

    this.shadowRoot.innerHTML = tpl;
    const button = this.shadowRoot.querySelector('button');
    const label = this.shadowRoot.querySelector('.label');
    return {label, button};
  }

  connectedCallback() {
    const loadedTheme = this.loadTheme();
    if (loadedTheme) {
      this.setTheme(loadedTheme);
    }
    this.innerHTML = '';
    const styles = this.renderStyles();

    const {button, label} = this.renderButton();
    button.addEventListener('click', (e) => {
      const dark = this.constructor.Themes.DARK;
      const light = this.constructor.Themes.LIGHT;
      let labelText = 'Light';
      let klass = light;
      if (!this.isDark()) {
        labelText = 'Dark';
        klass = dark;
      }

      this.setTheme(klass);
      label.textContent = labelText;
      e.target.className = klass;
    });
    this.shadowRoot.prepend(styles, button);
  }
}

customElements.define('kerge-theme-switcher', KergeThemeSwitcher);
