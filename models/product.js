let mongoose = require("mongoose");
let { Schema } = mongoose;

let elementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegetable", "diary", "dryfood"],
  },
  farm: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
  },
});

let Element = mongoose.model("Element", elementSchema);
module.exports = Element;
