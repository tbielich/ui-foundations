import figma, { html } from "@figma/code-connect/html";
import { TreeViewProps } from "./web-tree-view";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=3000-100&m=dev",
  {
    props: {
      selection: figma.enum("Selection", {
        Single: "single",
        Multi: "multi",
      }),
      expanded: figma.boolean("Expanded", { true: "true", false: "false" }),
      label: figma.string("Label"),
    },
    example: ({ selection, expanded, label }: TreeViewProps) =>
      html`<uif-tree-view selection="${selection}">
  <ul class="uif-tree-view" role="tree">
    <li class="uif-tree-node" role="treeitem" aria-expanded="${expanded}" aria-selected="false">
      <div class="uif-tree-node-row" tabindex="0">
        <button class="uif-tree-toggle" type="button" aria-label="Toggle node"></button>
        <span class="uif-tree-label">${label}</span>
      </div>
    </li>
  </ul>
</uif-tree-view>`,
  },
);
