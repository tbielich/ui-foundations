/**
 * Unit tests for the propose_token prompt handler.
 *
 * Tests validate: argument validation, layer-specific guidance tailoring,
 * prompt template structure (naming rules, layering rules, reference checks,
 * validation step), and error handling.
 *
 * Requirements: 18.1, 18.2, 18.3, 18.4
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { proposeTokenHandler } from '../../src/prompts/propose-token.js';

const ROOT_PATH = '/tmp/test-root';

describe('proposeTokenHandler', () => {
  describe('argument validation', () => {
    it('rejects invalid layer value with error listing valid options', async () => {
      await assert.rejects(
        () => proposeTokenHandler({ layer: 'invalid', purpose: 'test purpose' }, ROOT_PATH),
        (err: Error) => {
          assert.match(err.message, /Invalid layer/);
          assert.match(err.message, /core/);
          assert.match(err.message, /semantic/);
          assert.match(err.message, /component/);
          assert.match(err.message, /mode/);
          return true;
        },
      );
    });

    it('rejects empty purpose argument', async () => {
      await assert.rejects(
        () => proposeTokenHandler({ layer: 'core', purpose: '' }, ROOT_PATH),
        (err: Error) => {
          assert.match(err.message, /purpose/i);
          return true;
        },
      );
    });

    it('rejects purpose exceeding 500 characters', async () => {
      const longPurpose = 'x'.repeat(501);
      await assert.rejects(
        () => proposeTokenHandler({ layer: 'core', purpose: longPurpose }, ROOT_PATH),
        (err: Error) => {
          assert.match(err.message, /500/);
          return true;
        },
      );
    });

    it('accepts purpose at exactly 500 characters', async () => {
      const exactPurpose = 'x'.repeat(500);
      const result = await proposeTokenHandler({ layer: 'core', purpose: exactPurpose }, ROOT_PATH);
      assert.ok(result.messages.length > 0);
    });
  });

  describe('prompt structure', () => {
    it('returns a single user message', async () => {
      const result = await proposeTokenHandler(
        { layer: 'semantic', purpose: 'Text color for disabled state' },
        ROOT_PATH,
      );
      assert.equal(result.messages.length, 1);
      assert.equal(result.messages[0].role, 'user');
      assert.equal(result.messages[0].content.type, 'text');
    });

    it('includes naming convention rules section', async () => {
      const result = await proposeTokenHandler(
        { layer: 'component', purpose: 'Button background' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Naming Convention Rules/);
      assert.match(text, /PascalCase/);
      assert.match(text, /kebab-case/);
    });

    it('includes token layering rules section', async () => {
      const result = await proposeTokenHandler(
        { layer: 'core', purpose: 'New spacing primitive' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Token Layering Rules/);
      assert.match(text, /four layers/i);
    });

    it('includes layer placement rationale section', async () => {
      const result = await proposeTokenHandler(
        { layer: 'semantic', purpose: 'Fill color for surfaces' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Layer Placement Rationale/);
    });

    it('includes reference checks section', async () => {
      const result = await proposeTokenHandler(
        { layer: 'mode', purpose: 'New brand blue shade' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Reference Checks/);
      assert.match(text, /get_token/);
    });

    it('includes validation step section referencing validate_token_name tool', async () => {
      const result = await proposeTokenHandler(
        { layer: 'component', purpose: 'Slider thumb color' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Validation Step/);
      assert.match(text, /validate_token_name/);
    });

    it('includes the purpose in the template', async () => {
      const purpose = 'Background color for outlined button hover state';
      const result = await proposeTokenHandler(
        { layer: 'component', purpose },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.ok(text.includes(purpose));
    });
  });

  describe('layer-specific naming guidance', () => {
    it('component layer includes variant-first path format', async () => {
      const result = await proposeTokenHandler(
        { layer: 'component', purpose: 'Button background color' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Component\.variant\.part\.property\.state/);
      assert.match(text, /variant-first/i);
    });

    it('semantic layer includes role-based format', async () => {
      const result = await proposeTokenHandler(
        { layer: 'semantic', purpose: 'Text color for default' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Color\.Text\.Default/);
      assert.match(text, /role-based/i);
    });

    it('core layer includes primitives format', async () => {
      const result = await proposeTokenHandler(
        { layer: 'core', purpose: 'New spacing scale value' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Size\.Spacing\.100/);
      assert.match(text, /primitives/i);
    });

    it('mode layer includes color palette format', async () => {
      const result = await proposeTokenHandler(
        { layer: 'mode', purpose: 'New blue shade for dark mode' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /Color\.Palette\.Blue\.500/);
      assert.match(text, /color palette/i);
    });
  });

  describe('layer placement rationale tailoring', () => {
    it('core rationale mentions raw physical values', async () => {
      const result = await proposeTokenHandler(
        { layer: 'core', purpose: 'Spacing value' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /raw physical values/);
    });

    it('semantic rationale mentions meaning and roles', async () => {
      const result = await proposeTokenHandler(
        { layer: 'semantic', purpose: 'Text role' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /meaning/i);
      assert.match(text, /role/i);
    });

    it('component rationale mentions specific component', async () => {
      const result = await proposeTokenHandler(
        { layer: 'component', purpose: 'Button token' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /specific component/);
    });

    it('mode rationale mentions light vs. dark mode', async () => {
      const result = await proposeTokenHandler(
        { layer: 'mode', purpose: 'Palette color' },
        ROOT_PATH,
      );
      const text = result.messages[0].content.text;
      assert.match(text, /light.*dark/i);
    });
  });
});
