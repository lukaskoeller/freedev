import { DBKeyPrefix } from "../../constants";
import { Item } from "../base.entities";

export enum CapacityUnit {
  DaysPerWeek = 'days/week',
  DaysPerMonth = 'days/month',
  HoursPerWeek = 'hours/week',
  HoursPerDay = 'hours/day'
}

export type UserCapacity = {
  amount: number;
  unit: CapacityUnit;
}

export type UserParams = {
  /**
   * Automatically created by Cognito.
   * Is a partition key (`hashKey`).
   */
  username: string;
  /**
   * User handle. Can be changed by the user.
   */
  handle?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  /**
   * Amount of money per hour
   * requested by the user for a client.
   */
  hourlyRate?: number;
  capacity?: UserCapacity;
  /**
   * Number of projects done by the user.
   */
  projectsCount?: number;
  /**
   * Number between 0 and 5.
   * Represents the average rating of the user
   * among all ratings for that user
   */
  happiness?: number;
  about?: string;
}

/**
 * User (freelancer)
 */
export class User extends Item {
  username: string;
  handle: string;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  hourlyRate: number | undefined;
  capacity: UserCapacity | undefined;
  projectsCount: number | undefined;
  happiness: number | undefined;
  about: string | undefined;

  constructor(params: UserParams) {
    super();
    this.username = params.username;
    this.handle = params.handle ?? params.username;
    this.firstName = params?.firstName;
    this.lastName = params?.lastName;
    this.email = params?.email;
    this.hourlyRate = params?.hourlyRate;
    this.capacity = params?.capacity;
    this.projectsCount = params?.projectsCount;
    this.happiness = params?.happiness;
    this.about = params?.about;
  }

  get pk(): string {
    return `${DBKeyPrefix.User}${this.username}`;
  }

  get sk(): string {
      return `${DBKeyPrefix.User}${this.username}`;
  }
}