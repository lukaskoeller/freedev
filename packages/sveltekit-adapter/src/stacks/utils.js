import * as path from 'path'

import { config, DotenvConfigOutput } from 'dotenv'
import { assign, keys, pick } from 'lodash'

/**
 * 
 * @param {string} projectPath 
 * @returns {DotenvConfigOutput}
 */
export function getEnvironment(projectPath) {
  const dotenv = config({ path: path.join(projectPath, '.env') })
  const parsed = assign(
    {},
    dotenv.parsed,
    pick(process.env, keys(dotenv.parsed))
  )
  return { parsed }
}

/**
 * @class NameRegister
 * @property {NameRegister} singleton
 * @property {string[]} _names
 * @property {() => NameRegister} getInstance
 * @property {(name: string) => string} registerName
 * @property {() => string[]} getRegisteredNames
 */
export class NameRegister {
  static singleton;
  _names = [];
  constructor() {};

  /**
   * Get the instance of the NameRegister singleton.
   * @returns {NameRegister} The NameRegister singleton.
   */
  static getInstance() {
    if (!NameRegister.singleton) {
      NameRegister.singleton = new NameRegister()
    }
    return NameRegister.singleton
  }

  /**
   * Register a name and return it if it is unique.
   * @param {string} name - The name to register.
   * @returns {string} The registered name.
   * @throws {Error} If the name is not unique.
   */
  registerName(name) {
    if (this._names.includes(name)) {
      throw Error(`Resource name "${name}" already used`)
    }
    this._names.push(name)
    return name
  }

  /**
   * Get an array of all registered names.
   * @returns {string[]} An array of all registered names.
   */
  getRegisteredNames() {
    return this._names
  }
}
