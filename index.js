'use strict'

// base on:
//  https://github.com/stylelint/stylelint/blob/master/lib/rules/selector-id-pattern/index.js
//  https://github.com/stylelint/stylelint/blob/master/lib/rules/selector-type-no-unknown/index.js

const {
  isString,
  isRegExp } = require('lodash')

const stylelint = require('stylelint')

const svgTags = require('svg-tags')
const htmlTags = require('html-tags')
const mathMLTags = require('mathml-tag-names')

const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const parseSelector = require('stylelint/lib/utils/parseSelector')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const isKeyframeSelector = require('stylelint/lib/utils/isKeyframeSelector')
const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule')
const isStandardSyntaxSelector = require('stylelint/lib/utils/isStandardSyntaxSelector')
const isStandardSyntaxTypeSelector = require('stylelint/lib/utils/isStandardSyntaxTypeSelector')

const ruleName = 'plugin/selector-custom-tag-pattern'

const messages = ruleMessages(ruleName, {
  rejected: selectorValue => `Expected custom tag selector '${selectorValue}' to match specified pattern`
})

const rule = stylelint.createPlugin(ruleName, pattern => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ]
    })

    if (!validOptions)
      return

    const normalizedPattern = isString(pattern)
      ? new RegExp(pattern)
      : pattern

    root.walkRules(rule => {
      const selector = rule.selector
      const selectors = rule.selectors

      if (!isStandardSyntaxRule(rule))
        return
      if (!isStandardSyntaxSelector(selector))
        return
      if (selectors.some(s => isKeyframeSelector(s)))
        return

      parseSelector(selector, result, rule, fullSelector => {
        fullSelector.walkTags(tagNode => {
          if (!isStandardSyntaxTypeSelector(tagNode))
            return

          const tagName = tagNode.value
          const tagNameLowerCase = tagName.toLowerCase()

          if (false
            || htmlTags.indexOf(tagNameLowerCase) !== -1
            || svgTags.indexOf(tagNameLowerCase) !== -1
            || mathMLTags.indexOf(tagNameLowerCase) !== -1
          ) {
            return
          }

          if (normalizedPattern.test(tagNameLowerCase))
            return

          report({
            result,
            ruleName,
            message: messages.rejected(tagNameLowerCase),
            node: rule,
            index: tagNode.sourceIndex
          })
        })
      })
    })
  }
})

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
