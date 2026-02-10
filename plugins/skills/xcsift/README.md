# xcsift

Parse xcodebuild and swift build output to structured TOON format.

## Installation

```bash
/plugin install xcsift@aleksei-plugins
brew install ldomaradzki/tap/xcsift
```

## Usage

Auto-invoked when building Swift packages or Xcode projects:

```
"build the Swift package"
"run xcodebuild for the project"
```

## Features

- Wraps `swift` and `xcodebuild` commands
- Structured output in TOON format
- Passes through all standard arguments
