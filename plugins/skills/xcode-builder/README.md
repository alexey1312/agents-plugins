# xcode-builder

Build and test Swift/Xcode projects using xcodebuild with xcsift TOON output.

## Installation

```bash
/plugin install xcode-builder@aleksei-plugins
brew install ldomaradzki/tap/xcsift
```

## Usage

Auto-invoked when user asks to build or test iOS/macOS apps:

```
"build the app for simulator"
"run tests with coverage"
```

## Features

- Swift Package and Xcode project builds
- Simulator and device destinations
- Test execution with coverage reporting
- TOON format output via xcsift
