exports.videoValidation = async ({ file = {} }, res, next) => {
  const { mimetype } = file;
  const expectedFileType = ["mp4"];
  if (!file)
    return res
      .status(400)
      .json({ success: false, message: "video upload failed..!" });
  const fileExtension = mimetype.split("/").pop();
  if (!expectedFileType.includes(fileExtension))
    return res.status(400).json({
      message: "video upload failed file type not matched..!",
    });
  next();
};

exports.ExcelFileValidation = async ({ file = {} }, res, next) => {
  const { originalname } = file;
  const expectedFileType = ["xlsx", "xlsm", "xlsb", "xltx"];
  if (!file)
    return res
      .status(400)
      .json({ success: false, message: "file upload failed..!" });
  const fileExtension = originalname.split(".").pop();
  if (!expectedFileType.includes(fileExtension))
    return res.status(400).json({
      message: "testcase upload failed file type not matched..!",
    });
  next();
};
