import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

// Регистрируем компоненты для Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [cars, setCars] = useState([
    { id: 1, licensePlate: "ABC123", status: "WAITING" },
    { id: 2, licensePlate: "XYZ789", status: "IN_PROGRESS" },
    { id: 3, licensePlate: "LMN456", status: "COMPLETED" },
    { id: 4, licensePlate: "PQR987", status: "CANCELED" },
    { id: 5, licensePlate: "JKL321", status: "WAITING" },
    { id: 6, licensePlate: "STU654", status: "IN_PROGRESS" },
  ]);

  const [recentCars, setRecentCars] = useState([
    { id: 1, licensePlate: "ABC123", status: "WAITING" },
    { id: 2, licensePlate: "XYZ789", status: "IN_PROGRESS" },
  ]);

  // Подсчитываем количество машин по статусам
  const statusCount = cars.reduce(
    (acc, car) => {
      acc[car.status] = (acc[car.status] || 0) + 1;
      return acc;
    },
    { WAITING: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELED: 0 }
  );

  // Данные для графика
  const data = {
    labels: ["Waiting", "In Progress", "Completed", "Canceled"],
    datasets: [
      {
        label: "Car Statuses",
        data: [
          statusCount.WAITING,
          statusCount.IN_PROGRESS,
          statusCount.COMPLETED,
          statusCount.CANCELED,
        ],
        backgroundColor: ["#FFDD57", "#FF6B6B", "#4CAF50", "#9E9E9E"],
        borderColor: ["#FFDD57", "#FF6B6B", "#4CAF50", "#9E9E9E"],
        borderWidth: 1,
        hoverBackgroundColor: ["#FFDD57", "#FF6B6B", "#4CAF50", "#9E9E9E"],
        hoverBorderColor: ["#FFDD57", "#FF6B6B", "#4CAF50", "#9E9E9E"],
      },
    ],
  };

  // Обработчик для удаления машины
  const handleDeleteCar = (id) => {
    setCars(cars.filter((car) => car.id !== id));
    toast.success("Car deleted successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  // Обработчик для изменения статуса машины
  const handleStatusChange = (id, newStatus) => {
    const updatedCars = cars.map((car) =>
      car.id === id ? { ...car, status: newStatus } : car
    );
    setCars(updatedCars);
    toast.info(`Car status changed to ${newStatus}!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {/* Карточки с метками */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-600">Waiting Cars</h3>
          <p className="text-4xl font-bold text-yellow-500">
            {statusCount.WAITING}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-600">
            In Progress Cars
          </h3>
          <p className="text-4xl font-bold text-red-500">
            {statusCount.IN_PROGRESS}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-600">
            Completed Cars
          </h3>
          <p className="text-4xl font-bold text-green-500">
            {statusCount.COMPLETED}
          </p>
        </div>
      </div>

      {/* График для отображения статусов машин */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Car Statuses Overview
        </h2>
        <div className="h-72">
          <Bar
            data={data}
            options={{ responsive: true, animation: { duration: 1000 } }}
          />
        </div>
      </div>

      {/* Список последних машин */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Recent Cars
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">License Plate</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentCars.map((car) => (
                <tr
                  key={car.id}
                  className="hover:bg-gray-100 border-t border-gray-200 transition duration-200"
                >
                  <td className="p-4">{car.licensePlate}</td>
                  <td className="p-4">
                    <span
                      className={`${
                        car.status === "WAITING"
                          ? "bg-yellow-500"
                          : car.status === "IN_PROGRESS"
                          ? "bg-red-500"
                          : car.status === "COMPLETED"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      } text-white py-1 px-3 rounded-full`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center space-x-4">
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(car.id, "COMPLETED")}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                      Mark as Completed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
