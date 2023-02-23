import { describe, expect, test } from 'vitest';
import { User } from './user.entities';

const USERNAME = '001';
const EXPECTED = {
  pk: 'USER#001',
  sk: 'USER#001',
  about: undefined,
  capacity: undefined,
  email: undefined,
  firstName: undefined,
  handle: '001',
  happiness: undefined,
  hourlyRate: undefined,
  lastName: undefined,
  projectsCount: undefined,
}

describe('user', () => {
  test('should create correct User from handle', () => {
    const user = new User({ username: USERNAME }).toItem();
    expect(user).toStrictEqual(EXPECTED);
  });
});