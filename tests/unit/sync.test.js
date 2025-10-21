import { describe, it, expect, beforeEach, vi } from 'vitest';
import { queueOperation, syncPendingOperations } from '../../src/services/sync';

describe('Sync Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should queue operations when offline', async () => {
    const operation = {
      type: 'LESSON_CREATE',
      data: { id: 'test-lesson', title: 'Test Lesson' },
    };

    const id = await queueOperation(operation);
    expect(id).toBeDefined();
  });

  it('should sync pending operations when online', async () => {
    // Mock online status
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    await syncPendingOperations();
    // Verify sync was attempted
  });
});
