import figma, { html } from "@figma/code-connect/html";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=TABS-NODE-ID&m=dev",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Horizontal: "horizontal",
        Vertical: "vertical",
      }),
      size: figma.enum("Size", {
        Default: "default",
        Compact: "compact",
      }),
      overflow: figma.enum("Overflow", {
        Scroll: "scroll",
        Wrap: "wrap",
      }),
    },
    example: ({ orientation, size, overflow }) => html`<uif-tabs orientation="${orientation}" size="${size}" overflow="${overflow}">
  <uif-tab-list aria-label="Example tabs">
    <uif-tab label="Overview" selected controls="panel-overview"></uif-tab>
    <uif-tab label="Details" controls="panel-details"></uif-tab>
  </uif-tab-list>
  <uif-tab-panel id="panel-overview">Overview content</uif-tab-panel>
  <uif-tab-panel id="panel-details" hidden>Details content</uif-tab-panel>
</uif-tabs>`,
  },
);
