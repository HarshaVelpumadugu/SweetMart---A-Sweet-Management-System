import { useEffect, useState } from "react";
import { api } from "../api";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

/* ---------------- CATEGORY OPTIONS ---------------- */
const CATEGORY_OPTIONS = [
  "cake",
  "chocolate",
  "lollipops",
  "icecream",
  "pudding",
  "pancakes",
  "doughnut",
  "cupcake",
  "cookies",
  "waffle",
];

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
    quantity: "number",
    imageUrl: "url",
    description: "textarea",
  };

  /* ---------------- FETCH SWEET (EDIT MODE) ---------------- */
  useEffect(() => {
    if (edit && id) {
      api
        .get(`/sweets/${id}`)
        .then((res) => {
          const sweet = res.data.data;
          setForm({
            name: sweet.name || "",
            price: sweet.price || "",
            category: sweet.category || "",
            quantity: sweet.quantity || "",
            imageUrl: sweet.imageUrl || "",
            description: sweet.description || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching sweet:", error);
          toast.error(
            error.response?.data?.message || "Failed to load sweet details"
          );
          navigate("/admin");
        });
    }
  }, [edit, id, navigate]);

  /* ---------------- SUBMIT ---------------- */
  const submit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      edit ? "Updating sweet..." : "Creating sweet..."
    );

    try {
      if (edit) {
        await api.put(`/sweets/${id}`, form);
        toast.success("Sweet updated successfully!", { id: toastId });
      } else {
        await api.post("/sweets", form);
        toast.success("Sweet created successfully!", { id: toastId });
      }

      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      console.error("Backend Error:", err.response?.data);
      toast.error(
        err.response?.data?.message ||
          `Failed to ${edit ? "update" : "create"} sweet`,
        { id: toastId }
      );
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 pb-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-6">
        {edit ? "Edit Sweet" : "Add Sweet"}
      </h1>

      <form
        onSubmit={submit}
        className="bg-white shadow-lg p-6 sm:p-8 md:p-10 rounded-xl w-full max-w-2xl"
      >
        <div className="space-y-5">
          {Object.keys(form).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {fieldLabels[field]}
              </label>

              {/* CATEGORY DROPDOWN */}
              {field === "category" ? (
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              ) : fieldTypes[field] === "textarea" ? (
                <textarea
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={4}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  required
                />
              ) : (
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  type={fieldTypes[field]}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  min={
                    field === "price" || field === "quantity" ? "0" : undefined
                  }
                  step={field === "price" ? "0.01" : undefined}
                  required
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition"
          >
            {edit ? "Save Changes" : "Create Sweet"}
          </button>

          <Link
            to="/admin"
            className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
