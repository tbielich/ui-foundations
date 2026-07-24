import figma, { html } from "@figma/code-connect/html";

export interface TableProps {
  className: string;
  selection?: string;
  resizable?: boolean;
}

// TODO: Replace node-id with the actual Figma Table component node ID.
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
        figma.boolean("Sortable", {
          true: "uif-table--sortable",
          false: undefined,
        }),
      ]),
      selection: figma.enum("Selection", {
        None: undefined,
        Single: "single",
        Multi: "multi",
      }),
      resizable: figma.boolean("Resizable"),
    },
    example: ({ className, selection, resizable }: TableProps) => html`
      <div class="uif-table-wrapper">
        <table class="${className}"${selection ? ` data-selection="${selection}"` : ""}>
          <caption>Destinations</caption>
          <thead>
            <tr>
              <th class="uif-table-th" aria-sort="none"${resizable ? " data-resizable" : ""}>Destination</th>
              <th class="uif-table-th" aria-sort="none"${resizable ? " data-resizable" : ""}>Departure</th>
              <th class="uif-table-th">Duration</th>
              <th class="uif-table-th">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr class="uif-table-tr">
              <td class="uif-table-td">Mallorca</td>
              <td class="uif-table-td">15 Aug 2025</td>
              <td class="uif-table-td">7 nights</td>
              <td class="uif-table-td">£499</td>
            </tr>
          </tbody>
        </table>
      </div>
      <script type="module" src="/vendor/ui-foundations/components/table.js"></script>
    `,
  },
);
