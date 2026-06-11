import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handleTokens } from '../../src/resources/tokens.js';

describe('handleTokens', () => {
  let testDir: string;
  const tokenDir = 'dist/tokens/json';

  beforeEach(async () => {
    testDir = join(tmpdir(), `tokens-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, tokenDir), { recursive: true });

    // Create test token files
    await writeFile(
      join(testDir, tokenDir, 'core-primitives.tokens.json'),
      JSON.stringify({ spacing: { '100': { $value: '4px', $type: 'dimension' } } }),
      'utf8',
    );
    await writeFile(
      join(testDir, tokenDir, 'semantics-roles.tokens.json'),
      JSON.stringify({ color: { text: { default: { $value: '#000', $type: 'color' } } } }),
      'utf8',
    );
    await writeFile(
      join(testDir, tokenDir, 'components-ui.tokens.json'),
      JSON.stringify({ button: { solid: { background: { $value: '{color.fill.brand}', $type: 'color' } } } }),
      'utf8',
    );
    await writeFile(
      join(testDir, tokenDir, 'appearance-modes.tokens.mode-light.json'),
      JSON.stringify({ color: { palette: { white: { $value: '#fff', $type: 'color' } } } }),
      'utf8',
    );
    await writeFile(
      join(testDir, tokenDir, 'appearance-modes.tokens.mode-dark.json'),
      JSON.stringify({ color: { palette: { black: { $value: '#000', $type: 'color' } } } }),
      'utf8',
    );
    await writeFile(
      join(testDir, tokenDir, 'themes-brands.tokens.brand-a.json'),
      JSON.stringify({ brand: 'a', color: { primary: { $value: '#f00' } } }),
      'utf8',
    );
    await writeFile(
      join(testDir, tokenDir, 'themes-brands.tokens.brand-b.json'),
      JSON.stringify({ brand: 'b', color: { primary: { $value: '#0f0' } } }),
      'utf8',
    );
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  // -------------------------------------------------------------------------
  // Single-file tokens
  // -------------------------------------------------------------------------

  it('returns core primitives for uif://tokens/core', async () => {
    const result = await handleTokens('uif://tokens/core', testDir);

    assert.equal(result.uri, 'uif://tokens/core');
    assert.equal(result.name, 'Core Primitives Tokens');
    assert.equal(result.mimeType, 'application/json');
    assert.equal(result.metadata.category, 'tokens');
    assert.equal(result.metadata.layer, 'core');
    assert.ok(result.metadata.contentHash.length === 64);

    const parsed = JSON.parse(result.content as string);
    assert.deepEqual(parsed.spacing['100'], { $value: '4px', $type: 'dimension' });
  });

  it('returns semantic tokens for uif://tokens/semantic', async () => {
    const result = await handleTokens('uif://tokens/semantic', testDir);

    assert.equal(result.uri, 'uif://tokens/semantic');
    assert.equal(result.name, 'Semantic Role Tokens');
    assert.equal(result.mimeType, 'application/json');
    assert.equal(result.metadata.category, 'tokens');
    assert.equal(result.metadata.layer, 'semantic');
  });

  it('returns component tokens for uif://tokens/component', async () => {
    const result = await handleTokens('uif://tokens/component', testDir);

    assert.equal(result.uri, 'uif://tokens/component');
    assert.equal(result.name, 'Component UI Tokens');
    assert.equal(result.mimeType, 'application/json');
    assert.equal(result.metadata.category, 'tokens');
    assert.equal(result.metadata.layer, 'component');
  });

  // -------------------------------------------------------------------------
  // Modes (combined)
  // -------------------------------------------------------------------------

  it('returns combined modes for uif://tokens/modes', async () => {
    const result = await handleTokens('uif://tokens/modes', testDir);

    assert.equal(result.uri, 'uif://tokens/modes');
    assert.equal(result.name, 'Appearance Mode Tokens');
    assert.equal(result.mimeType, 'application/json');
    assert.equal(result.metadata.category, 'tokens');
    assert.equal(result.metadata.layer, 'mode');

    const parsed = JSON.parse(result.content as string);
    assert.ok('mode-light' in parsed);
    assert.ok('mode-dark' in parsed);
    assert.deepEqual(parsed['mode-light'].color.palette.white, { $value: '#fff', $type: 'color' });
    assert.deepEqual(parsed['mode-dark'].color.palette.black, { $value: '#000', $type: 'color' });
  });

  // -------------------------------------------------------------------------
  // Brands (combined)
  // -------------------------------------------------------------------------

  it('returns combined brands for uif://tokens/brands', async () => {
    const result = await handleTokens('uif://tokens/brands', testDir);

    assert.equal(result.uri, 'uif://tokens/brands');
    assert.equal(result.name, 'Brand Theme Tokens');
    assert.equal(result.mimeType, 'application/json');
    assert.equal(result.metadata.category, 'tokens');
    assert.equal(result.metadata.layer, 'brand');

    const parsed = JSON.parse(result.content as string);
    assert.ok('brand-a' in parsed);
    assert.ok('brand-b' in parsed);
    assert.equal(parsed['brand-a'].brand, 'a');
    assert.equal(parsed['brand-b'].brand, 'b');
  });

  it('brands are sorted alphabetically by key', async () => {
    const result = await handleTokens('uif://tokens/brands', testDir);
    const parsed = JSON.parse(result.content as string);
    const keys = Object.keys(parsed);
    assert.deepEqual(keys, ['brand-a', 'brand-b']);
  });

  // -------------------------------------------------------------------------
  // Content hash
  // -------------------------------------------------------------------------

  it('returns a valid SHA-256 content hash', async () => {
    const result = await handleTokens('uif://tokens/core', testDir);
    assert.equal(result.metadata.contentHash.length, 64);
    assert.match(result.metadata.contentHash, /^[0-9a-f]{64}$/);
  });

  it('content hash changes when underlying file changes', async () => {
    const result1 = await handleTokens('uif://tokens/core', testDir);

    await writeFile(
      join(testDir, tokenDir, 'core-primitives.tokens.json'),
      JSON.stringify({ spacing: { '200': { $value: '8px', $type: 'dimension' } } }),
      'utf8',
    );

    const result2 = await handleTokens('uif://tokens/core', testDir);
    assert.notEqual(result1.metadata.contentHash, result2.metadata.contentHash);
  });

  // -------------------------------------------------------------------------
  // Error cases
  // -------------------------------------------------------------------------

  it('throws error with code -32603 when token file is missing', async () => {
    await rm(join(testDir, tokenDir, 'core-primitives.tokens.json'));

    await assert.rejects(
      () => handleTokens('uif://tokens/core', testDir),
      (err: Error & { code?: number }) => {
        assert.ok(err.message.includes('Token file not found or unreadable'));
        assert.ok(err.message.includes('core-primitives.tokens.json'));
        assert.equal(err.code, -32603);
        return true;
      },
    );
  });

  it('throws error when mode-light file is missing', async () => {
    await rm(join(testDir, tokenDir, 'appearance-modes.tokens.mode-light.json'));

    await assert.rejects(
      () => handleTokens('uif://tokens/modes', testDir),
      (err: Error & { code?: number }) => {
        assert.ok(err.message.includes('Token file not found or unreadable'));
        assert.ok(err.message.includes('mode-light'));
        assert.equal(err.code, -32603);
        return true;
      },
    );
  });

  it('throws error when mode-dark file is missing', async () => {
    await rm(join(testDir, tokenDir, 'appearance-modes.tokens.mode-dark.json'));

    await assert.rejects(
      () => handleTokens('uif://tokens/modes', testDir),
      (err: Error & { code?: number }) => {
        assert.ok(err.message.includes('Token file not found or unreadable'));
        assert.ok(err.message.includes('mode-dark'));
        assert.equal(err.code, -32603);
        return true;
      },
    );
  });

  it('throws error when token directory is missing (brands)', async () => {
    await rm(join(testDir, tokenDir), { recursive: true });

    await assert.rejects(
      () => handleTokens('uif://tokens/brands', testDir),
      (err: Error & { code?: number }) => {
        assert.ok(err.message.includes('Token directory not found or unreadable'));
        assert.equal(err.code, -32603);
        return true;
      },
    );
  });

  it('throws error when no brand files exist', async () => {
    // Remove brand files but keep directory
    await rm(join(testDir, tokenDir, 'themes-brands.tokens.brand-a.json'));
    await rm(join(testDir, tokenDir, 'themes-brands.tokens.brand-b.json'));

    await assert.rejects(
      () => handleTokens('uif://tokens/brands', testDir),
      (err: Error & { code?: number }) => {
        assert.ok(err.message.includes('No brand token files found'));
        assert.equal(err.code, -32603);
        return true;
      },
    );
  });

  it('throws error for unknown token URI', async () => {
    await assert.rejects(
      () => handleTokens('uif://tokens/unknown', testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Unknown token resource URI'));
        return true;
      },
    );
  });
});
