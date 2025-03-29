import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleUser, selectUserDetails, selectUserError, selectUserLoading, updateUserDetails } from '../../redux/fetchSingleUser/fetchSingleUser'; 
import { AppDispatch, RootState } from '../../../store'; 
import { useParams } from 'react-router-dom';
import Loader from '../loader/Loader';
import ConfirmDialog from '../utils/confirmBox/ConfirmDialog';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Initially, `id` is a string
  const userId = id ? Number(id) : 0;
  const dispatch = useDispatch<AppDispatch>();
  
  const userDetails = useSelector(selectUserDetails);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  // State to control the confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Local state for form inputs
  const [formData, setFormData] = useState<User>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  });

  // Handle changes in form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to update user details
  const handleSubmit = () => {
    const updatedData = { ...formData };
    console.log(updatedData);
    dispatch(updateUserDetails(updatedData));
  };

  // Open the confirmation dialog when the user clicks "Update User"
  const handleUpdateClick = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    setConfirmDialogOpen(true); // Show the confirmation dialog
  };

  // Handle confirmation of the update
  const handleUpdateConfirm = () => {
    handleSubmit(); // Submit the form after confirmation
    setConfirmDialogOpen(false); // Close the confirmation dialog
  };

  // Handle cancellation of the update
  const handleUpdateCancel = () => {
    setConfirmDialogOpen(false); // Close the confirmation dialog without updating
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    dispatch(fetchSingleUser(userId)); // Adjust to fetch user details by ID
  }, [dispatch, userId]);

  // Populate form data once the user details are fetched
  useEffect(() => {
    if (userDetails) {
      setFormData(userDetails); // Populate form with user data
    }
  }, [userDetails]);

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Profile Section */}
          <Avatar
            alt={`${formData.first_name} ${formData.last_name}`}
            src={formData.avatar || '/default-avatar.png'} // Placeholder if avatar is empty
            sx={{ width: 120, height: 120, marginBottom: 2 }}
          />
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            {userDetails?.first_name} {userDetails?.last_name}
          </Typography>

          {/* Form Section */}
          <form onSubmit={handleUpdateClick} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Update User
              </Button>
            </Box>
          </form>
        </Box>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onConfirm={handleUpdateConfirm}
        onCancel={handleUpdateCancel}
        message="Are you sure you want to update this user's details?"
        title="Confirm Update"
      />
    </Box>
  );
};

export default UserDetails;
