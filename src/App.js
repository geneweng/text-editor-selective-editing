import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [userMode, setUserMode] = useState('superuser'); // 'superuser' or 'regular'
  const [text, setText] = useState('Welcome to the text editor! Click and drag to select text portions for editing.');
  const [highlights, setHighlights] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isTemplateLocked, setIsTemplateLocked] = useState(false);
  const textRef = useRef(null);
  const fileInputRef = useRef(null);
  const templateInputRef = useRef(null);
  const saveTemplateInputRef = useRef(null);

  const handleTextSelection = () => {
    const containerElement = textRef.current;

    // Handle textarea selection
    if (containerElement.tagName === 'TEXTAREA') {
      const start = containerElement.selectionStart;
      const end = containerElement.selectionEnd;
      const selectedText = text.substring(start, end);

      if (selectedText.trim() === '' || start === end) return;

      const newHighlight = {
        id: Date.now(),
        start: start,
        end: end,
        text: selectedText,
        isEditable: false
      };

      if (!isOverlapping(newHighlight)) {
        setHighlights(prev => [...prev, newHighlight].sort((a, b) => a.start - b.start));
      }

      // Clear selection
      containerElement.setSelectionRange(start, start);
      return;
    }

    // Handle div selection (existing logic)
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (selectedText.trim() === '') return;

    // Calculate absolute position in the full text
    const preRange = document.createRange();
    preRange.selectNodeContents(containerElement);
    preRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preRange.toString().length;
    const endOffset = startOffset + selectedText.length;

    const newHighlight = {
      id: Date.now(),
      start: startOffset,
      end: endOffset,
      text: selectedText,
      isEditable: false
    };

    if (!isOverlapping(newHighlight)) {
      setHighlights(prev => [...prev, newHighlight].sort((a, b) => a.start - b.start));
    }

    selection.removeAllRanges();
  };

  const isOverlapping = (newHighlight) => {
    return highlights.some(highlight =>
      (newHighlight.start < highlight.end && newHighlight.end > highlight.start)
    );
  };

  const makeEditable = (highlightId) => {
    setHighlights(prev =>
      prev.map(h => h.id === highlightId ? { ...h, isEditable: true } : h)
    );
  };

  const convertAllHighlightsToInputs = () => {
    setHighlights(prev =>
      prev.map(h => ({ ...h, isEditable: true }))
    );
    // Lock the template to switch to preview mode with inputs
    setIsTemplateLocked(true);
  };

  const updateEditableText = (highlightId, newText) => {
    const highlight = highlights.find(h => h.id === highlightId);
    if (!highlight) return;

    const beforeText = text.substring(0, highlight.start);
    const afterText = text.substring(highlight.end);
    const newFullText = beforeText + newText + afterText;

    const lengthDiff = newText.length - highlight.text.length;

    setText(newFullText);

    setHighlights(prev =>
      prev.map(h => {
        if (h.id === highlightId) {
          return { ...h, text: newText, end: h.start + newText.length, isEditable: false };
        } else if (h.start >= highlight.end) {
          return { ...h, start: h.start + lengthDiff, end: h.end + lengthDiff };
        }
        return h;
      })
    );
  };

  const removeHighlight = (highlightId) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
  };

  const renderTextWithHighlights = () => {
    if (highlights.length === 0) {
      return <span>{text}</span>;
    }

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      if (highlight.start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      if (highlight.isEditable) {
        elements.push(
          <input
            key={`input-${highlight.id}`}
            type="text"
            defaultValue={highlight.text}
            className="inline-input"
            onBlur={(e) => updateEditableText(highlight.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateEditableText(highlight.id, e.target.value);
              }
            }}
            autoFocus={index === 0}
          />
        );
      } else {
        elements.push(
          <span
            key={`highlight-${highlight.id}`}
            className="highlight"
            onClick={() => makeEditable(highlight.id)}
          >
            {highlight.text}
          </span>
        );
      }

      lastIndex = highlight.end;
    });

    if (lastIndex < text.length) {
      elements.push(
        <span key="text-end">{text.substring(lastIndex)}</span>
      );
    }

    return elements;
  };

  const renderHighlightOverlay = () => {
    if (highlights.length === 0) {
      return <span className="overlay-text">{text}</span>;
    }

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Add text before this highlight
      if (highlight.start > lastIndex) {
        elements.push(
          <span key={`overlay-text-${index}`} className="overlay-text">
            {text.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add the highlighted text
      elements.push(
        <span
          key={`overlay-highlight-${highlight.id}`}
          className="overlay-highlight"
        >
          {text.substring(highlight.start, highlight.end)}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text after last highlight
    if (lastIndex < text.length) {
      elements.push(
        <span key="overlay-text-end" className="overlay-text">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  const loadFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
        setHighlights([]);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a .txt file');
    }
    event.target.value = '';
  };


  const exportText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const defaultFilename = userMode === 'regular' ? 'completed-form.txt' : 'edited-text.txt';

    // Use the File System Access API if available, otherwise fall back to download
    if ('showSaveFilePicker' in window) {
      exportTextWithFilePicker(blob, defaultFilename);
    } else {
      // Fallback: automatic download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultFilename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const exportTextWithFilePicker = async (blob, defaultFilename) => {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: defaultFilename,
        types: [{
          description: 'Text files',
          accept: { 'text/plain': ['.txt'] }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error saving file:', err);
        alert('Error saving text file');
      }
      // If user cancels, no action needed
    }
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const template = {
      name: templateName,
      description: templateDescription,
      text,
      highlights: highlights.map(h => ({ ...h, isEditable: false })), // Reset editable state
      createdAt: new Date().toISOString()
    };

    // Create a blob with the template data
    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: 'application/json'
    });

    // Use the File System Access API if available, otherwise fall back to download
    if ('showSaveFilePicker' in window) {
      saveTemplateWithFilePicker(blob);
    } else {
      // Fallback: automatic download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${templateName.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // Lock the template after saving
      setIsTemplateLocked(true);
    }
  };

  const saveTemplateWithFilePicker = async (blob) => {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `template-${templateName.replace(/\s+/g, '-').toLowerCase()}.json`,
        types: [{
          description: 'Template files',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();

      // Lock the template after saving
      setIsTemplateLocked(true);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error saving file:', err);
        alert('Error saving template file');
      }
      // If user cancels, don't lock the template
    }
  };

  const editTemplate = () => {
    setIsTemplateLocked(false);
  };

  const loadTemplate = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target.result);
          if (template.name && template.text && Array.isArray(template.highlights)) {
            setText(template.text);
            setTemplateName(template.name);
            setTemplateDescription(template.description || '');
            // For regular users, immediately convert highlights to inputs
            if (userMode === 'regular') {
              setHighlights(template.highlights.map(h => ({ ...h, isEditable: true })));
            } else {
              setHighlights(template.highlights);
              setIsTemplateLocked(true); // Lock template when loaded
            }
          } else {
            alert('Invalid template file format');
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a .json template file');
    }
    event.target.value = '';
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-top">
          <h1>Text Editor with Selective Editing</h1>
          <div className="user-mode-switcher">
            <label>User Mode: </label>
            <select
              value={userMode}
              onChange={(e) => setUserMode(e.target.value)}
              className="mode-select"
            >
              <option value="superuser">Super User (Template Creator)</option>
              <option value="regular">Regular User (Template User)</option>
            </select>
          </div>
        </div>

      </header>

      <main className="main">
        <div className="left-panel">
          {userMode === 'superuser' ? (
            <div className="controls-panel">
              <div className="template-inputs">
                <input
                  type="text"
                  placeholder="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="template-name-input"
                  disabled={isTemplateLocked}
                />
                <textarea
                  placeholder="Template Description (optional)"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="template-description-input"
                  disabled={isTemplateLocked}
                  rows={2}
                />
              </div>
              <div className="controls-text">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTemplateLocked}
                >
                  Load Text File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={loadFile}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={convertAllHighlightsToInputs}
                  disabled={highlights.length === 0 || isTemplateLocked}
                  className="convert-button"
                >
                  Convert Highlights to Inputs
                </button>
                {!isTemplateLocked ? (
                  <button
                    onClick={saveTemplate}
                    disabled={!templateName.trim()}
                    className="save-template-button"
                  >
                    Save Template
                  </button>
                ) : (
                  <button
                    onClick={editTemplate}
                    className="edit-template-button"
                  >
                    Edit Template
                  </button>
                )}
                <button onClick={() => templateInputRef.current?.click()}>
                  Load Template
                </button>
                <input
                  ref={templateInputRef}
                  type="file"
                  accept=".json"
                  onChange={loadTemplate}
                  style={{ display: 'none' }}
                />
                <button onClick={exportText}>Export Text</button>
              </div>
              {templateName && (
                <div className="template-status">
                  <div>Template: {templateName} {isTemplateLocked ? '(Locked - Use Mode)' : '(Unlocked - Edit Mode)'}</div>
                  {templateDescription && (
                    <div className="template-status-description">{templateDescription}</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="controls-panel">
              <div className="controls-text">
                <button onClick={() => templateInputRef.current?.click()}>
                  Load Template
                </button>
                <input
                  ref={templateInputRef}
                  type="file"
                  accept=".json"
                  onChange={loadTemplate}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={exportText}
                  disabled={!templateName}
                  className="export-button"
                >
                  Save Completed Form
                </button>
              </div>
              {templateName && (
                <span className="template-info">Template: {templateName}</span>
              )}
            </div>
          )}

          {userMode === 'superuser' && highlights.length > 0 && (
            <div className="highlights-section">
              <h3>Highlighted Segments</h3>
              {highlights.map(highlight => (
                <div key={highlight.id} className="highlight-item">
                  <span>"{highlight.text}"</span>
                  <div>
                    <button
                      onClick={() => makeEditable(highlight.id)}
                      disabled={isTemplateLocked}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeHighlight(highlight.id)}
                      disabled={isTemplateLocked}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userMode === 'regular' && templateName && (
            <div className="highlights-section">
              <h3>Template: {templateName}</h3>
              {templateDescription && (
                <div className="template-description-display">
                  <strong>Description:</strong>
                  <p>{templateDescription}</p>
                </div>
              )}
              <h4>Form Fields</h4>
              <p>Fill in the editable fields above and click "Save Completed Form" when done.</p>
              {highlights.length === 0 && (
                <p className="no-template">Load a template to begin editing.</p>
              )}
            </div>
          )}

          <div className="help-section">
            <h3>Help:</h3>
            {userMode === 'superuser' ? (
              <ul>
                <li>Enter a template name in the input field</li>
                <li>Load text file or type content directly</li>
                <li>Click and drag to select text portions that should be editable</li>
                <li>Click "Convert Highlights to Inputs" to preview the template</li>
                <li>Click "Save Template" to create a reusable template</li>
                <li>Templates can be loaded by regular users to fill out forms</li>
              </ul>
            ) : (
              <ul>
                <li>Click "Load Template" to select a template file</li>
                <li>Fill in the editable input fields in the template</li>
                <li>Click "Save Completed Form" to download your completed form</li>
                <li>Only the designated fields can be edited - the rest is protected</li>
              </ul>
            )}
          </div>
        </div>

        <div className={`editor-container ${userMode === 'superuser' && !isTemplateLocked ? 'edit-mode' : 'use-mode'}`}>
          {userMode === 'superuser' && !isTemplateLocked ? (
            <div className="editor-wrapper">
              <textarea
                className="text-editor editable"
                ref={textRef}
                value={text}
                onChange={(e) => {
                  const newText = e.target.value;
                  const lengthDiff = newText.length - text.length;

                  // Update text
                  setText(newText);

                  // Adjust highlight positions if text was added/removed
                  if (lengthDiff !== 0) {
                    const cursorPos = e.target.selectionStart;
                    setHighlights(prev => prev.map(h => {
                      if (h.start >= cursorPos) {
                        return { ...h, start: h.start + lengthDiff, end: h.end + lengthDiff };
                      } else if (h.end <= cursorPos) {
                        return h; // No change needed
                      } else {
                        // Highlight spans the cursor position - remove it
                        return null;
                      }
                    }).filter(Boolean));
                  }
                }}
                onMouseUp={handleTextSelection}
                placeholder="Type your text here or load a text file..."
              />
              <div className="highlight-overlay" style={{ pointerEvents: 'none' }}>
                {renderHighlightOverlay()}
              </div>
            </div>
          ) : (
            <div
              className={`text-editor ${userMode === 'regular' || isTemplateLocked ? 'readonly-template' : ''}`}
              ref={textRef}
            >
              {renderTextWithHighlights()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;