/* eslint-disable */

import camelcase from "lodash.camelcase";

const _toString = Object.prototype.toString
export function isPlainObject(obj: { [key: string]: any }): boolean {
  return _toString.call(obj) === '[object Object]'
}

export function objectCamelcase(object: object) {
  const stringify = JSON.stringify(object, function (_key: string, value: any) {
    if (value && isPlainObject(value)) {
      const replacement: { [key: string]: any } = {}
      for (const k in value) {
        if (Object.hasOwnProperty.call(value, k)) {
          replacement[camelcase(k)] = value[k]
        }
      }
      return replacement
    }

    return value
  })

  return JSON.parse(stringify)
}
