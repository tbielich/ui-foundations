import figma, { html } from "@figma/code-connect/html";
import { BreadcrumbsProps } from "./web-breadcrumbs";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=6000-100&m=dev",
  {
    props: {
      className: figma.className(["uif-breadcrumbs-list"]),
      separator: figma.string("Separator"),
      collapse: figma.enum("Collapse", {
        Responsive: "responsive",
        Always: "always",
        None: "none",
      }),
      maxItems: figma.enum("Max items", {
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
      }),
    },
    example: ({ className, separator, collapse, maxItems }: BreadcrumbsProps) =>
      html`<nav class="uif-breadcrumbs" aria-label="Breadcrumb">
        <ol class="${className || "uif-breadcrumbs-list"}" data-separator="${separator || "/"}" data-collapse="${collapse}" data-max-items="${String(maxItems || 4)}">
          <li class="uif-breadcrumb-item" data-separator="${separator || "/"}">
            <a class="uif-breadcrumb-link" href="/">Home</a>
          </li>
          <li class="uif-breadcrumb-item" data-separator="${separator || "/"}">
            <a class="uif-breadcrumb-link" href="/products">Products</a>
          </li>
          <li class="uif-breadcrumb-item" data-separator="${separator || "/"}">
            <span class="uif-breadcrumb-current" aria-current="page">Current page</span>
          </li>
        </ol>
      </nav>`,
  },
);
