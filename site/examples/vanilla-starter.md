---
layout: layouts/docs.njk
title: Vanilla Starter
description: Get started with ui-foundations in a Vite vanilla app (no React).
navTitle: Vanilla Starter
order: 5
permalink: /examples/vanilla-starter/
breadcrumb:
  - label: Examples
    url: /examples/
  - label: Vanilla Starter
---

## 1. Create a new Vite app

```bash
npm create vite@latest ui-foundations-starter -- --template vanilla
cd ui-foundations-starter
npm install
npm install ui-foundations
```

## 2. Import UI Foundations styles

In `src/main.js`:

```js
import "./style.css";
import "ui-foundations/core.css";
import "ui-foundations/ui.css";
import "ui-foundations/tokens/primitives.css";
import "ui-foundations/tokens/brand-a.css";
import "ui-foundations/tokens/brand-b.css";
import "ui-foundations/tokens/brand-c.css";
import "ui-foundations/tokens/color-light.css";
import "ui-foundations/tokens/color-dark.css";
import "ui-foundations/tokens/semantic.css";
import "ui-foundations/tokens/components.css";
```

## 3. Render an example page

Use package classes like `.uif-button`, `.uif-input`, `.uif-field-label`, and `.checkbox`.

```js
document.querySelector("#app").innerHTML = `
  <main style="max-width: 720px; margin: 2rem auto; padding: 0 1rem;">
    <h1>UI Foundations Vanilla Starter</h1>

    <label class="uif-field-label" for="email">
      <span class="uif-label-content">
        <span class="uif-label-content-text">Email</span>
      </span>
    </label>
    <input class="uif-input" id="email" type="email" placeholder="name@example.com" />

    <div style="height: 0.75rem"></div>
    <button class="uif-button solid" type="button">
      <span class="uif-label-content"><span class="uif-label-content-text">Submit</span></span>
    </button>
  </main>
`;
```

## 4. Activate brand and color mode

Apply brand and mode to `:root` (`<html>`), not `body`.

```js
const root = document.documentElement;

root.dataset.brand = "a"; // "a" | "b" | "c"
root.dataset.mode = "light"; // "light" | "dark"

window.setBrand = (brand) => {
  root.dataset.brand = brand;
};

window.setMode = (mode) => {
  root.dataset.mode = mode === "dark" ? "dark" : "light";
};
```

## 5. Run locally

```bash
npm run dev
```

## Notes

- If brand or mode does not change visually, check that token imports are present, including `brand-a.css`, `brand-b.css`, and `color-dark.css`.
- Keep `data-brand` and `data-mode` on `document.documentElement` so selectors like `:root[data-brand="a"]` and `:root[data-mode="dark"]` can match.
