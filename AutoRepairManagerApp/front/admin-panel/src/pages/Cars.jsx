import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";

const Cars = () => {
  const [cars, setCars] = useState([
    { id: 1, name: "Toyota Camry", licensePlate: "AA123BC", owner: "John Doe" },
    {
      id: 2,
      name: "Honda Accord",
      licensePlate: "BB456CD",
      owner: "Jane Smith",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleDeleteCar = (id) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    toast.success("Car deleted successfully!");
  };

  const handleSaveCar = (car) => {
    if (car.id) {
      setCars((prevCars) => prevCars.map((c) => (c.id === car.id ? car : c)));
      toast.info("Car updated successfully!");
    } else {
      setCars((prevCars) => [...prevCars, { ...car, id: Date.now() }]);
      toast.success("New car added successfully!");
    }
    setIsModalOpen(false);
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />

      <h1 className="text-3xl font-bold text-gray-700 mb-6">Manage Cars</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search by name or license plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <SearchIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={handleAddCar}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Car
        </button>
      </div>

      {filteredCars.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Car Name</th>
                <th className="p-4 text-left">License Plate</th>
                <th className="p-4 text-left">Owner</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr
                  key={car.id}
                  className="hover:bg-gray-100 border-t border-gray-200 transition duration-200"
                >
                  <td className="p-4">{car.name}</td>
                  <td className="p-4">{car.licensePlate}</td>
                  <td className="p-4">{car.owner}</td>
                  <td className="p-4 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEditCar(car)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
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
            No cars found. Add a new car to get started!
          </p>
        </div>
      )}

      {isModalOpen && (
        <CarModal
          car={selectedCar}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCar}
        />
      )}
    </div>
  );
};

const CarModal = ({ car, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: car?.id || null,
    name: car?.name || "",
    licensePlate: car?.licensePlate || "",
    owner: car?.owner || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Car name is required.";
    if (!formData.licensePlate)
      newErrors.licensePlate = "License plate is required.";
    if (!formData.owner) newErrors.owner = "Owner name is required.";
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
          {car ? "Edit Car" : "Add Car"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Car Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">License Plate</label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.licensePlate && (
              <p className="text-red-500 text-sm">{errors.licensePlate}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Owner</label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.owner && (
              <p className="text-red-500 text-sm">{errors.owner}</p>
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

export default Cars;
