import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

const CarStatuses = () => {
  const [cars, setCars] = useState([]);
  const [editStatus, setEditStatus] = useState({ id: null, status: "" });
  const statusOptions = ["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELED"]; // Enum values

  useEffect(() => {
    // Fetch cars data (simulate API call)
    setCars([
      { id: 1, licensePlate: "ABC123", status: "WAITING" },
      { id: 2, licensePlate: "XYZ789", status: "IN_PROGRESS" },
      { id: 3, licensePlate: "LMN456", status: "COMPLETED" },
    ]);
  }, []);

  const handleDeleteCar = (id) => {
    setCars(cars.filter((car) => car.id !== id));
    toast.success("Car removed from the queue.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const handleEditClick = (car) => {
    setEditStatus({ id: car.id, status: car.status });
  };

  const handleSaveStatus = (id) => {
    setCars(
      cars.map((car) =>
        car.id === id ? { ...car, status: editStatus.status } : car
      )
    );
    setEditStatus({ id: null, status: "" });
    toast.success("Status updated successfully.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const handleStatusChange = (e) => {
    setEditStatus({ ...editStatus, status: e.target.value });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Car Statuses</h1>

      {/* Таблица с автомобилями */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-4 text-left">License Plate</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr
                key={car.id}
                className="hover:bg-gray-100 border-t border-gray-300"
              >
                <td className="p-4">{car.licensePlate}</td>
                <td className="p-4">
                  {editStatus.id === car.id ? (
                    <select
                      value={editStatus.status}
                      onChange={handleStatusChange}
                      className="border border-gray-300 rounded-md p-2"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`${
                        car.status === "WAITING"
                          ? "bg-yellow-400"
                          : car.status === "IN_PROGRESS"
                          ? "bg-orange-400"
                          : car.status === "COMPLETED"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      } text-white px-3 py-1 rounded-full text-sm`}
                    >
                      {car.status}
                    </span>
                  )}
                </td>
                <td className="p-4 flex justify-center space-x-4">
                  {editStatus.id === car.id ? (
                    <button
                      onClick={() => handleSaveStatus(car.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(car)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <PencilIcon className="w-5 h-5 mr-1" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center"
                  >
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarStatuses;
