# Changelog

All notable changes to this project will be documented in this file.

## [0.1.2] - 2024-10-27

### Fixed
- Updated path handling to correctly resolve file paths relative to the root of the workspace instead of the OS root.
- Added error handling for undefined file paths during filtering and reading.
- Improved robustness of directory structure generation and file content output.

## [0.1.1] - 2024-10-21

### Added

- Image and binary files are now displayed in the file selection list but are **not selected by default**. This makes it easier to focus on selecting only text-based files.

## [0.1.0] - 2024-10-20

### Added

- Initial release of **Simple Repo to Text** extension.
- Added functionality to convert the current workspace files into a formatted plain text document.
- Integrated command `Simple Repo To Text - Convert Workspace to PlainText` to allow file selection from the workspace.
- Display formatted directory structure and file contents in the generated output.
