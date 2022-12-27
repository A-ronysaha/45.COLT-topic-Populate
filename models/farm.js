let mongoose = require("mongoose");

let { Schema } = mongoose;
let farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "Farm must have name!"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email required"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Element',
    },
  ],
});

let Farm = mongoose.model('Farm', farmSchema);
module.exports = Farm;
