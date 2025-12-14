const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a sweet name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: [
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
      ],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    images: [
      {
        type: String,
      },
    ],
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot be more than 5"],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["g", "kg", "oz", "lb", "piece"],
      },
    },
    ingredients: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot be more than 100%"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
sweetSchema.index({ category: 1, "rating.average": -1 });
sweetSchema.index({ name: "text", description: "text" });

// Virtual for final price after discount
sweetSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

module.exports = mongoose.model("Sweet", sweetSchema);
