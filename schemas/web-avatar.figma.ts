import figma, { html } from "@figma/code-connect/html";
import { AvatarProps } from "./web-avatar";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2535-280&m=dev",
  {
    props: {
      className: figma.className([
        "avatar",
        figma.enum("Size", {
          xs: "xs",
          sm: "sm",
          md: undefined,
          lg: "lg",
          xl: "xl",
        }),
      ]),
      initials: figma.string("Initials"),
    },
    example: ({ className, initials }: AvatarProps) =>
      html`<span class="${className}" role="img" aria-label="${initials}"><span class="avatar__initials">${initials}</span></span>`,
  },
);
