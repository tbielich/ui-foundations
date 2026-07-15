import figma, { html } from "@figma/code-connect/html";
import { DividerProps } from "./web-divider";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2528-272&m=dev",
  {
    props: {
      className: figma.className(["uif-divider"]),
      orientation: figma.enum("Orientation", {
        horizontal: undefined,
        vertical: "vertical",
      }),
    },
    example: ({ className, orientation }: DividerProps & { orientation?: string }) =>
      html`<hr class="${className}"${orientation ? ` aria-orientation="vertical"` : ""} />`,
  },
);
