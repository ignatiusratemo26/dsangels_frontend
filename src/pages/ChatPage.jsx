// import React from 'react';
// import { Container, Box, Paper, Typography } from '@mui/material';
// import ChatBot from '../components/chat/ChatBot';
// import { SmartToy as MowgliIcon } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import mowgliIllustration from '../assets/images/mowgli_avatar.webp';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//   height: '100%'
// }));


// const ChatPage = () => {
//   return (
//     <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 130px)' }}>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100%'
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//           <MowgliIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
//           <Typography variant="h4" component="h1" fontWeight={600}>
//             Chat with Mowgli
//           </Typography>
//         </Box>
        
//         <Box sx={{ 
//           display: 'grid', 
//           gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, 
//           gap: 3,
//           height: '100%',
//           flexGrow: 1
//         }}>
//           <StyledPaper>
//             <Box sx={{ 
//               display: 'flex', 
//               flexDirection: 'column', 
//               alignItems: 'center', 
//               mb: 3,
//               textAlign: 'center'
//             }}>
//               <Box 
//                 component="img" 
//                 src={mowgliIllustration} 
//                 alt="Mowgli Illustration"
//                 sx={{ 
//                   width: '70%', 
//                   maxWidth: 200,
//                   mb: 2,
//                   filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
//                 }}
//               />
//               <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
//                 Meet Mowgli
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Your friendly AI guide to help you learn about technology and coding.
//               </Typography>
//             </Box>
            
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               What can Mowgli help with?
//             </Typography>
            
//             <Box component="ul" sx={{ pl: 3 }}>
//               <Typography component="li" variant="body2" sx={{ mb: 1 }}>
//                 Explain coding concepts in a friendly way
//               </Typography>
//               <Typography component="li" variant="body2" sx={{ mb: 1 }}>
//                 Help with challenges and exercises
//               </Typography>
//               <Typography component="li" variant="body2" sx={{ mb: 1 }}>
//                 Answer questions about tech topics
//               </Typography>
//               <Typography component="li" variant="body2" sx={{ mb: 1 }}>
//                 Suggest learning resources
//               </Typography>
//               <Typography component="li" variant="body2">
//                 Guide you through the platform
//               </Typography>
//             </Box>
//           </StyledPaper>
          
//           <StyledPaper sx={{ pb: 0 }}>
//             <ChatBot isSidebar={true} />
//           </StyledPaper>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default ChatPage;

import React from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';
import { SmartToy as MowgliIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import mowgliIllustration from '../assets/images/mowgli_avatar.webp';
import ChatBot from '../components/chat/ChatBot';

// Styled Paper with fixed height and scrollable content
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

// ChatBot container that ensures fixed header/footer with scrollable content
const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const ChatPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 130px)' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <MowgliIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight={600}>
            Chat with Mowgli
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, 
          gap: 3,
          height: '100%',
          flexGrow: 1,
          overflow: 'hidden' // Prevent overall page scroll
        }}>
          {/* Info panel - make this scrollable if content overflows */}
          <StyledPaper>
            <Box 
              sx={{ 
                overflowY: 'auto',
                height: '100%'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 3,
                textAlign: 'center'
              }}>
                <Box 
                  component="img" 
                  src={mowgliIllustration} 
                  alt="Mowgli Illustration"
                  sx={{ 
                    width: '70%', 
                    maxWidth: 200,
                    mb: 2,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}
                />
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  Meet Mowgli
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your friendly AI guide to help you learn about technology and coding.
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                What can Mowgli help with?
              </Typography>
              
              <Box component="ul" sx={{ pl: 3 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Explain coding concepts in a friendly way
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Help with challenges and exercises
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Answer questions about tech topics
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Suggest learning resources
                </Typography>
                <Typography component="li" variant="body2">
                  Guide you through the platform
                </Typography>
              </Box>
            </Box>
          </StyledPaper>
          
          {/* Chat panel with fixed layout */}
          <StyledPaper sx={{ p: 0, overflow: 'hidden' }}>
            <ChatContainer>
              <ChatBot isSidebar={true} />
            </ChatContainer>
          </StyledPaper>
        </Box>
      </Box>
    </Container>
  );
};

export default ChatPage;