const { vendorModels } = require("../model");
const { validateVendor } = require("../utils/validationHelper");

const findAllVendor = async () => {
    try {
        return await vendorModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findVendorByID = async (vendorID) => {
    try {
        return await vendorModels.findByID(vendorID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createVendor = async (vendorData) => {
    try {
        await validateVendor.validate(vendorData, { abortEarly: false });
        return await vendorModels.create(vendorData);
    } catch (error) {
        throw error;
    }
}

const updateVendor = async (vendorID, vendorData) => {
    try {
        await validateVendor.validate(vendorData, { abortEarly: false });
        return await vendorData.update(vendorID, vendorData);
    } catch (error) {
        throw error;
    }
}

const deleteVendor = async (vendorID) => {
    try {
        return await vendorModels.destroy(vendorID);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

module.exports = {
    findAllVendor,
    findVendorByID,
    createVendor,
    updateVendor,
    deleteVendor,
}