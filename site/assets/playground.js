const stateApi = window.UIPlaygroundState || {};
const codeApi = window.UIPlaygroundCode || {};
const renderersApi = window.UIPlaygroundRenderers || {};

const {
  applyQueryParamsToControls,
  syncControlsToQueryParams,
  readPlaygroundState,
  applyControlVisibility,
  syncColorPickersFromControls,
  setControlValueFromColorPicker,
} = stateApi;

const { formatHtmlSnippet, renderHighlightedMarkup } = codeApi;
const renderers = renderersApi.renderers || {};

const hasRequiredApis =
  typeof applyQueryParamsToControls === "function" &&
  typeof syncControlsToQueryParams === "function" &&
  typeof readPlaygroundState === "function" &&
  typeof applyControlVisibility === "function" &&
  typeof syncColorPickersFromControls === "function" &&
  typeof setControlValueFromColorPicker === "function" &&
  typeof formatHtmlSnippet === "function" &&
  typeof renderHighlightedMarkup === "function";

if (!hasRequiredApis) {
  console.warn(
    "[ui-foundations] Playground modules failed to initialize; skipping playground bootstrap.",
  );
} else {
  const initVanillaPlayground = (container) => {
    const rendererId = container.dataset.renderer;
    const renderer = renderers[rendererId];
    if (!renderer) return;

    const playgroundId = container.dataset.playgroundId;
    const queryPrefix = container.dataset.queryPrefix || playgroundId;
    const form = container.querySelector(`#${playgroundId}-controls`);
    const mountNode = container.querySelector(`#${playgroundId}-root`);
    const codeNode = document.getElementById(`${playgroundId}-code`);
    const codeNjkNode = document.getElementById(`${playgroundId}-code-njk`);
    const codeReactNode = document.getElementById(`${playgroundId}-code-react`);
    const resetButton = form
      ? form.querySelector("[data-playground-reset]")
      : null;
    if (!form || !mountNode || !codeNode) return;

    const codeGens = window.UIPlaygroundCodeGenerators || {};
    const njkGen = codeGens.njk && codeGens.njk[rendererId];
    const reactGen = codeGens.react && codeGens.react[rendererId];

    const controls = Array.from(form.querySelectorAll("[data-playground-control]"));
    const queryControls = controls.filter(
      (control) => control.dataset.queryParam === "1",
    );
    const controlByName = new Map(
      controls.map((control) => [control.name, control]),
    );
    applyQueryParamsToControls(queryPrefix, queryControls);
    applyControlVisibility(form, controls);
    syncColorPickersFromControls(form);

    const colorButtons = Array.from(
      form.querySelectorAll("[data-playground-color-button]"),
    );
    const colorPickers = Array.from(
      form.querySelectorAll("[data-playground-color-picker]"),
    );

    colorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.dataset.targetControl;
        if (!targetId) return;

        const picker = form.querySelector(
          `[data-playground-color-picker][data-target-control="${targetId}"]`,
        );
        if (!picker) return;
        picker.click();
      });
    });

    const render = () => {
      applyControlVisibility(form, controls);
      const state = readPlaygroundState(controls);
      const result = renderer(state);
      mountNode.innerHTML = "";
      mountNode.append(result.element);

      const formattedCode = formatHtmlSnippet(result.code);
      renderHighlightedMarkup(codeNode, formattedCode);

      if (njkGen && codeNjkNode) {
        codeNjkNode.textContent = njkGen(state);
      }
      if (reactGen && codeReactNode) {
        codeReactNode.textContent = reactGen(state);
      }

      syncColorPickersFromControls(form);
      syncControlsToQueryParams(queryPrefix, queryControls);
    };

    colorPickers.forEach((picker) => {
      picker.addEventListener("input", () => {
        setControlValueFromColorPicker(form, picker);
        render();
      });
      picker.addEventListener("change", () => {
        setControlValueFromColorPicker(form, picker);
        render();
      });
    });

    form.addEventListener("input", (event) => {
      if (event.target?.matches?.("[data-playground-color-picker]")) return;
      render();
    });
    form.addEventListener("change", (event) => {
      if (event.target?.matches?.("[data-playground-color-picker]")) return;
      render();
    });
    mountNode.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (rendererId !== "checkbox") return;
      if (target.type !== "checkbox") return;

      const checkedControl = controlByName.get("checked");
      if (checkedControl instanceof HTMLInputElement) {
        checkedControl.checked = target.checked;
      }

      const stateControl = controlByName.get("state");
      if (
        stateControl instanceof HTMLSelectElement &&
        stateControl.value === "indeterminate" &&
        target.indeterminate === false
      ) {
        stateControl.value = "default";
      }

      render();
    });
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        form.reset();
        syncColorPickersFromControls(form);
        render();
      });
    }

    render();
  };

  const containers = Array.from(document.querySelectorAll("[data-playground]"));
  containers.forEach((container) => {
    const runtime = container.dataset.runtime || "vanilla";
    if (runtime === "vanilla") {
      initVanillaPlayground(container);
    }
  });
}
