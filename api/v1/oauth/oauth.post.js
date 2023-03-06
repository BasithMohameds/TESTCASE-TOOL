const userdata = require("./oauth.module");
const userrole = require("./role.model");

// 1 oauth details Register users data
exports.oauthRegisterUserData = async ({ body = {} }, res) => {
  try {
    const { email, username, role } = body;
    const result = await userdata.create({
      email,
      username,
      role,
    });
    res.json({ message: "Register Successfully Completed...!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

// 2 oauth details Register users role change
exports.userRoleChange = async ({ body = {} }, res) => {
  try {
    const { userId, newRole } = body;
    const result = await userdata.findByIdAndUpdate(
      { _id: userId },
      { role: newRole }
    );
    if (!result) return res.json({ message: "User Not Found...!" });
    res.json({ message: "status changed successfully.." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

// 3 oauth users login
exports.userLogin = async ({ query = {} }, res) => {
  try {
    const { email } = query;
    const result = await userdata.findOne({ email }).lean();
    if (!result) {
      res.json({ message: false });
    } else {
      const { username, role } = result;
      res.json({ message: true, username, role });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

// 5 oauth users role add
exports.addUserRoleData = async ({ body = {} }, res) => {
  try {
    const { role, id } = body;
    if (!id) {
      const result = await userrole.create({ role });
      res.json({ message: "role Added Successfully...!" });
    } else {
      const result = await userrole.findByIdAndUpdate(id, { role: role });
      res.json({ message: "role Updated Successfully...!" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

// const {
//   accessTokenGenerator,
//   refreshTokenGenerator,
// } = require("../token/token");

// exports.userLogin = async (req, res) => {
//   const { email, password } = req.body;
//   const userData = {
//     email: "basith@gmail.com",
//     password: "basith@123",
//   };
//   if (email === userData.email && password === userData.password) {
//     const accessToken = await accessTokenGenerator(email);
//     const refreshToken = await refreshTokenGenerator(email);
//     res.json({ accessToken, refreshToken });
//   } else {
//     return res.status(400).send("user Not Found");
//   }
// };

// exports.refresh = async (req, res) => {
//   try {
//     const token = req.header("token");
//     const verify = jwt.verify(token, process.env.jwt_key);
//     res.send();
//     next();
//   } catch (err) {
//     res.status(400).send("Invalid Token");
//   }
// };
