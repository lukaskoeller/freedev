import { DBKeyPrefix } from "@freedev/constants";
import { Item } from "../base.entities";
import { User } from "../user/user.entities";

export type SkillParams = {
  username: User['username'],
  /**
   * Name of the skill.
   * @example React
   */
  skill: string;
  /**
   * Type of skill.
   * @example Library, Language, Tool
   */
  category: string;
  /**
   * Popularity of the skill.
   * Can be either npm popularity, github stars
   * or a similar measure that is always the same
   * for a given category.
   */
  popularity?: number;
  /**
   * Describes the advancement in knowledge or skill.
   * The higher the number, the more proficient the user
   * in that skill.
   */
  proficiency?: number;
}

export class Skill extends Item {
  username: User['username'];
  skill: string;
  category: string;
  popularity?: number;
  proficiency?: number;

  constructor(params: SkillParams) {
    super();
    this.username = params?.username;
    this.skill = params?.skill;
    this.category = params?.category;
    this.popularity = params?.popularity ?? undefined;
    this.proficiency = params?.proficiency ?? undefined;
  }

  get pk(): string {
    return `${DBKeyPrefix.User}${this.username}`;
  }

  get sk(): string {
    return `${DBKeyPrefix.Skill}${this.category}#${this.skill}${
      this.popularity ? `#${this.popularity}` : ''
    }`;
  }

  toItem() {
    return {
      ...this.keys(),
      skill: this.skill,
      category: this.category,
      popularity: this.popularity,
      proficiency: this.proficiency,
    }
  }
}