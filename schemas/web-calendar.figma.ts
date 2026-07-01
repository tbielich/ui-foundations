import figma from "@figma/code-connect";

/**
 * Calendar — Code Connect schema for Figma integration.
 *
 * Maps Figma component properties to web implementation.
 */
figma.connect("TODO:FIGMA_NODE_URL", {
  props: {
    month: figma.string("Month"),
    selectedDate: figma.string("Selected Date"),
    disabled: figma.boolean("Disabled"),
    state: figma.enum("State", {
      Default: "default",
      Hover: "hover",
      Focus: "focus",
      Disabled: "disabled",
    }),
  },
  example: ({ month, selectedDate, disabled, state }) => {
    return `<Calendar month="${month}" value={new Date("${selectedDate}")} disabled={${disabled}} />`;
  },
});
