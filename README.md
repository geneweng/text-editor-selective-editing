# Text Editor with Selective Editing

A React-based text editor that enables selective text highlighting and template creation for fillable forms. Features dual user modes for template creators and end users.

![IDE-style Interface](https://img.shields.io/badge/Interface-IDE--style-blue)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 **Dual User Modes**
- **Super User Mode**: Create templates with selectable text portions
- **Regular User Mode**: Fill out pre-created templates with editable fields

### 🖊️ **Advanced Text Editing**
- Direct text editing with full textarea functionality
- Visual highlight overlay showing selected segments
- Smart text selection for creating editable regions
- Real-time highlight positioning and collision detection

### 🎨 **Modern IDE-Style Interface**
- Dark theme with VS Code-inspired color scheme
- Left panel with organized controls and help section
- Mode-specific background colors (green for edit, blue for use)
- Responsive layout with professional typography

### 📁 **File Operations**
- Load text files (.txt) for template creation
- Save templates as JSON files for reuse
- Export completed forms as text files
- Modern File System Access API with fallback support

### 🔧 **Template System**
- Create reusable templates with highlighted editable sections
- Template descriptions and metadata
- Lock/unlock functionality for editing vs. preview modes
- Automatic conversion of highlights to input fields

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/geneweng/text-editor-selective-editing.git
   cd text-editor-selective-editing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

### Creating Templates (Super User Mode)

1. **Switch to Super User Mode** using the dropdown in the header
2. **Enter a template name** in the input field
3. **Load a text file** or type content directly in the editor
4. **Select text portions** by clicking and dragging to highlight editable sections
5. **Click "Convert Highlights to Inputs"** to preview the template
6. **Save the template** as a JSON file for reuse

### Using Templates (Regular User Mode)

1. **Switch to Regular User Mode** using the dropdown
2. **Load a template** by clicking "Load Template" and selecting a JSON file
3. **Fill in the editable fields** shown as input boxes
4. **Save the completed form** by clicking "Save Completed Form"

## 🏗️ Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # IDE-style theming and layout
├── index.js        # React entry point
└── index.css       # Global styles and fonts

public/
└── index.html      # HTML template

CLAUDE.md           # Development documentation
package.json        # Project dependencies
```

## 🎨 Design Features

### Color Scheme
- **Edit Mode**: Subtle green tint (`#1a1e1a`) indicating active editing
- **Use Mode**: Subtle blue tint (`#1a1a2e`) for form completion
- **Highlights**: Semi-transparent yellow (`rgba(255, 204, 2, 0.3)`)

### Typography
- **Editor**: JetBrains Mono for code-like text editing
- **UI**: Inter font family for modern interface elements

### Layout
- **Left Panel**: 320px width with controls, highlights, and help
- **Main Editor**: Flexible text editing area with overlay highlights
- **Responsive**: Adapts to different screen sizes

## 🔧 Technical Implementation

### Key Technologies
- **React 18** with functional components and hooks
- **Modern JavaScript** (ES6+) with async/await
- **File System Access API** for native file operations
- **CSS Grid/Flexbox** for responsive layout

### Core Features
- **Text Selection API** for precise highlight positioning
- **Position Tracking** with character offset calculations
- **Template Serialization** using JSON format
- **Smart Highlight Management** with overlap detection

### Browser Compatibility
- **Modern browsers** with File System Access API support
- **Fallback support** for automatic downloads
- **Progressive enhancement** for better user experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Notes

This project was developed with Claude Code assistance and follows modern React patterns:

- **Functional components** with hooks for state management
- **Clean separation** between editing and preview modes
- **Professional UI/UX** with IDE-style conventions
- **Comprehensive error handling** for file operations

For detailed development information, see [CLAUDE.md](CLAUDE.md).

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with assistance from [Claude Code](https://claude.ai/code)
- Inspired by modern code editors and form builders
- Uses Google Fonts (JetBrains Mono, Inter)

---

**Made with ❤️ using React and Claude Code**