import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Stack,
  Pagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  NavigateNext as NavigateNextIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  Report as ReportIcon,
  Flag as FlagIcon,
  Lock as LockIcon,
  PushPin as PinIcon
} from '@mui/icons-material';

// Services
import { communityService } from '../services/communityService';
import { useAuth } from '../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
}));

const PostCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[4],
  }
}));



const TopicHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3, 4),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
  position: 'relative',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: theme.palette.secondary.main,
}));

const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State variables
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);
  const [postError, setPostError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editingTopic, setEditingTopic] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicDescription, setEditTopicDescription] = useState('');
  
  const pageSize = 10;
  
  // Fetch topic and posts
  useEffect(() => {
    const fetchTopicAndPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch topic details
        const topicData = await communityService.getTopicById(topicId);
        setTopic(topicData);
        setEditTopicTitle(topicData.title);
        setEditTopicDescription(topicData.description);
        
        // Fetch posts for this topic
        const postsData = await communityService.getPostsByTopic(topicId, { 
          page, 
          page_size: pageSize 
        });
        setPosts(postsData.results);
        setTotalPages(Math.ceil(postsData.count / pageSize));
      } catch (err) {
        console.error('Error fetching topic:', err);
        setError('Failed to load the topic. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopicAndPosts();
  }, [topicId, page]);
  
  // Handle new post submission
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) {
      setPostError('Post content cannot be empty');
      return;
    }
    
    setIsPostSubmitting(true);
    setPostError('');
    
    try {
      const newPost = await communityService.createPost(topicId, { content: newPostContent });
      
      // Add the new post to the posts list
      setPosts([...posts, newPost]);
      
      // Clear the form
      setNewPostContent('');
      
      // If topic has the post count, update it
      if (topic && topic.post_count !== undefined) {
        setTopic({
          ...topic,
          post_count: topic.post_count + 1
        });
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setPostError('Failed to submit your post. Please try again.');
    } finally {
      setIsPostSubmitting(false);
    }
  };
  
  // Handle post deletion
  const openDeleteDialog = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };
  
  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      await communityService.deletePost(postToDelete);
      
      // Remove the post from the list
      setPosts(posts.filter(post => post.id !== postToDelete));
      
      // Update topic post count
      if (topic && topic.post_count !== undefined) {
        setTopic({
          ...topic,
          post_count: topic.post_count - 1
        });
      }
      
      closeDeleteDialog();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete the post. Please try again.');
      closeDeleteDialog();
    }
  };
  
  // Handle post editing
  const startEditingPost = (post) => {
    setEditingPostId(post.id);
    setEditPostContent(post.content);
  };
  
  const cancelEditingPost = () => {
    setEditingPostId(null);
    setEditPostContent('');
  };
  
  const saveEditedPost = async (postId) => {
    if (!editPostContent.trim()) {
      return;
    }
    
    try {
      const updatedPost = await communityService.updatePost(postId, { content: editPostContent });
      
      // Update the post in the list
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
      
      cancelEditingPost();
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update the post. Please try again.');
    }
  };
  
  // Handle topic editing
  const startEditingTopic = () => {
    setEditingTopic(true);
  };
  
  const cancelEditingTopic = () => {
    setEditingTopic(false);
    setEditTopicTitle(topic.title);
    setEditTopicDescription(topic.description);
  };
  
  const saveEditedTopic = async () => {
    if (!editTopicTitle.trim()) {
      return;
    }
    
    try {
      const updatedTopic = await communityService.updateTopic(topicId, {
        title: editTopicTitle,
        description: editTopicDescription
      });
      
      setTopic(updatedTopic);
      setEditingTopic(false);
    } catch (err) {
      console.error('Error updating topic:', err);
      setError('Failed to update the topic. Please try again.');
    }
  };
  
  // Handle topic deletion
  const [deleteTopicDialogOpen, setDeleteTopicDialogOpen] = useState(false);
  
  const openDeleteTopicDialog = () => {
    setDeleteTopicDialogOpen(true);
  };
  
  const closeDeleteTopicDialog = () => {
    setDeleteTopicDialogOpen(false);
  };
  
  const confirmDeleteTopic = async () => {
    try {
      await communityService.deleteTopic(topicId);
      navigate('/app/forum');
    } catch (err) {
      console.error('Error deleting topic:', err);
      setError('Failed to delete the topic. Please try again.');
      closeDeleteTopicDialog();
    }
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Toggle topic pin status
  const togglePinTopic = async () => {
    try {
      const updatedTopic = await communityService.updateTopic(topicId, {
        is_pinned: !topic.is_pinned
      });
      
      setTopic(updatedTopic);
    } catch (err) {
      console.error('Error toggling pin status:', err);
      setError('Failed to update the topic pin status. Please try again.');
    }
  };
  
  // Toggle topic closed status
  const toggleCloseTopic = async () => {
    try {
      const updatedTopic = await communityService.updateTopic(topicId, {
        is_closed: !topic.is_closed
      });
      
      setTopic(updatedTopic);
    } catch (err) {
      console.error('Error toggling closed status:', err);
      setError('Failed to update the topic closed status. Please try again.');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} color="secondary" />
        </Box>
      </Container>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={RouterLink} 
          to="/app/forum"
        >
          Back to Forum
        </Button>
      </Container>
    );
  }
  
  // If topic not found
  if (!topic) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          The topic you're looking for doesn't exist or has been removed.
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={RouterLink} 
          to="/app/forum"
        >
          Back to Forum
        </Button>
      </Container>
    );
  }
  
  // Check if user is the creator or a staff member
  const canEditTopic = user && (user.id === topic.created_by || user.is_staff);
  
  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/app" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/app/forum" color="inherit">
          Forum
        </Link>
        <Typography color="text.primary">
          {topic.title}
        </Typography>
      </Breadcrumbs>
      
      {/* Topic Header */}
      {editingTopic ? (
        <StyledPaper>
          <Typography variant="h6" gutterBottom>Edit Topic</Typography>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={editTopicTitle}
            onChange={(e) => setEditTopicTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={editTopicDescription}
            onChange={(e) => setEditTopicDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={cancelEditingTopic}>
              Cancel
            </Button>
            <Button variant="contained" onClick={saveEditedTopic}>
              Save Changes
            </Button>
          </Box>
        </StyledPaper>
      ) : (
        <TopicHeader>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {topic.title}
              </Typography>
              <Typography variant="body1">
                {topic.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <UserAvatar alt={topic.created_by_username} src={topic.created_by_avatar || ''}>
                  {topic.created_by_username?.charAt(0)}
                </UserAvatar>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle2">
                    {topic.created_by_username}
                  </Typography>
                  <Typography variant="caption" color="inherit">
                    Created {formatDate(topic.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {topic.is_pinned && (
                <Chip 
                  icon={<PinIcon />} 
                  label="Pinned" 
                  color="secondary"
                  size="small"
                />
              )}
              {topic.is_closed && (
                <Chip 
                  icon={<LockIcon />} 
                  label="Closed" 
                  color="error"
                  size="small"
                />
              )}
            </Box>
          </Box>
          
          {/* Topic management buttons for creator or staff */}
          {canEditTopic && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={startEditingTopic}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              {user.is_staff && (
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={togglePinTopic}
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  startIcon={<PinIcon />}
                >
                  {topic.is_pinned ? 'Unpin' : 'Pin'}
                </Button>
              )}
              {user.is_staff && (
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={toggleCloseTopic}
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  startIcon={<LockIcon />}
                >
                  {topic.is_closed ? 'Reopen' : 'Close'}
                </Button>
              )}
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={openDeleteTopicDialog}
                sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>
          )}
        </TopicHeader>
      )}
      
      {/* Topic Stats */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-around', borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{topic.post_count || posts.length}</Typography>
          <Typography variant="body2" color="text.secondary">Posts</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{topic.view_count || 0}</Typography>
          <Typography variant="body2" color="text.secondary">Views</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{formatDate(topic.created_at)}</Typography>
          <Typography variant="body2" color="text.secondary">Created</Typography>
        </Box>
      </Paper>
      
      {/* Posts List */}
      {posts.length === 0 ? (
        <StyledPaper>
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            No posts in this topic yet. Be the first to reply!
          </Typography>
        </StyledPaper>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <UserAvatar alt={post.created_by_username} src={post.created_by_avatar || ''}>
                  {post.created_by_username?.charAt(0)}
                </UserAvatar>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle2">
                    {post.created_by_username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(post.created_at)}
                    {post.updated_at !== post.created_at && ' (edited)'}
                  </Typography>
                </Box>
              </Box>
              
              {/* Post actions */}
              {user && (user.id === post.created_by || user.is_staff) && (
                <Box>
                  {editingPostId === post.id ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={cancelEditingPost}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        onClick={() => saveEditedPost(post.id)}
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <IconButton size="small" onClick={() => startEditingPost(post)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => openDeleteDialog(post.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {editingPostId === post.id ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
              />
            ) : (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {post.content}
              </Typography>
            )}
          </PostCard>
        ))
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
      
      {/* New Post Form */}
      {!topic.is_closed ? (
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Add Your Reply
          </Typography>
          <form onSubmit={handleSubmitPost}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your reply here..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              error={!!postError}
              helperText={postError}
              disabled={isPostSubmitting}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPostSubmitting}
                startIcon={<SendIcon />}
              >
                {isPostSubmitting ? 'Posting...' : 'Post Reply'}
              </Button>
            </Box>
          </form>
        </StyledPaper>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          This topic is closed. New replies are not allowed.
        </Alert>
      )}
      
      {/* Post Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDeletePost} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Topic Delete Confirmation Dialog */}
      <Dialog
        open={deleteTopicDialogOpen}
        onClose={closeDeleteTopicDialog}
      >
        <DialogTitle>Delete Topic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this entire topic and all its posts? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteTopicDialog}>Cancel</Button>
          <Button onClick={confirmDeleteTopic} color="error" autoFocus>
            Delete Topic
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TopicPage;