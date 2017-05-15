# stylelint-selector-custom-tag-pattern

[stylelint](https://github.com/stylelint/stylelint) plagin to specify a pattern for custom tag selectors

```bash
yarn add -D stylelint-selector-custom-tag-pattern
```

**.stylelintrc**
```json
{
  "plugins": [
    "stylelint-selector-custom-tag-pattern"
  ],
  "rules": {
    "plugin/selector-custom-tag-pattern": "^app-prefix-.+$"
  }
}
```
