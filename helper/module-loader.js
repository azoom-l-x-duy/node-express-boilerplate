// TODO: use @azoom/node-util -> loader

// Refer to https://github.com/ilearnio/module-alias/issues/59#issuecomment-500480450
// Usage:
//    node --loaoder ./node_modules/@azoom/util/dist/module-alias/loader.js index.js
import path from 'path'
import fs from 'fs'

const getAliases = () => {
  const base = process.cwd()

  const { _moduleAliases } = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const aliases = _moduleAliases || {}

  const absoluteAliases = Object.keys(aliases).reduce(
    (acc, key) =>
      aliases[key][0] === '/'
        ? acc
        : { ...acc, [key]: path.join(base, aliases[key]) },
    aliases
  )

  return absoluteAliases
}

const isAliasInSpecifier = (aPath, alias) =>
  aPath.indexOf(alias) === 0 &&
  (aPath.length === alias.length || aPath[alias.length] === '/')

const aliases = getAliases()

export const resolve = (specifier, parentModuleURL, defaultResolve) => {
  const alias = Object.keys(aliases).find((key) =>
    isAliasInSpecifier(specifier, key)
  )
  const newSpecifier =
    alias === undefined
      ? specifier
      : path.join(aliases[alias], specifier.substr(alias.length))

  return defaultResolve(newSpecifier, parentModuleURL)
}
