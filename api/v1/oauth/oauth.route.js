const express = require("express");
const UserRoute = express.Router();

const {
  oauthRegisterUserData,
  userRoleChange,
  userLogin,
  addUserRoleData,
} = require("./oauth.post");
const { userData, getUserRoleData } = require("./oauth.get");

// 1 oauth details Register users data
UserRoute.post("/register", oauthRegisterUserData);

// 2 oauth details Register users role change
UserRoute.put("/rolechange", userRoleChange);

// 3 oauth users login
UserRoute.post("/login", userLogin);

// 4 oauth users all data
UserRoute.get("/userdata", async (req, res) => userData(res));

// 5 oauth users role add
UserRoute.post("/userrole", addUserRoleData);

// 6 oauth users all  role data
UserRoute.get("/userroledata", async (req, res) => getUserRoleData(res));

module.exports = UserRoute;
