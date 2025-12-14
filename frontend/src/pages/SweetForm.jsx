import { useEffect, useState } from "react";
import { api } from "../api";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function SweetForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "",
    imageUrl: "",
    description: "",
  });

  const fieldLabels = {
    name: "Sweet Name",
    price: "Price (₹)",
    category: "Category",
    quantity: "Quantity",
    imageUrl: "Image URL",
    description: "Description",
  };

  const fieldTypes = {
    name: "text",
    price: "number",
    category: "text",
    quantity: "number",
    imageUrl: "url",
    description: "textarea",
  };

  useEffect(() => {
    if (edit && id) {
      api.get(`/sweets/${id}`).then((res) => {
        const sweetData = res.data.data;
        // Only extract the fields we want in the form
        setForm({
          name: sweetData.name || "",
          price: sweetData.price || "",
          category: sweetData.category || "",
          quantity: sweetData.quantity || "",
          imageUrl: sweetData.imageUrl || "",
          description: sweetData.description || "",
        });
      });
    }
  }, [edit, id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edit) await api.put(`/sweets/${id}`, form);
      else await api.post("/sweets", form);
      navigate("/admin");
    } catch (err) {
      console.log("Backend Error:", err.response.data);
    }
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 pb-12 sm:pb-16 md:pb-20">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-6 sm:mb-8 md:mb-10">
        {edit ? "Edit Sweet" : "Add Sweet"}
      </h1>

      <form
        className="bg-white shadow-lg sm:shadow-xl p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl w-full max-w-2xl"
        onSubmit={submit}
      >
        <div className="space-y-4 sm:space-y-5">
          {Object.keys(form).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {fieldLabels[field] || field}
              </label>
              {fieldTypes[field] === "textarea" ? (
                <textarea
                  className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder={`Enter ${fieldLabels[field] || field}`}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  rows={4}
                  required
                />
              ) : (
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder={`Enter ${fieldLabels[field] || field}`}
                  type={fieldTypes[field] || "text"}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  step={field === "price" ? "0.01" : undefined}
                  min={
                    field === "price" || field === "quantity" ? "0" : undefined
                  }
                  required
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="submit"
            className="flex-1 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-colors duration-200 active:scale-95 transform"
          >
            {edit ? "Save Changes" : "Create Sweet"}
          </button>
          <Link
            to="/admin"
            className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-colors duration-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
