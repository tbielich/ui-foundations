import figma, { html } from "@figma/code-connect/html";
import { MenuProps } from "./web-menu";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=menu&m=dev",
  {
    props: {},
    example: (_props: MenuProps) =>
      html`<ul class="uif-menu" role="menu" aria-label="Options">
  <li class="uif-menu-item" role="menuitem" tabindex="0">Item 1</li>
  <li class="uif-menu-item" role="menuitem" tabindex="-1">Item 2</li>
  <li class="uif-menu-item is-disabled" role="menuitem" aria-disabled="true" tabindex="-1">Disabled item</li>
</ul>`,
  },
);
