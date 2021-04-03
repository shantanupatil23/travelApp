module.exports = (mongoose) => {
  var schema = mongoose.Schema();

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tutorial = mongoose.model("datasets", schema);
  return Tutorial;
};
