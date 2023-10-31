const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/employee.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const serviceResponse=require("@baapcompany/core-api/services/serviceResponse");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const { default: mongoose } = require("mongoose");

router.post(
    "/",
    checkSchema(require("../dto/employee.dto")),
    async (req, res, next) => {
      if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
      }
      const empId = +Date.now();
  
      req.body.empId = empId;
  
      if (!req.body.addresses || req.body.addresses.length === 0) {
        // If no addresses are provided, assign an empty array to req.body.addresses
        req.body.addresses = [];
      } else {
        // Generate MongoDB ObjectId for each address
        const addressesWithId = req.body.addresses.map((address) => ({
          _id: new mongoose.Types.ObjectId(),
          ...address,
        }));
  
        // Use the updated addresses in the request body
        req.body.addresses = addressesWithId;
      }
  
      if (!req.body.experiences || req.body.experiences.length === 0) {
        // If no experiences are provided, assign an empty array to req.body.experiences
        req.body.experiences = [];
      } else {
        // Generate MongoDB ObjectId for each experience
        const experiencesWithId = req.body.experiences.map((experience) => ({
          _id: new mongoose.Types.ObjectId(),
          ...experience,
        }));
  
        // Use the updated experiences in the request body
        req.body.experiences = experiencesWithId;
      }
  
      const serviceResponse = await service.create(req.body);
      requestResponsehelper.sendResponse(res, serviceResponse);
    }
  );
  
router.get("/getByEmpId/:empId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByEmpId(req.params.empId);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.delete("/DeleteAddress/:empId/:addressId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.deleteAddressByEmpId(
        req.params.empId,
        req.params.addressId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.put("/updateByEmpId/:empId", async (req, res) => {
//     const serviceResponse = await service.updateEmployee(
//         req.params.empId,
//         req.body
//     );

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.put("/updateByEmpId/:empId", async (req, res) => {
    if (!req.body.addresses || req.body.addresses.length === 0) {
      // If no addresses are provided, assign an empty array to req.body.addresses
    //   req.body.addresses = [];
    } else {
      // Generate MongoDB ObjectId for each address if it doesn't have an _id already
      req.body.addresses = req.body.addresses.map((address) => {
        if (!address._id) {
          return {
            _id: new mongoose.Types.ObjectId(),
            ...address,
          };
        }
        return address;
      });
    }
  
    if (!req.body.experiences || req.body.experiences.length === 0) {
      // If no experiences are provided, assign an empty array to req.body.experiences
    //   req.body.experiences = [];
    } else {
      // Generate MongoDB ObjectId for each experience if it doesn't have an _id already
      req.body.experiences = req.body.experiences.map((experience) => {
        if (!experience._id) {
          return {
            _id: new mongoose.Types.ObjectId(),
            ...experience,
          };
        }
        return experience;
      });
    }
    const serviceResponse = await service.updateEmployee(req.params.empId, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
  });
  
router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/employee", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getByRFID/:groupId/:RFID", async (req, res) => {
  const serviceResponse = await service.getByGroupId(
      req.params.groupId,
      req.params.RFID
  );

  requestResponsehelper.sendResponse(res, {
      ...serviceResponse,
      data: serviceResponse.data.data,
  });
});
router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        phoneNo: req.query.phoneNo,
        name: req.query.name,
        role: req.query.role,
        RFID:req.query.RFID
    };
    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
module.exports = router;
