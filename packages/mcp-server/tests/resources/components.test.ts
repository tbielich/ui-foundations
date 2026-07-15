import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handleComponents } from '../../src/resources/components.js';

describe('handleComponents', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `components-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(testDir, { recursive: true });

    // Create component docs directory with test markdown files
    await mkdir(join(testDir, 'site', 'components'), { recursive: true });
    await writeFile(
      join(testDir, 'site', 'components', 'button.md'),
      '---\ntitle: Button\ndescription: Buttons allow users to perform an action.\n---\n\n# Button\n\nButton content here.',
      'utf8',
    );
    await writeFile(
      join(testDir, 'site', 'components', 'input.md'),
      '---\ntitle: Input\ndescription: Text input for forms.\n---\n\n# Input\n\nInput content here.',
      'utf8',
    );
    await writeFile(
      join(testDir, 'site', 'components', 'checkbox.md'),
      '---\ntitle: Checkbox\ndescription: A checkbox control.\n---\n\n# Checkbox',
      'utf8',
    );
    // Playground file should be excluded
    await writeFile(
      join(testDir, 'site', 'components', 'button-playground.md'),
      '---\ntitle: Button Playground\n---\n\nPlayground.',
      'utf8',
    );
    // Index file should be excluded
    await writeFile(
      join(testDir, 'site', 'components', 'index.md'),
      '---\ntitle: Components\n---\n\nIndex.',
      'utf8',
    );

    // Create CSS patterns directory
    await mkdir(join(testDir, 'src', 'ui', 'patterns'), { recursive: true });
    await writeFile(
      join(testDir, 'src', 'ui', 'patterns', 'button.css'),
      `@layer components {
  :is(.uif-button, .button),
  :is(.uif-button, .button).solid {
    display: inline-flex;
    background: var(--uif-button-solid-container-background-default);
  }

  :is(.uif-button, .button):hover,
  :is(.uif-button, .button).is-hover {
    background: var(--uif-button-solid-container-background-hover);
  }

  :is(.uif-button, .button):active,
  :is(.uif-button, .button).is-active {
    background: var(--uif-button-solid-container-background-active);
  }

  :is(.uif-button, .button):focus-visible,
  :is(.uif-button, .button).is-focus-visible {
    border-color: var(--uif-button-solid-border-color-focus);
  }

  :is(.uif-button, .button):disabled,
  :is(.uif-button, .button).is-disabled {
    opacity: 0.5;
  }

  :is(.uif-button, .button).outline {
    background: var(--uif-button-outline-container-background-default);
  }

  :is(.uif-button, .button).ghost {
    background: transparent;
  }
}`,
      'utf8',
    );
    await writeFile(
      join(testDir, 'src', 'ui', 'patterns', 'input.css'),
      `@layer components {
  .input {
    display: block;
  }
}`,
      'utf8',
    );

    // Create schemas directory
    await mkdir(join(testDir, 'schemas'), { recursive: true });
    await writeFile(join(testDir, 'schemas', 'web-button.figma.ts'), 'export default {};', 'utf8');

    // Create component tokens file
    await mkdir(join(testDir, 'dist', 'tokens', 'json'), { recursive: true });
    await writeFile(
      join(testDir, 'dist', 'tokens', 'json', 'components-ui.tokens.json'),
      JSON.stringify({
        $schema: 'https://www.designtokens.org/schemas/2025.10/format.json',
        Button: {
          Solid: {
            'Text Color Default': { $type: 'color', $value: '{Color.Text.Inverse}' },
            Container: {
              'Background Default': { $type: 'color', $value: '{Color.Fill.Brand}' },
            },
          },
        },
        Input: {
          Border: {
            'Color Default': { $type: 'color', $value: '{Color.Border.Default}' },
          },
        },
      }),
      'utf8',
    );
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('listing (uif://components)', () => {
    it('returns a JSON array of all components', async () => {
      const result = await handleComponents('uif://components', testDir);

      assert.equal(result.uri, 'uif://components');
      assert.equal(result.mimeType, 'application/json');
      assert.equal(result.metadata.category, 'components');

      const listing = JSON.parse(result.content as string);
      assert.equal(listing.length, 3);
    });

    it('each listing entry has name, description, and uri', async () => {
      const result = await handleComponents('uif://components', testDir);
      const listing = JSON.parse(result.content as string);

      for (const entry of listing) {
        assert.ok(entry.name, 'entry should have name');
        assert.ok(entry.description, 'entry should have description');
        assert.ok(entry.uri.startsWith('uif://components/'), 'entry should have valid URI');
      }
    });

    it('excludes playground and index files', async () => {
      const result = await handleComponents('uif://components', testDir);
      const listing = JSON.parse(result.content as string);
      const names = listing.map((e: { name: string }) => e.name);

      assert.ok(!names.includes('button-playground'));
      assert.ok(!names.includes('index'));
    });

    it('includes description from frontmatter', async () => {
      const result = await handleComponents('uif://components', testDir);
      const listing = JSON.parse(result.content as string);
      const button = listing.find((e: { name: string }) => e.name === 'button');

      assert.equal(button.description, 'Buttons allow users to perform an action.');
    });

    it('returns a valid content hash', async () => {
      const result = await handleComponents('uif://components', testDir);
      assert.match(result.metadata.contentHash, /^[0-9a-f]{64}$/);
    });
  });

  describe('detail (uif://components/{name})', () => {
    it('returns full ComponentData for a valid component', async () => {
      const result = await handleComponents('uif://components/button', testDir);

      assert.equal(result.uri, 'uif://components/button');
      assert.equal(result.mimeType, 'application/json');
      assert.equal(result.metadata.category, 'components');

      const data = JSON.parse(result.content as string);
      assert.equal(data.name, 'button');
      assert.equal(data.description, 'Buttons allow users to perform an action.');
      assert.ok(data.documentation.includes('# Button'));
      assert.equal(data.cssClassName, 'uif-button');
      assert.match(data.htmlPattern, /class="uif-button solid"/);
      assert.ok(Array.isArray(data.variants));
      assert.ok(Array.isArray(data.states));
      assert.ok(Array.isArray(data.tokens));
      assert.equal(data.codeConnectSchemaPath, 'schemas/web-button.figma.ts');
      assert.equal(data.uri, 'uif://components/button');
    });

    it('extracts variants from CSS', async () => {
      const result = await handleComponents('uif://components/button', testDir);
      const data = JSON.parse(result.content as string);

      assert.ok(data.variants.includes('outline'));
      assert.ok(data.variants.includes('ghost'));
      assert.ok(data.variants.includes('solid'));
    });

    it('extracts states from CSS', async () => {
      const result = await handleComponents('uif://components/button', testDir);
      const data = JSON.parse(result.content as string);

      assert.ok(data.states.includes('default'));
      assert.ok(data.states.includes('hover'));
      assert.ok(data.states.includes('active'));
      assert.ok(data.states.includes('focus-visible'));
      assert.ok(data.states.includes('disabled'));
    });

    it('extracts component tokens', async () => {
      const result = await handleComponents('uif://components/button', testDir);
      const data = JSON.parse(result.content as string);

      assert.ok(data.tokens.length > 0);
      assert.ok(data.tokens.some((t: string) => t.startsWith('Button.')));
    });

    it('resolves case-insensitively', async () => {
      const result = await handleComponents('uif://components/Button', testDir);
      const data = JSON.parse(result.content as string);

      assert.equal(data.name, 'button');
      assert.equal(result.uri, 'uif://components/button');
    });

    it('resolves uppercase variant case-insensitively', async () => {
      const result = await handleComponents('uif://components/BUTTON', testDir);
      const data = JSON.parse(result.content as string);

      assert.equal(data.name, 'button');
    });

    it('returns codeConnectSchemaPath as null when schema does not exist', async () => {
      const result = await handleComponents('uif://components/checkbox', testDir);
      const data = JSON.parse(result.content as string);

      assert.equal(data.codeConnectSchemaPath, null);
    });

    it('returns empty arrays for missing optional data', async () => {
      const result = await handleComponents('uif://components/checkbox', testDir);
      const data = JSON.parse(result.content as string);

      // No CSS file for checkbox in this test setup
      assert.ok(Array.isArray(data.variants));
      assert.ok(Array.isArray(data.states));
      assert.ok(Array.isArray(data.tokens));
    });
  });

  describe('error handling', () => {
    it('throws not-found error with valid component names for unrecognized identifier', async () => {
      await assert.rejects(
        () => handleComponents('uif://components/nonexistent', testDir),
        (err: Error & { code?: number }) => {
          assert.equal(err.code, -32002);
          assert.ok(err.message.includes('nonexistent'));
          assert.ok(err.message.includes('button'));
          assert.ok(err.message.includes('input'));
          assert.ok(err.message.includes('checkbox'));
          return true;
        },
      );
    });

    it('includes fuzzy match suggestion for near-miss names (Levenshtein ≤ 3)', async () => {
      await assert.rejects(
        () => handleComponents('uif://components/buton', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('Did you mean'));
          assert.ok(err.message.includes('button'));
          return true;
        },
      );
    });

    it('does not include fuzzy suggestion for distant names', async () => {
      await assert.rejects(
        () => handleComponents('uif://components/zzzzzzz', testDir),
        (err: Error) => {
          assert.ok(!err.message.includes('Did you mean'));
          return true;
        },
      );
    });
  });
});
