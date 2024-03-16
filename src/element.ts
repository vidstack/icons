import type { IconType } from "./icons";
import { lazyPaths } from "./icons/lazy";
import { cloneTemplateContent, createTemplate } from "./utils/dom";

const svgTemplate = /* #__PURE__*/ createTemplate(
  `<svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg>`
);

/**
 * The `<media-icon>` component dynamically loads and renders our icons. See our
 * [media icons catalog](https://www.vidstack.io/media-icons) to preview them all. Do note, the
 * icon `type` can be dynamically changed.
 *
 * @example
 * ```html
 * <media-icon type="play"></media-icon>
 * <media-icon type="pause"></media-icon>
 * ```
 */
export class MediaIconElement extends HTMLElement {
  static tagName = "media-icon";

  static get observedAttributes() {
    return ["type"];
  }

  private _svg = this._createSVG();
  private _type: IconType | null = null;

  /**
   * The type of icon. You can find a complete and searchable list on our website - see our
   * [media icons catalog](https://www.vidstack.io/media-icons?lib=html).
   */
  get type() {
    return this._type;
  }

  set type(type) {
    if (this._type === type) return;

    // Make sure type is reflected as attribute incase the element is cloned.
    if (type) this.setAttribute("type", type);
    else this.removeAttribute("type");

    this._onTypeChange(type);
  }

  attributeChangedCallback(name: string, _: unknown, newValue: string | null) {
    if (name === "type") {
      const type = newValue ? (newValue as IconType) : null;
      if (this._type !== type) {
        this._onTypeChange(type);
      }
    }
  }

  connectedCallback() {
    this.classList.add("vds-icon");

    if (this._svg.parentNode !== this) {
      this.prepend(this._svg);
    }
  }

  private _createSVG() {
    return cloneTemplateContent<SVGElement>(svgTemplate);
  }

  private _loadIcon() {
    const type = this._type;
    if (type && lazyPaths[type]) {
      lazyPaths[type]().then(({ default: paths }) => {
        // Check type because it may have changed by the time the icon loads.
        if (type === this._type) this._onPathsChange(paths);
      });
    } else {
      this._onPathsChange("");
    }
  }

  private _onTypeChange(type: IconType | null) {
    this._type = type;
    this._loadIcon();
  }

  private _onPathsChange(paths: string) {
    this._svg.innerHTML = paths;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "media-icon": MediaIconElement;
  }
}

if (typeof window !== "undefined") {
  window.customElements?.define(MediaIconElement.tagName, MediaIconElement);
}
