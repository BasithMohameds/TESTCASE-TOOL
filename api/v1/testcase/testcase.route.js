const express = require("express");
const TestCaseRoute = express.Router();

const {
  testCaseUploadFile,
  recordVideoAdd,
  testCaseInfo,
  testCaseUploadRowData,
  testCaseStatus,
  executedInsertRowAPI,
  getJiraMemberData,
  createJiraIssue,
} = require("./testcase.post");
const {
  testCaseData,
  testCaseIndividualData,
  testCaseCloneData,
  deleteData,
  getExecutedCloneData,
  testCaseCloneIndividualData,
  singleTestCaseData,
  deleteExistingData,
} = require("./testcase.get");
const { upload } = require("../utils/multerstorage");
const { uploadVideo } = require("../utils/videorecordmulter");
const {
  testCaseInfovalidation,
  testCaseReasonValidation,
  mongoIdValidation,
  rowDataValidation,
  mongoIdValidations,
} = require("../validator/express.validations");

const {
  videoValidation,
  ExcelFileValidation,
} = require("../validator/file.validation");

// 1 get testcase data from db
TestCaseRoute.get("/retrievetestcase", async (req, res) => testCaseData(res));

// 2 feature and version post api
TestCaseRoute.post("/testcaseinfo", testCaseInfovalidation(), testCaseInfo);

// 3 testcase excel sheet read and save
TestCaseRoute.post(
  "/uploadfile",
  upload.single("upload"),
  mongoIdValidations("id"),
  async (req, res, next) => ExcelFileValidation(req, res, next),
  testCaseUploadFile
);

// 4 get api find by id from testcase table
TestCaseRoute.get(
  "/getuploadedfile",
  mongoIdValidation("id"),
  testCaseIndividualData
);

// 5 testcase row data save
TestCaseRoute.post(
  "/uploadrowdata",
  rowDataValidation(),
  testCaseUploadRowData
);

// 6 post clone testcase data clone collection
TestCaseRoute.post(
  "/testcaseclone",
  testCaseReasonValidation(),
  testCaseCloneData
);

// 7 post record video and upload to s3 bucket
TestCaseRoute.post(
  "/uploadvideo",
  uploadVideo,
  // mongoIdValidations("id"),
  // async (req, res, next) => videoValidation(req, res, next),
  recordVideoAdd
);

// 8 testcase states update
TestCaseRoute.post("/testcasestatus", mongoIdValidations("id"), testCaseStatus);

// 9 find clone data by key and id
TestCaseRoute.get(
  "/getexecutedclone",
  mongoIdValidation("id"),
  getExecutedCloneData
);

// 10 add new row with clonekey clone collection
TestCaseRoute.post(
  "/executedinsertrowapi",
  rowDataValidation(),
  executedInsertRowAPI
);

// 11 get clone testcase individual data from db
TestCaseRoute.get(
  "/getuploadedClonefile",
  mongoIdValidation("id"),
  testCaseCloneIndividualData
);

// 12 delete testcase and clone data
TestCaseRoute.delete("/dropdata", mongoIdValidation("id"), deleteData);

// 13 get jira project team  active members details
TestCaseRoute.get("/getjiramember", async (req, res) => getJiraMemberData(res));

// 14 create jira issue using api call
TestCaseRoute.post("/createissue", createJiraIssue);

// 15 get testcase clone data filter by clonkey and testcase id
TestCaseRoute.get("/singleTestCase", singleTestCaseData);

// 16 delete testcase and feature data or testcaseclone data
TestCaseRoute.delete("/deleteFeatureData", deleteExistingData);

module.exports = TestCaseRoute;
