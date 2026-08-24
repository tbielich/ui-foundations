import figma, { html } from "@figma/code-connect/html";
import { SkeletonProps } from "./web-skeleton";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=skeleton",
  {
    props: {
      className: figma.className([
        "uif-skeleton",
        figma.enum("Shape", {
          Text: "text",
          Heading: "heading",
          Circle: "circle",
          Rect: "rect",
        }),
        figma.enum("Size", {
          Sm: "sm",
          Md: undefined,
          Lg: "lg",
        }),
      ]),
    },
    example: ({ className }: SkeletonProps) =>
      html`<span class="${className}" role="status" aria-label="Loading…" aria-busy="true"></span>`,
  },
);
