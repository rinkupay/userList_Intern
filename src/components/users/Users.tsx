import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchUsers } from "../../redux/fetchUsers/fetchUsers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../redux/fetchSingleUser/fetchSingleUser";
import ConfirmDialog from "../utils/confirmBox/ConfirmDialog";

const AddAgent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error, total, totalPages } = useSelector(
    (state: RootState) => state.users
  );

  const [page, setPage] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  const handleEdit = (userId: number) => {
    navigate(`/dashboard/user/${userId}`);
  };

  const handleDelete = (userId: number) => {
    handleDeleteDialogOpen(userId);
  };

  const handleDeleteDialogOpen = (userId: number) => {
    setUserToDelete(userId);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete !== null) {
      dispatch(deleteUser(userToDelete));
      setConfirmDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px", width: "100%" }}>
      <ConfirmDialog
        open={confirmDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        message="Are you sure you want to delete this user?"
        title="Confirm Deletion"
      />

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            maxWidth: "100%",
            marginBottom: "20px",
            paddingTop: "20px",
          }}
        >
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: "20px", maxWidth: "300px" }}
          />

          {/* Add wrapper for better responsiveness */}
          <Box sx={{ overflowX: "auto", minWidth: "200px" }}>
            {/* <table className="min-w-full table-auto border-collapse"> */}
            {/* Add responsive table class for mobile */}
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Avatar</th>
                  <th className="px-4 py-2 text-left">First Name</th>
                  <th className="px-4 py-2 text-left">Last Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">
                      <Avatar
                        alt={`${user.first_name} ${user.last_name}`}
                        src={user.avatar}
                      />
                    </td>
                    <td className="px-4 py-2">{user.first_name}</td>
                    <td className="px-4 py-2">{user.last_name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(user.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </div>
      )}

      <div className="flex justify-center items-center mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-500"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span className="text-center text-lg">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-500"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </Box>
  );
};

export default AddAgent;
