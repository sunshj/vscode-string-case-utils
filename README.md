# vscode-string-case-utils

powered by [change-case](https://github.com/blakeembrey/change-case)

<a href="https://marketplace.visualstudio.com/items?itemName=sunshj.vscode-string-case-utils" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/sunshj.vscode-string-case-utils.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>


## Usage

### Context Menu

1. **Select text** - Highlight the text you want to transform in your editor
2. **Right-click** on the selected text to open the context menu
3. **Choose "String Case Utils"** from the context menu
4. **Select the desired transformation** from the submenu (e.g., camelCase, kebab-case, CONSTANT_CASE, etc.)

### Command Palette

1. **Select text** - Highlight the text you want to transform
2. **Open Command Palette** - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. **Type "String Case Utils"** to filter the available commands
4. **Select the desired transformation** from the list

### Template String Formatting

This extension automatically formats template strings (tagged template literals) when you save files. This feature is particularly useful for formatting embedded code within JavaScript/TypeScript files.

#### How it works:

1. **Enable the feature** - Set `stringCaseUtils.formatTemplateStringsOnSave` to `true` (enabled by default)
2. **Configure tag functions** - The extension recognizes specific tag function names like `markdown`, `html`, `css`, and `json`
3. **Auto-format on save** - When you save a file, template strings with recognized tags are automatically formatted

#### Example:

```typescript
const html = String.raw
// Before formatting
const doc = html`<div><p>Hello World</p></div>`;

// After formatting (on save)
const doc = html`
  <div>
    <p>Hello World</p>
  </div>
`;
```

#### Supported tag functions (configurable):

- `markdown` - Formats Markdown content
- `html` - Formats HTML content  
- `css` - Formats CSS content
- `json` - Formats JSON content

You can customize which tag function names trigger formatting by modifying the `stringCaseUtils.formatTagFunctionNames` setting.

### Additional Features

- **Hash Generation** - Generate MD5 hashes in 16, 32, or 64 character lengths for selected text
- **Random Hash** - Generate random hashes without requiring text selection
- **Data Desensitization** - Replace characters with asterisks (*) or custom characters for privacy


## Configurations

<!-- configs -->

| Key                                           | Description                                 | Type      | Default                            |
| --------------------------------------------- | ------------------------------------------- | --------- | ---------------------------------- |
| `stringCaseUtils.showDesensitizeOption`       | %configuration.showDesensitizeOption%       | `boolean` | `true`                             |
| `stringCaseUtils.desensitizeChar`             | %configuration.desensitizeChar%             | `string`  | `"*"`                              |
| `stringCaseUtils.showHashOptions`             | %configuration.showHashOptions%             | `boolean` | `true`                             |
| `stringCaseUtils.formatTemplateStringsOnSave` | %configuration.formatTemplateStringsOnSave% | `boolean` | `true`                             |
| `stringCaseUtils.formatTagFunctionNames`      | %configuration.formatTagFunctionNames%      | `array`   | `["markdown","html","css","json"]` |

<!-- configs -->

## Commands

<!-- commands -->

| Command                           | Title                                        |
| --------------------------------- | -------------------------------------------- |
| `stringCaseUtils.pascalCase`      | String Case Utils: %command.pascalCase%      |
| `stringCaseUtils.camelCase`       | String Case Utils: %command.camelCase%       |
| `stringCaseUtils.kebabCase`       | String Case Utils: %command.kebabCase%       |
| `stringCaseUtils.snakeCase`       | String Case Utils: %command.snakeCase%       |
| `stringCaseUtils.pascalSnakeCase` | String Case Utils: %command.pascalSnakeCase% |
| `stringCaseUtils.trainCase`       | String Case Utils: %command.trainCase%       |
| `stringCaseUtils.constantCase`    | String Case Utils: %command.constantCase%    |
| `stringCaseUtils.upperCase`       | String Case Utils: %command.upperCase%       |
| `stringCaseUtils.lowerCase`       | String Case Utils: %command.lowerCase%       |
| `stringCaseUtils.capitalCase`     | String Case Utils: %command.capitalCase%     |
| `stringCaseUtils.sentenceCase`    | String Case Utils: %command.sentenceCase%    |
| `stringCaseUtils.dotCase`         | String Case Utils: %command.dotCase%         |
| `stringCaseUtils.pathCase`        | String Case Utils: %command.pathCase%        |
| `stringCaseUtils.noCase`          | String Case Utils: %command.noCase%          |
| `stringCaseUtils.desensitize`     | String Case Utils: %command.desensitize%     |
| `stringCaseUtils.random_hash16`   | String Case Utils: %command.random_hash16%   |
| `stringCaseUtils.random_hash32`   | String Case Utils: %command.random_hash32%   |
| `stringCaseUtils.random_hash64`   | String Case Utils: %command.random_hash64%   |
| `stringCaseUtils.hash16`          | String Case Utils: %command.hash16%          |
| `stringCaseUtils.hash32`          | String Case Utils: %command.hash32%          |
| `stringCaseUtils.hash64`          | String Case Utils: %command.hash64%          |

<!-- commands -->

## License

[MIT](./LICENSE.md) License © 2024 [sunshj](https://github.com/sunshj)
