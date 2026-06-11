import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validatePath, containsPemPrivateKey } from '../../src/security/path-validator.js';

const ROOT = '/project/root';

describe('validatePath', () => {
  describe('path traversal detection', () => {
    it('rejects literal ../ traversal', () => {
      const result = validatePath('../etc/passwd', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects literal ..\\ traversal', () => {
      const result = validatePath('..\\windows\\system32', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects URL-encoded %2e%2e%2f traversal', () => {
      const result = validatePath('%2e%2e%2fetc/passwd', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects URL-encoded %2e%2e%5c traversal (case-insensitive)', () => {
      const result = validatePath('%2E%2E%5Cwindows', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects double-encoded %252e%252e%252f traversal', () => {
      const result = validatePath('%252e%252e%252fetc/passwd', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects double-encoded %252e%252e%255c traversal', () => {
      const result = validatePath('%252e%252e%255cwindows', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects mixed encoding ..%2f', () => {
      const result = validatePath('..%2fsecret', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects mixed encoding ..%5c', () => {
      const result = validatePath('..%5csecret', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('rejects traversal embedded in longer path', () => {
      const result = validatePath('src/../../etc/passwd', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });
  });

  describe('sandbox enforcement', () => {
    it('allows paths within the root directory', () => {
      const result = validatePath('src/util/file.ts', ROOT);
      assert.equal(result.valid, true);
      assert.equal(result.error, undefined);
    });

    it('allows nested subdirectory paths', () => {
      const result = validatePath('dist/tokens/json/core.json', ROOT);
      assert.equal(result.valid, true);
      assert.equal(result.error, undefined);
    });

    it('rejects absolute paths outside root', () => {
      const result = validatePath('/etc/passwd', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: path is outside allowed directory');
    });
  });

  describe('sensitive file blocking', () => {
    it('blocks .env file access', () => {
      const result = validatePath('.env', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .env.local file access', () => {
      const result = validatePath('.env.local', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .env in subdirectory', () => {
      const result = validatePath('config/.env', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .git directory access', () => {
      const result = validatePath('.git/config', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .git directory at any depth', () => {
      const result = validatePath('sub/.git/HEAD', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .pem file access', () => {
      const result = validatePath('certs/server.pem', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .key file access', () => {
      const result = validatePath('ssl/private.key', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .p12 file access', () => {
      const result = validatePath('certs/keystore.p12', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('blocks .pfx file access', () => {
      const result = validatePath('certs/certificate.pfx', ROOT);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });
  });

  describe('error message safety', () => {
    it('never exposes the resolved path in error messages', () => {
      const result = validatePath('../secret', ROOT);
      assert.equal(result.valid, false);
      assert.ok(!result.error!.includes(ROOT));
      assert.ok(!result.error!.includes('/project'));
    });

    it('uses generic messages for traversal errors', () => {
      const result = validatePath('%2e%2e%2f', ROOT);
      assert.equal(result.error, 'Path contains disallowed traversal pattern');
    });

    it('uses generic messages for sensitive file errors', () => {
      const result = validatePath('.env', ROOT);
      assert.equal(result.error, 'Access denied: requested resource is restricted');
    });

    it('uses generic messages for sandbox violations', () => {
      const result = validatePath('/etc/passwd', ROOT);
      assert.equal(result.error, 'Access denied: path is outside allowed directory');
    });
  });

  describe('valid paths', () => {
    it('accepts simple file names', () => {
      const result = validatePath('README.md', ROOT);
      assert.equal(result.valid, true);
    });

    it('accepts nested paths without traversal', () => {
      const result = validatePath('src/components/button.ts', ROOT);
      assert.equal(result.valid, true);
    });

    it('accepts paths with dots in file names', () => {
      const result = validatePath('dist/tokens/core-primitives.tokens.json', ROOT);
      assert.equal(result.valid, true);
    });

    it('accepts paths with hyphens and underscores', () => {
      const result = validatePath('src/my-component/my_file.ts', ROOT);
      assert.equal(result.valid, true);
    });
  });
});

describe('containsPemPrivateKey', () => {
  it('detects RSA private key header', () => {
    const content = '-----BEGIN RSA PRIVATE KEY-----\nMIIEow...';
    assert.equal(containsPemPrivateKey(content), true);
  });

  it('detects EC private key header', () => {
    const content = '-----BEGIN EC PRIVATE KEY-----\nMHQC...';
    assert.equal(containsPemPrivateKey(content), true);
  });

  it('detects generic private key header', () => {
    const content = '-----BEGIN PRIVATE KEY-----\nMIIEv...';
    assert.equal(containsPemPrivateKey(content), true);
  });

  it('detects encrypted private key header', () => {
    const content = '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFH...';
    assert.equal(containsPemPrivateKey(content), true);
  });

  it('detects DSA private key header', () => {
    const content = '-----BEGIN DSA PRIVATE KEY-----\nMIIBu...';
    assert.equal(containsPemPrivateKey(content), true);
  });

  it('returns false for public key content', () => {
    const content = '-----BEGIN PUBLIC KEY-----\nMIIBIj...';
    assert.equal(containsPemPrivateKey(content), false);
  });

  it('returns false for regular text content', () => {
    const content = 'This is just a regular markdown file.';
    assert.equal(containsPemPrivateKey(content), false);
  });

  it('returns false for certificate content', () => {
    const content = '-----BEGIN CERTIFICATE-----\nMIIDXTC...';
    assert.equal(containsPemPrivateKey(content), false);
  });
});
