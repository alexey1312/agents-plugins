---
name: simulator-manager
description: Manage iOS simulators - list, create, boot, and configure simulators for testing
---

# Simulator Manager

Manage iOS simulators for development and testing.

## Quick Start

```bash
# List available simulators
xcrun simctl list devices

# Boot a simulator
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator app
open -a Simulator
```

## Commands

### List Devices
```bash
# All devices
xcrun simctl list devices

# Available only
xcrun simctl list devices available

# JSON output
xcrun simctl list devices -j
```

### Boot/Shutdown
```bash
# Boot by name
xcrun simctl boot "iPhone 15 Pro"

# Boot by UDID
xcrun simctl boot <UDID>

# Shutdown
xcrun simctl shutdown "iPhone 15 Pro"

# Shutdown all
xcrun simctl shutdown all
```

### Create Simulator
```bash
# List available runtimes
xcrun simctl list runtimes

# List device types
xcrun simctl list devicetypes

# Create new simulator
xcrun simctl create "My Test iPhone" "iPhone 15 Pro" "iOS-17-2"
```

### Delete Simulator
```bash
# Delete by name
xcrun simctl delete "My Test iPhone"

# Delete unavailable
xcrun simctl delete unavailable
```

### Install/Launch Apps
```bash
# Install app
xcrun simctl install booted /path/to/App.app

# Launch app
xcrun simctl launch booted com.example.app

# Terminate app
xcrun simctl terminate booted com.example.app

# Uninstall app
xcrun simctl uninstall booted com.example.app
```

### Screenshots & Recording
```bash
# Screenshot
xcrun simctl io booted screenshot screenshot.png

# Screen recording
xcrun simctl io booted recordVideo video.mp4
# Press Ctrl+C to stop
```

### Data Management
```bash
# Open data folder
xcrun simctl get_app_container booted com.example.app data

# Erase all content
xcrun simctl erase "iPhone 15 Pro"

# Erase all simulators
xcrun simctl erase all
```

### Status Bar Override
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

### Fresh Test Environment
```bash
# Create fresh simulator
xcrun simctl create "Test iPhone" "iPhone 15 Pro" "iOS-17-2"
xcrun simctl boot "Test iPhone"
# Run tests
# Clean up
xcrun simctl delete "Test iPhone"
```

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

### Screenshot for App Store
```bash
# Override status bar
xcrun simctl status_bar booted override --time "9:41" --batteryLevel 100

# Take screenshot
xcrun simctl io booted screenshot AppStore_iPhone15.png

# Clear status bar
xcrun simctl status_bar booted clear
```

## Integration with xcode-builder

Use with xcode-builder skill:
```bash
# Build for simulator
xcodebuild build -destination "platform=iOS Simulator,id=$(xcrun simctl list devices booted -j | jq -r '.devices[][] | select(.state=="Booted") | .udid' | head -1)"
```

## Tips

1. Use `booted` keyword for currently booted simulator
2. Use `-j` flag for JSON output (good for scripts)
3. Erase simulators periodically to free disk space
4. Use status bar override for consistent screenshots
5. Create custom simulators for specific test scenarios
