import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { implementComponentHandler } from '../../src/prompts/implement-component.js';

describe('implementComponentHandler', () => {
  const rootPath = '/fake/root';

  // ---------------------------------------------------------------------------
  // Successful cases (Requirement 17.1, 17.2, 17.4)
  // ---------------------------------------------------------------------------

  it('returns prompt covering all 10 integration surfaces', async () => {
    const result = await implementComponentHandler({ name: 'badge' }, rootPath);

    assert.equal(result.messages.length, 1);
    assert.equal(result.messages[0].role, 'user');
    assert.equal(result.messages[0].content.type, 'text');

    const text = result.messages[0].content.text;

    // All 10 surfaces mentioned
    assert.ok(text.includes('CSS Pattern'), 'Should reference CSS Pattern surface');
    assert.ok(text.includes('Nunjucks Macro'), 'Should reference Nunjucks Macro surface');
    assert.ok(text.includes('Web Component'), 'Should reference Web Component surface');
    assert.ok(text.includes('Documentation Page'), 'Should reference Docs Page surface');
    assert.ok(text.includes('Playground Page'), 'Should reference Playground Page surface');
    assert.ok(text.includes('Playground Renderer'), 'Should reference Playground Renderer surface');
    assert.ok(text.includes('Code Connect'), 'Should reference Code Connect surface');
    assert.ok(text.includes('Component Token Layer'), 'Should reference Token Layer surface');
    assert.ok(text.includes('Unit Tests'), 'Should reference Unit Tests surface');
    assert.ok(text.includes('Accessibility'), 'Should reference Accessibility surface');
  });

  it('includes file paths using the component name as path segment', async () => {
    const result = await implementComponentHandler({ name: 'toggle-switch' }, rootPath);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('src/ui/patterns/toggle-switch.css'), 'CSS pattern path');
    assert.ok(text.includes('site/_includes/macros/ui.njk'), 'Nunjucks macro path');
    assert.ok(text.includes('src/elements/ui-toggle-switch.js'), 'Web Component path');
    assert.ok(text.includes('site/components/toggle-switch.md'), 'Docs page path');
    assert.ok(text.includes('site/components/toggle-switch-playground.md'), 'Playground page path');
    assert.ok(text.includes('site/assets/playground/renderers.js'), 'Playground renderer path');
    assert.ok(text.includes('schemas/web-toggle-switch.figma.ts'), 'Code Connect path');
    assert.ok(text.includes('figma/exports/components-ui.tokens.json'), 'Token layer path');
    assert.ok(text.includes('tests/components/toggle-switch.test.ts'), 'Unit tests path');
  });

  it('includes governance rule references (Requirement 17.2)', async () => {
    const result = await implementComponentHandler({ name: 'card' }, rootPath);
    const text = result.messages[0].content.text;

    assert.ok(
      text.includes('docs/agentic/assistant-behavior-rules.md'),
      'Should reference assistant behavior rules',
    );
    assert.ok(
      text.includes('Rules 8'),
      'Should reference Rules 8–12',
    );
    assert.ok(
      text.includes('docs/ui-foundations-rules.md'),
      'Should reference ui-foundations-rules.md',
    );
    assert.ok(
      text.includes('Naming Rules'),
      'Should reference Naming Rules section',
    );
  });

  it('accepts single-letter component name', async () => {
    const result = await implementComponentHandler({ name: 'a' }, rootPath);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('src/ui/patterns/a.css'));
  });

  it('accepts multi-hyphenated component name', async () => {
    const result = await implementComponentHandler({ name: 'my-complex-component' }, rootPath);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('src/ui/patterns/my-complex-component.css'));
    assert.ok(text.includes('src/elements/ui-my-complex-component.js'));
    assert.ok(text.includes('schemas/web-my-complex-component.figma.ts'));
  });

  // ---------------------------------------------------------------------------
  // Error cases: invalid component name (Requirement 17.3)
  // ---------------------------------------------------------------------------

  it('rejects empty component name', async () => {
    await assert.rejects(
      () => implementComponentHandler({ name: '' }, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('non-empty string'));
        assert.ok(err.message.includes('lowercase letters and hyphens'));
        return true;
      },
    );
  });

  it('rejects missing name argument', async () => {
    await assert.rejects(
      () => implementComponentHandler({}, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('non-empty string'));
        return true;
      },
    );
  });

  it('rejects component name with uppercase letters', async () => {
    await assert.rejects(
      () => implementComponentHandler({ name: 'MyButton' }, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('lowercase letters and hyphens'));
        return true;
      },
    );
  });

  it('rejects component name with numbers', async () => {
    await assert.rejects(
      () => implementComponentHandler({ name: 'button2' }, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('lowercase letters and hyphens'));
        return true;
      },
    );
  });

  it('rejects component name with underscores', async () => {
    await assert.rejects(
      () => implementComponentHandler({ name: 'my_button' }, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('lowercase letters and hyphens'));
        return true;
      },
    );
  });

  it('rejects component name with spaces', async () => {
    await assert.rejects(
      () => implementComponentHandler({ name: 'my button' }, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('lowercase letters and hyphens'));
        return true;
      },
    );
  });

  it('rejects component name starting with hyphen', async () => {
    await assert.rejects(
      () => implementComponentHandler({ name: '-button' }, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('lowercase letters and hyphens'));
        return true;
      },
    );
  });

  it('rejects component name with dots', async () => {
    await assert.rejects(
      () => implementComponentHandler({ name: 'button.solid' }, rootPath),
      (err: Error) => {
        assert.ok(err.message.includes('lowercase letters and hyphens'));
        return true;
      },
    );
  });
});
