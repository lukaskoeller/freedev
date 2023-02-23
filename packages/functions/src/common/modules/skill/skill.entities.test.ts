import { describe, expect, test } from 'vitest';
import { Skill } from './skill.entities';

const username = '001';

const SKILLS = [
  {
    skill: 'react',
    category: 'library',
    proficiency: 3,
  },
  {
    skill: 'googleanalytics',
    category: 'tool',
    proficiency: 1,
  },
  {
    skill: 'svelte',
    category: 'framework',
  },
];

const EXPECTED = [
  {
    pk: 'USER#001',
    sk: 'SKILL#library#react',
    skill: 'react',
    category: 'library',
    popularity: undefined,
    proficiency: 3,
  },
  {
    pk: 'USER#001',
    sk: 'SKILL#tool#googleanalytics',
    skill: 'googleanalytics',
    category: 'tool',
    popularity: undefined,
    proficiency: 1,
  },
  {
    pk: 'USER#001',
    sk: 'SKILL#framework#svelte',
    skill: 'svelte',
    category: 'framework',
    popularity: undefined,
    proficiency: undefined,
  },
]

describe('user', () => {
  test('should create correct User from handle', () => {
    const skills = SKILLS.map(({ skill, category, proficiency }) => new Skill({
      skill,
      category,
      proficiency,
      username,
    }).toItem());
    expect(skills).toStrictEqual(EXPECTED);
  });
});