import { apiGet, apiPost } from '../api-client';

/**
 * Mock tests for api-client
 * Note: These are meant to be run with a test runner like Vitest or Jest.
 */
describe('api-client', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('apiGet should handle successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'success' }),
    });

    const result = await apiGet('/test');
    expect(result).toEqual({ data: 'success' });
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.any(Object));
  });

  test('apiPost should send data correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    const result = await apiPost('/test', { foo: 'bar' });
    expect(result).toEqual({ id: 1 });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ foo: 'bar' }),
      })
    );
  });

  test('should throw error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Unauthorized' }),
    });

    await expect(apiGet('/secure')).rejects.toThrow('Unauthorized');
  });
});
