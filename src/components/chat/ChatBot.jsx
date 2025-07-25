import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar,
  Fab, 
  Zoom,
  CircularProgress,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Grow,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  EmojiEmotions as EmojiIcon,
  AutoAwesome as MagicIcon,
  Settings as SettingsIcon,
  DeleteOutline as ClearIcon,
  SmartToy as MowgliIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import chatService from '../../services/chatService';

// Import Mowgli avatar
import mowgliAvatar from '../../assets/images/mowgli_avatar.webp';

// Styled components
const StyledChatWindow = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 20,
  width: 340,
  height: 480,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  zIndex: 1000,
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    height: 'calc(100% - 120px)',
    bottom: 70,
    right: '5%',
    left: '5%',
  }
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const ChatFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  background: theme.palette.background.paper
}));

const FloatingChatButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  left: 20, // Positioned at bottom left as requested
  zIndex: 1000,
}));

const MessageBubble = styled(Box)(({ theme, isuser }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1.5),
  borderRadius: isuser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: isuser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isuser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  wordBreak: 'break-word',
  position: 'relative',
  boxShadow: isuser ? '0 2px 5px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.05)',
}));

const MowgliAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: 'transparent',
  marginRight: theme.spacing(1),
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[1],
}));

const ChatBot = ({ isSidebar = false }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  
  // Initialize chat when opened first time
  useEffect(() => {
    if (open && conversation.length === 0) {
      const welcomeMessage = {
        text: `Hi ${user?.display_name || 'there'}! I'm Mowgli, your friendly tech guide. What would you like to learn about today?`,
        isUser: false,
        timestamp: new Date()
      };
      
      setConversation([welcomeMessage]);
    }
  }, [open, user]);
  
  // If in sidebar mode, open by default
  useEffect(() => {
    if (isSidebar) {
      setOpen(true);
    }
  }, [isSidebar]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setOpen(!open);
    
    // Focus input when opening
    if (!open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = {
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    try {
      // Get response from API
      const response = await chatService.sendMessage({
        message: message,
        age_group: user?.age_group || 'middle_school',
        context: conversation.slice(-4).map(msg => ({ 
          role: msg.isUser ? 'user' : 'assistant', 
          content: msg.text 
        }))
      });
      
      // Add bot response to conversation
      const botMessage = {
        text: response.message || "I'm not sure how to respond to that. Can you try asking me something else?",
        isUser: false,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to conversation
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const clearConversation = () => {
    setConversation([]);
    
    // Add new welcome message
    setTimeout(() => {
      const welcomeMessage = {
        text: `Let's start a new conversation! What would you like to talk about?`,
        isUser: false,
        timestamp: new Date()
      };
      setConversation([welcomeMessage]);
    }, 300);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If sidebar mode, only render the chat window
  if (isSidebar) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <MowgliAvatar 
              src={mowgliAvatar} 
              alt="Mowgli" 
              sx={{ width: 60, height: 60, mr: 1 }}
            />
            <Box>
              <Typography variant="h5" component="div" fontWeight={600}>
                Mowgli
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your Tech Guide
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ask me anything about technology, coding, or how to use this platform!
          </Typography>
          
          <Divider />
        </Box>
        
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}>
          {conversation.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {!msg.isUser && (
                <MowgliAvatar src={mowgliAvatar} alt="Mowgli" />
              )}
              
              <Box sx={{ maxWidth: '75%' }}>
                <MessageBubble isuser={msg.isUser ? 1 : 0}>
                <Box sx={{ 
                  '& p': { m: 0 }, 
                  '& strong': { fontWeight: 'bold' },
                  '& ul, & ol': { pl: 2, mb: 0, mt: 0.5 },
                  '& li': { mb: 0.5 },
                  '& code': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    padding: '2px 4px',
                    borderRadius: 1,
                    fontFamily: 'monospace'
                  },
                  '& a': {
                    color: msg.isUser ? 'inherit' : 'secondary.main',
                    textDecoration: 'underline'
                  }
                }}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </Box>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    textAlign: 'right',
                    mt: 0.5,
                    opacity: 0.7
                  }}>
                    {formatTime(msg.timestamp)}
                  </Typography>
                </MessageBubble>
              </Box>
            </Box>
          ))}
          
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <MowgliAvatar src={mowgliAvatar} alt="Mowgli" />
              <Paper sx={{ 
                px: 2, 
                py: 1, 
                borderRadius: '18px', 
                display: 'inline-flex',
                alignItems: 'center',
                bgcolor: 'grey.100' 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'text.secondary',
                      animation: 'pulse 1s infinite',
                      mr: 0.5,
                      '&:nth-of-type(2)': {
                        animationDelay: '0.2s',
                      },
                      '&:nth-of-type(3)': {
                        animationDelay: '0.4s',
                      },
                      '@keyframes pulse': {
                        '0%': {
                          opacity: 0.4,
                        },
                        '50%': {
                          opacity: 1,
                        },
                        '100%': {
                          opacity: 0.4,
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'text.secondary',
                      animation: 'pulse 1s infinite',
                      animationDelay: '0.2s',
                      mr: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'text.secondary',
                      animation: 'pulse 1s infinite',
                      animationDelay: '0.4s',
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>
        
        <ChatFooter>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type a message..."
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            inputRef={inputRef}
            InputProps={{
              sx: { borderRadius: 4, py: 0.5 }
            }}
          />
          
          <IconButton 
            color="primary" 
            onClick={handleSend} 
            disabled={!message.trim() || isTyping}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
          
          <Tooltip title="Clear conversation">
            <IconButton 
              color="default" 
              onClick={clearConversation}
              sx={{ ml: 0.5 }}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </ChatFooter>
      </Box>
    );
  }

  return (
    <>
      {/* Chat Button */}
      <FloatingChatButton 
        color="secondary"
        onClick={toggleChat}
        aria-label="Chat with Mowgli"
      >
        {!open ? <ChatIcon /> : <CloseIcon />}
      </FloatingChatButton>
      
      {/* Chat Window */}
      <Zoom in={open}>
        <StyledChatWindow>
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MowgliAvatar src={mowgliAvatar} alt="Mowgli" />
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Mowgli
              </Typography>
            </Box>
            
            <Box>
              <Tooltip title="Clear conversation">
                <IconButton size="small" color="inherit" onClick={clearConversation}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
              <IconButton size="small" color="inherit" onClick={toggleChat}>
                <CloseIcon />
              </IconButton>
            </Box>
          </ChatHeader>
          
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'background.default'
          }}>
            {conversation.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                {!msg.isUser && (
                  <MowgliAvatar src={mowgliAvatar} alt="Mowgli" />
                )}
                
                <Box sx={{ maxWidth: '75%' }}>
                  <MessageBubble isuser={msg.isUser ? 1 : 0}>
                    <Typography variant="body1">
                      {msg.text}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      textAlign: 'right',
                      mt: 0.5,
                      opacity: 0.7
                    }}>
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </MessageBubble>
                </Box>
              </Box>
            ))}
            
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <MowgliAvatar src={mowgliAvatar} alt="Mowgli" />
                <Paper sx={{ 
                  px: 2, 
                  py: 1, 
                  borderRadius: '18px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: 'grey.100' 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        animation: 'pulse 1s infinite',
                        mr: 0.5,
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        animation: 'pulse 1s infinite',
                        animationDelay: '0.2s',
                        mr: 0.5,
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        animation: 'pulse 1s infinite',
                        animationDelay: '0.4s',
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
          
          <ChatFooter>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type a message..."
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              inputRef={inputRef}
              InputProps={{
                sx: { borderRadius: 4, py: 0.5 }
              }}
            />
            
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              disabled={!message.trim() || isTyping}
              sx={{ ml: 1 }}
            >
              <SendIcon />
            </IconButton>
          </ChatFooter>
        </StyledChatWindow>
      </Zoom>
    </>
  );
};

export default ChatBot;