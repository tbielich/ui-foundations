import figma, { html } from "@figma/code-connect/html";

export interface TableProps {
  className: string;
  selection: string;
}

// TODO: Replace node-id with the actual Figma Table component node ID
figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=TABLE-NODE-ID&m=dev",
  {
    props: {
      className: figma.className([
        "uif-table",
        figma.enum("Density", {
          Compact: "uif-table--compact",
          Comfortable: "uif-table--comfortable",
          Spacious: "uif-table--spacious",
          Default: undefined,
        }),
      ]),
      selection: figma.enum("Selection", {
        Single: "single",
        Multi: "multi",
        None: undefined,
      }),
    },
    example: ({ className, selection }: TableProps) => html`
      <div class="uif-table-wrapper">
        <table class="${className}"${selection ? ` data-selection="${selection}"` : ""}>
          <thead>
            <tr>
              <th aria-sort="none">Column A</th>
              <th aria-sort="none">Column B</th>
              <th>Column C</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Value</td><td>Value</td><td>Value</td></tr>
          </tbody>
        </table>
      </div>
      <script type="module" src="/vendor/ui-foundations/components/table.js"></script>
    `,
  },
);
