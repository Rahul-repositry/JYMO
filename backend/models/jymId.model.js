// const mongoose = require("mongoose");
// const { Schema } = mongoose;
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// const jymIdSchema = new Schema({
//   jymSeq: { type: Number },
//   jymId: { type: String },
//   userId: { type: String },
// });

// jymIdSchema.plugin(AutoIncrement, { inc_field: "jymSeq" });

// jymIdSchema.post("save", async function (doc, next) {
//   if (this.isNew && !this.jymId) {
//     this.jymId = `JYM${this.jymSeq}`; // Change this.seq to this.jymSeq
//   }
//   next();
// });

// const JymId = mongoose.model("jymId", jymIdSchema);

// module.exports = { JymId };

const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const jymIdSchema = new Schema({
  jymSeq: { type: Number },
  jymId: { type: String },
  userId: { type: String },
});

jymIdSchema.plugin(AutoIncrement, { inc_field: "jymSeq" });

jymIdSchema.post("save", async function (doc, next) {
  if (!this.jymId) {
    console.log("working");
    this.jymId = `JYM${this.jymSeq}`;
    await this.save(); // Save the document after updating jymId
  }
  next();
});

const JymId = mongoose.model("jymId", jymIdSchema);

module.exports = { JymId };
