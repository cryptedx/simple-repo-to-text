# Simple Repo to Text VSCode Extension

This VSCode extension allows you to quickly convert local workspace files or a GitHub repository's content into a formatted plain text file, making it suitable for usage in other tools or simply to improve readability.

## Features

- **Convert Workspace to PlainText**: Select files from your current workspace and generate a formatted text output.
- **Integrated Workflow**: Use VSCode commands to select and format the files into one cohesive output.
- **Directory Structure**: Includes a visual representation of the directory structure in the final output.

## Installation

### From Source

To install this extension directly from the source code:

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Run `npm run compile` to build the extension.
4. Open the root folder in VSCode and press `F5` to launch the extension in a new VSCode Extension Development Host.

## Usage

### Convert Workspace to PlainText

1. Open a workspace in VSCode.
2. Open the **Command Palette** by pressing `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (Mac).
3. Type **Simple Repo To Text - Convert Workspace to PlainText** and select the command.
4. Choose the files you want to include in the formatted output.
5. The extension will open a new document containing the formatted directory structure and file contents.

## Development

To develop or modify the extension:

- **Prerequisites**: Make sure you have **Node.js** installed.
- **Commands**:
  - `npm install`: Install dependencies.
  - `npm run compile`: Compile TypeScript files to JavaScript.
  - Press `F5` in VSCode to run the Extension Development Host.

## Packaging

To distribute the extension, package it with:

```sh
vsce package
```

If `vsce` is not installed run:

```sh
npm install -g vsce
```

This will generate a `.vsix` file that can be shared or installed in VSCode.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests for new features or bug fixes.

## License

This project is licensed under the MIT License.
