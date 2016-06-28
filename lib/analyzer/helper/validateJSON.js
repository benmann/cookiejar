function validate(jsonString) {
   try {
        var obj = JSON.parse(jsonString);
        if (obj && typeof obj == "object") {
            return obj;
        }
    }
    catch (e) { }
    return false;
};


module.exports = {
  validate: validate
};
