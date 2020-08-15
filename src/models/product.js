const mongoose = require("mongoose");
const { Schema } = mongoose;

let ProductSchema = new Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    priceTaxIncl: {
      type: Number,
      required: true,
      default: 0.0,
    },

    /*
    How can I make the pricing dynamic without any need 
    to implement scheduler?
    Brainstorming.
     */
    priceType: {
      type: String,
      enum: ["STATIC", "DYNAMIC"],
      default: "STATIC",
    },
    images: [
      {
        url: String,
        type: String,
      },
    ],
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    society: [
      {
        type: Schema.Types.ObjectId,
        ref: "Society",
      },
    ],

    /*
    Still in question.
    Why do I need state and city in product?
    I'm already creating product's relationship with its vendor.
    what's the need then?
    Brainstorming.
     */
    state: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
    /*
    ----ENDS HERE--- 
     */
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

var Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
