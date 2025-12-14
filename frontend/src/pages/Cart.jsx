import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import Header from "../components/Header";

export default function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.sweet.price * item.quantity,
    0
  );

  return (
    <div className="bg-[#f3fff3] min-h-screen pb-20">
      <Header />

      <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-6 sm:mb-8 md:mb-10">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-green-700 text-lg sm:text-xl md:text-2xl font-semibold">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cart.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  <img
                    src={item.sweet.imageUrl}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg sm:rounded-xl mx-auto sm:mx-0"
                    alt={item.sweet.name}
                  />

                  <div className="w-full">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800">
                      {item.sweet.name}
                    </h2>

                    <p className="font-semibold text-base sm:text-lg mt-1">
                      ₹{item.sweet.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                      <button
                        className="bg-green-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-800 transition-colors"
                        onClick={() => updateItem(item._id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>

                      <span className="text-lg sm:text-xl font-bold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>

                      <button
                        className="bg-green-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-800 transition-colors"
                        onClick={() => updateItem(item._id, item.quantity + 1)}
                      >
                        +
                      </button>

                      <span className="ml-auto text-base sm:text-lg font-bold text-green-800">
                        ₹{item.sweet.price * item.quantity}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <button
                      className="text-red-600 mt-3 sm:mt-4 font-semibold text-sm sm:text-base hover:text-red-800 transition-colors"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white p-6 sm:p-8 shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl h-fit lg:sticky lg:top-24">
              <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
                Order Summary
              </h3>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Items</span>
                  <span className="font-semibold">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg sm:text-xl font-bold text-green-800">
                    Total
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-green-800">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-colors mb-3">
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
