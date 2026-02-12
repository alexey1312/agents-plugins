---
name: simulator-manager
description: >
  Manages iOS simulators via xcrun simctl — lists, creates, boots, and configures devices.
  Use when working with iOS Simulator, preparing test environments, taking app screenshots,
  or setting up simulator destinations.
---

# Simulator Manager

Manage iOS simulators for development and testing.

## Quick Start

```bash
# List available simulators
xcrun simctl list devices available

# Boot a simulator
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator app
open -a Simulator
```

## Screenshots & Recording

```bash
# Screenshot
xcrun simctl io booted screenshot screenshot.png

# Screen recording (Ctrl+C to stop)
xcrun simctl io booted recordVideo video.mp4
```

## Data Management

```bash
# Open app data folder
xcrun simctl get_app_container booted com.example.app data

# Erase all content
xcrun simctl erase "iPhone 15 Pro"
```

## Status Bar Override

```bash
# Set time
xcrun simctl status_bar booted override --time "9:41"

# Set battery
xcrun simctl status_bar booted override --batteryLevel 100 --batteryState charged

# Set network
xcrun simctl status_bar booted override --cellularMode active --cellularBars 4

# Clear overrides
xcrun simctl status_bar booted clear
```

## Common Workflows

### Multiple Simulators for Testing

```bash
# Boot multiple devices
xcrun simctl boot "iPhone 15 Pro"
xcrun simctl boot "iPhone SE (3rd generation)"
xcrun simctl boot "iPad Pro (12.9-inch)"

# Run tests on all
xcodebuild test -destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
                -destination 'platform=iOS Simulator,name=iPhone SE (3rd generation)'
```

### App Store Screenshots

```bash
# Override status bar for clean screenshots
xcrun simctl status_bar booted override --time "9:41" --batteryLevel 100

# Take screenshot
xcrun simctl io booted screenshot AppStore_iPhone15.png

# Clear status bar
xcrun simctl status_bar booted clear
```

## Integration with xcode-builder

```bash
# Build for simulator
xcodebuild build -destination "platform=iOS Simulator,id=$(xcrun simctl list devices booted -j | jq -r '.devices[][] | select(.state=="Booted") | .udid' | head -1)"
```

## Tips

1. Erase simulators periodically to free disk space
2. Use status bar override for consistent screenshots
3. Create custom simulators for specific test scenarios
