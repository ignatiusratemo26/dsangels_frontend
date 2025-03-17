import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon,
  FormatSize as FontSizeIcon,
  Code as CodeIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';
import AceEditor from 'react-ace';

// Import ace modes and themes
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-csharp';

// Themes
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';

// Extensions
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

const EditorContainer = styled(Paper)(({ theme, fullScreen }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  ...(fullScreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1300,
    borderRadius: 0,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(6),
  }),
}));

const EditorControls = styled(Box)(({ theme, fullScreen }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...(fullScreen && {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  }),
}));

const CodeEditor = ({
  initialCode = '',
  language = 'python',
  onChange,
  readOnly = false,
  height = '300px',
  fontSize = 14,
  showControls = true,
  autoFocus = false,
  highlightActiveLine = true,
  showPrintMargin = false,
  showGutter = true,
  enableBasicAutocompletion = true,
  enableLiveAutocompletion = true,
  enableSnippets = true,
}) => {
  const [code, setCode] = useState(initialCode);
  const [editorTheme, setEditorTheme] = useState('xcode');
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Available languages and their display names
  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
  ];
  
  // Available themes
  const themes = [
    { value: 'xcode', label: 'Light', icon: <LightModeIcon /> },
    { value: 'monokai', label: 'Dark', icon: <DarkModeIcon /> },
    { value: 'github', label: 'GitHub' },
    { value: 'tomorrow_night', label: 'Tomorrow Night' },
    { value: 'twilight', label: 'Twilight' },
    { value: 'solarized_dark', label: 'Solarized Dark' },
    { value: 'solarized_light', label: 'Solarized Light' },
  ];
  
  // Update parent component with code changes
  useEffect(() => {
    if (onChange && typeof onChange === 'function') {
      onChange(code);
    }
  }, [code, onChange]);
  
  // Initialize with the correct language
  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);
  
  // Handle code changes
  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };
  
  // Handle theme changes
  const toggleTheme = () => {
    setEditorTheme(prevTheme => 
      prevTheme === 'xcode' ? 'monokai' : 'xcode'
    );
  };
  
  // Handle font size changes
  const cycleFontSize = () => {
    setCurrentFontSize(prevSize => {
      const sizes = [12, 14, 16, 18, 20];
      const currentIndex = sizes.indexOf(prevSize);
      const nextIndex = (currentIndex + 1) % sizes.length;
      return sizes[nextIndex];
    });
  };
  
  // Handle language changes
  const handleLanguageChange = (event) => {
    setCurrentLanguage(event.target.value);
  };
  
  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // Prevent body scrolling when fullscreen
    document.body.style.overflow = !isFullScreen ? 'hidden' : 'auto';
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  return (
    <EditorContainer elevation={isFullScreen ? 24 : 0} fullScreen={isFullScreen}>
      {showControls && (
        <EditorControls fullScreen={isFullScreen}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl variant="standard" size="small" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={currentLanguage}
                onChange={handleLanguageChange}
                disabled={readOnly}
                startAdornment={<CodeIcon sx={{ color: 'action.active', mr: 1 }} />}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box>
            <Tooltip title="Toggle Theme">
              <IconButton onClick={toggleTheme} size="small">
                {editorTheme === 'xcode' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Change Font Size">
              <IconButton onClick={cycleFontSize} size="small">
                <FontSizeIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton onClick={toggleFullScreen} size="small">
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </EditorControls>
      )}
      
      <AceEditor
        mode={currentLanguage}
        theme={editorTheme}
        value={code}
        onChange={handleCodeChange}
        name={`code-editor-${Math.random().toString(36).substr(2, 9)}`}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion,
          enableLiveAutocompletion,
          enableSnippets,
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
        }}
        fontSize={currentFontSize}
        showPrintMargin={showPrintMargin}
        showGutter={showGutter}
        highlightActiveLine={highlightActiveLine}
        width="100%"
        height={isFullScreen ? "100%" : height}
        readOnly={readOnly}
        focus={autoFocus}
        style={{ borderRadius: 0 }}
      />
    </EditorContainer>
  );
};

CodeEditor.propTypes = {
  initialCode: PropTypes.string,
  language: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  height: PropTypes.string,
  fontSize: PropTypes.number,
  showControls: PropTypes.bool,
  autoFocus: PropTypes.bool,
  highlightActiveLine: PropTypes.bool,
  showPrintMargin: PropTypes.bool,
  showGutter: PropTypes.bool,
  enableBasicAutocompletion: PropTypes.bool,
  enableLiveAutocompletion: PropTypes.bool,
  enableSnippets: PropTypes.bool,
};

export default CodeEditor;