import { describe, expect, test } from 'vitest';
import { User } from './user.entities';

const USERNAME = '0000x0000id';

describe('user', () => {
  test('should create correct User from handle', () => {
    const user = new User({ username: USERNAME }).pk;
    const expected = `USER#${USERNAME}`;
    expect(user).toBe(expected);
  });
});