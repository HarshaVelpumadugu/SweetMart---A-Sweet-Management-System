import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    api.get("/sweets").then((res) => setSweets(res.data.data));
  }, []);

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-green-800 font-bold mb-6 sm:mb-8 md:mb-10">
        Admin Dashboard
      </h1>

      <Link
        to="/admin/sweet/new"
        className="inline-block bg-green-700 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:bg-green-800 transition-colors"
      >
        + Add Sweet
      </Link>

      <div className="mt-6 sm:mt-8 md:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 overflow-x-auto">
        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left">
          <thead>
            <tr className="border-b text-green-700 text-lg md:text-xl">
              <th className="pb-4">Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {sweets.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="py-4 font-semibold">{s.name}</td>
                <td>{s.category}</td>
                <td>{s.quantity}</td>
                <td>
                  <Link
                    to={`/admin/sweet/${s._id}`}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() =>
                      api
                        .delete(`/sweets/${s._id}`)
                        .then(() => location.reload())
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {sweets.map((s) => (
            <div
              key={s._id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="mb-3">
                <h3 className="font-bold text-lg text-green-800 mb-1">
                  {s.name}
                </h3>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {s.category}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Stock:</span> {s.quantity}
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/admin/sweet/${s._id}`}
                  className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                  onClick={() =>
                    api.delete(`/sweets/${s._id}`).then(() => location.reload())
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
