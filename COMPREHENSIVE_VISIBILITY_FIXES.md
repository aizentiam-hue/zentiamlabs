# Comprehensive Text Visibility Fixes - Implementation Plan

## Issues Identified:

### 1. **Gradient Text Classes**
- `.gradient-text` uses dull purple (#667eea → #764ba2)
- Not prominent against dark background
- **Fix**: Use bright white-to-purple gradient

### 2. **Section Headers**
- Many headers use gradient-text class
- Need brighter, more prominent gradients
- **Fix**: Replace with white-to-bright-purple

### 3. **Subheaders**
- Some are invisible or too faded
- **Fix**: Increase font-weight, size, and opacity

### 4. **Trust Indicators**
- opacity: 0.7 making them barely visible
- **Fix**: Remove opacity, make fully bright

### 5. **Font Weights**
- Many headers at 600-700, need to be 700-800
- **Fix**: Increase all header font-weights

## Implementation:
1. Fix futuristic.css gradient classes
2. Update all page headers individually
3. Add text-shadow for extra prominence
4. Increase font-weights globally
5. Remove opacity restrictions on important text
