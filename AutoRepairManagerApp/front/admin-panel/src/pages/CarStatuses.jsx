import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";

// Перечисление для статусов машин
const CarStatusEnum = Object.freeze({
  WAITING: "Waiting",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
});

const CarStatuses = () => {
  const [statuses, setStatuses] = useState([
    { id: 1, status: CarStatusEnum.WAITING },
    { id: 2, status: CarStatusEnum.IN_PROGRESS },
    { id: 3, status: CarStatusEnum.COMPLETED },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleAddStatus = () => {
    setSelectedStatus(null);
    setIsModalOpen(true);
  };

  const handleEditStatus = (status) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const handleDeleteStatus = (id) => {
    setStatuses((prevStatuses) =>
      prevStatuses.filter((status) => status.id !== id)
    );
    toast.success("Status deleted successfully!");
  };

  const handleSaveStatus = (status) => {
    if (status.id) {
      setStatuses((prevStatuses) =>
        prevStatuses.map((s) => (s.id === status.id ? status : s))
      );
      toast.info("Status updated successfully!");
    } else {
      setStatuses((prevStatuses) => [
        ...prevStatuses,
        { ...status, id: Date.now() },
      ]);
      toast.success("New status added successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-700 mb-6">
        Manage Car Statuses
      </h1>

      {/* Add Status Button */}
      <button
        onClick={handleAddStatus}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition mb-6"
      >
        <PlusCircleIcon className="w-5 h-5 mr-2" />
        Add Status
      </button>

      {/* Car Statuses Table */}
      {statuses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status) => (
                <tr
                  key={status.id}
                  className="hover:bg-gray-100 border-t border-gray-200 transition duration-200"
                >
                  <td className="p-4">{status.status}</td>
                  <td className="p-4 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEditStatus(status)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStatus(status.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-12">
          <PlusCircleIcon className="w-16 h-16 text-gray-300" />
          <p className="text-gray-500 mt-4">
            No statuses found. Add a new status to get started!
          </p>
        </div>
      )}

      {/* Status Modal */}
      {isModalOpen && (
        <StatusModal
          status={selectedStatus}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStatus}
        />
      )}
    </div>
  );
};

// Status Modal Component
const StatusModal = ({ status, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: status?.id || null,
    status: status?.status || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          {status ? "Edit Status" : "Add Status"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a status</option>
              {Object.entries(CarStatusEnum).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarStatuses;
