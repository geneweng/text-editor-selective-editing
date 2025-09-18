# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application for selective text editing with two distinct user modes:

### Super User (Template Creator)
- Create reusable text templates by highlighting editable portions
- Load text from .txt files or type directly
- Highlight text portions by clicking and dragging
- Convert highlighted sections to inline input fields for editing
- Save templates as JSON files for regular users
- Full CRUD operations on editor templates

### Regular User (Template User)
- Load pre-made templates created by super users
- Fill in designated editable fields only
- Cannot modify template structure or create new highlights
- Export completed forms as .txt files
- Simplified, form-filling interface

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Architecture Overview

### Core Components
- **App.js**: Main application component containing all text editing logic
- **App.css**: Styling for the entire application
- **index.js**: React application entry point

### Key Features Implementation
- **User Mode System**: Toggles between 'superuser' and 'regular' modes with different permissions
- **Text Selection**: Uses `window.getSelection()` API to capture user text selections (super users only)
- **Highlighting System**: Maintains array of highlight objects with start/end positions
- **Inline Editing**: Dynamically renders input fields in place of highlighted text
- **Template Management**: Save/load functionality for reusable templates
- **File Operations**: Uses File API and Blob for loading/saving files and templates
- **State Management**: React hooks for managing user mode, text content, highlights, and template data

### Data Structures
- `userMode`: String ('superuser' or 'regular') determining available functionality
- `highlights`: Array of objects with `{id, start, end, text, isEditable}` properties
- `text`: String containing the full document text
- `templateName`: String for template identification
- Non-overlapping highlights are enforced to prevent conflicts
- Templates store highlights with `isEditable: false` and are auto-converted for regular users

## Development Notes

- **User Permissions**: Super users have full template creation/editing capabilities; regular users have restricted form-filling access
- **Text Selection**: Only enabled for super users; regular users cannot create new highlights
- **Template System**: Templates are JSON files containing text, highlights, and metadata
- **Position Tracking**: Text positions are tracked by character offsets from the document start
- **File Restrictions**: .txt files for text content, .json files for templates and editor state
- **Auto-conversion**: Regular users automatically get editable input fields when loading templates
- **Overlap Prevention**: The application prevents overlapping text highlights
- **Input Behavior**: Inline input fields auto-focus (first one only) and save on Enter or blur events