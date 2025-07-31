import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Checkbox,
  TableSortLabel,
  Tooltip,
  CircularProgress,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  PlayArrow as RunIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('joined_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage] = useState(10);
  const [success, setSuccess] = useState(null);

  const fetchUsers = async (page = 1, searchQuery = '', sortBy = sortField, order = sortOrder) => {
    setLoading(true);
    try {
        const response = await api.get(`/admin/users?page=${page}&limit=${rowsPerPage}&search=${searchQuery}`);
        
        if (response.data) {
            setUsers(response.data.users);
            setTotalPages(Math.ceil(response.data.total / rowsPerPage));
            setCurrentPage(response.data.page);
        }
    } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch users');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search, sortField, sortOrder);
  }, [currentPage, search, sortField, sortOrder]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      await Promise.all(selectedUsers.map(userId =>
        api.delete(`/admin/users/${userId}`)
      ));

      fetchUsers(currentPage, search);
      setSelectedUsers([]);
      setSuccess(`${selectedUsers.length} users deleted successfully`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete users');
    }
  };

  const handleEditUser = async (userId, updates) => {
    try {
        setLoading(true);
        const response = await api.put(`/admin/users/${userId}`, {
            email: updates.email,
            firstName: updates.firstName,
            lastName: updates.lastName,
            role: updates.role,
            subscription_status: updates.subscription_status
        });

        if (response.data.success) {
            setSuccess('User updated successfully');
            fetchUsers(currentPage, search);
            setOpenDialog(false);
        }
    } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to update user');
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        setSuccess('User deleted successfully');
        fetchUsers(currentPage, search);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete user');
    }
  };

  const handleSimulateScan = async (userId) => {
    try {
      const response = await api.post(`/admin/simulate-scan/${userId}`);
      if (response.data.success) {
        setSuccess(`Scan simulation started for user ${userId}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to start scan simulation');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getSubscriptionStatus = (user) => {
    // Default to 'expired' if no subscription status is set
    return user.subscription_status || user.subscriptionStatus || 'expired';
  };

  const getSubscriptionChipProps = (status) => {
    const baseStyles = {
      size: "small",
      sx: {
        backgroundColor: 'rgba(255, 67, 67, 0.2)',
        color: '#ff4343',
      }
    };

    switch (status) {
      case 'premium':
      case 'PREMIUM':
        return {
          ...baseStyles,
          sx: {
            backgroundColor: 'rgba(66, 255, 181, 0.2)',
            color: '#42ffb5',
          }
        };
      case 'trial':
      case 'TRIAL':
        return {
          ...baseStyles,
          sx: {
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            color: '#ff9800',
          }
        };
      default: // expired or any other status
        return baseStyles;
    }
  };

  const shortenUUID = (uuid) => {
    return uuid.split('-')[0];
  };

  return (
    <Box sx={{ color: '#fff' }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Typography variant="h5" sx={{ color: '#fff' }}>User Management</Typography>
        <Box display="flex" gap={2}>
          {selectedUsers.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              sx={{
                backgroundColor: 'rgba(255, 67, 67, 0.8)',
                '&:hover': {
                  backgroundColor: '#ff4343',
                },
              }}
            >
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#42ffb5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#42ffb5',
                },
              },
            }}
          />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ 
        backgroundColor: '#1E1E1E',
        boxShadow: 'none',
        border: '1px solid rgba(66, 255, 181, 0.05)',
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Checkbox
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-checked': {
                      color: '#42ffb5',
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <TableSortLabel
                  active={sortField === 'id'}
                  direction={sortField === 'id' ? sortOrder : 'asc'}
                  onClick={() => handleSort('id')}
                  sx={{
                    color: '#fff !important',
                    '& .MuiTableSortLabel-icon': {
                      color: '#42ffb5 !important',
                    },
                  }}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <TableSortLabel
                  active={sortField === 'email'}
                  direction={sortField === 'email' ? sortOrder : 'asc'}
                  onClick={() => handleSort('email')}
                  sx={{
                    color: '#fff !important',
                    '& .MuiTableSortLabel-icon': {
                      color: '#42ffb5 !important',
                    },
                  }}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <TableSortLabel
                  active={sortField === 'role'}
                  direction={sortField === 'role' ? sortOrder : 'asc'}
                  onClick={() => handleSort('role')}
                  sx={{
                    color: '#fff !important',
                    '& .MuiTableSortLabel-icon': {
                      color: '#42ffb5 !important',
                    },
                  }}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <TableSortLabel
                  active={sortField === 'subscription_status'}
                  direction={sortField === 'subscription_status' ? sortOrder : 'asc'}
                  onClick={() => handleSort('subscription_status')}
                  sx={{
                    color: '#fff !important',
                    '& .MuiTableSortLabel-icon': {
                      color: '#42ffb5 !important',
                    },
                  }}
                >
                  Subscription
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortOrder : 'asc'}
                  onClick={() => handleSort('createdAt')}
                  sx={{
                    color: '#fff !important',
                    '& .MuiTableSortLabel-icon': {
                      color: '#42ffb5 !important',
                    },
                  }}
                >
                  Joined
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CircularProgress sx={{ color: '#42ffb5' }} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow 
                  key={user.id} 
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(66, 255, 181, 0.1)',
                    },
                    backgroundColor: selectedUsers.includes(user.id) ? 'rgba(66, 255, 181, 0.05)' : 'transparent',
                  }}
                >
                  <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: '#42ffb5',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {shortenUUID(user.id)}
                  </TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor: user.role === 'ADMIN' ? 'rgba(66, 255, 181, 0.2)' : 'rgba(99, 179, 237, 0.2)',
                        color: user.role === 'ADMIN' ? '#42ffb5' : '#63b3ed',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Chip
                      label={getSubscriptionStatus(user)}
                      {...getSubscriptionChipProps(getSubscriptionStatus(user))}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenDialog(true);
                          }}
                          sx={{ color: '#42ffb5' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          sx={{ color: '#ff4343' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Run Simulated Scan">
                        <IconButton
                          size="small"
                          onClick={() => handleSimulateScan(user.id)}
                          sx={{ color: '#42ffb5' }}
                        >
                          <RunIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: 'rgba(66, 255, 181, 0.2)',
                color: '#42ffb5',
              },
              '&:hover': {
                backgroundColor: 'rgba(66, 255, 181, 0.1)',
              },
            },
          }}
        />
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1E1E1E',
            color: '#fff',
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#fff' }}>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#42ffb5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#42ffb5',
                    },
                  }}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#fff' }}>Subscription Status</InputLabel>
                <Select
                  value={selectedUser.subscriptionStatus || selectedUser.subscription_status}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      subscription_status: e.target.value,
                    })
                  }
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#42ffb5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#42ffb5',
                    },
                  }}
                >
                  <MenuItem value="TRIAL">Trial</MenuItem>
                  <MenuItem value="PREMIUM">Premium</MenuItem>
                  <MenuItem value="EXPIRED">Expired</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ 
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleEditUser(selectedUser.id, selectedUser)}
            variant="contained"
            sx={{
              backgroundColor: '#42ffb5',
              color: '#000',
              '&:hover': {
                backgroundColor: '#00d4aa',
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            backgroundColor: 'rgba(255, 67, 67, 0.1)',
            color: '#ff4343',
            border: '1px solid rgba(255, 67, 67, 0.2)',
            '& .MuiAlert-icon': {
              color: '#ff4343',
            },
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mt: 2,
            backgroundColor: 'rgba(66, 255, 181, 0.1)',
            color: '#42ffb5',
            border: '1px solid rgba(66, 255, 181, 0.2)',
            '& .MuiAlert-icon': {
              color: '#42ffb5',
            },
          }}
        >
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default UserManagement;