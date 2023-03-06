const userdata = require("./oauth.module");
const userrole = require("./role.model");

// 4 oauth users all data
exports.userData = async (res) => {
  try {
    const result = await userdata.find({}).lean();
    res.json({ message: result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

// 6 oauth users all  role data
exports.getUserRoleData = async (res) => {
  try {
    const result = await userrole.find({}).lean();
    res.json({ message: result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
