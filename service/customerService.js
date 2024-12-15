const { customerModels } = require("../model");
const { validateCustomer } = require("../utils/validationHelper");

const findAllCustomer = async () => {
    try {
        return await customerModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findCustomerByID = async (customerID) => {
    try {
        return await customerModels.findByID(customerID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createCustomer = async (customerData) => {
    try {
        await validateCustomer.validate(customerData, { abortEarly: false });
        return await customerModels.create(customerData);
    } catch (error) {
        throw error;
    }
}

const updateCustomer = async (customerID, customerData) => {
    try {
        await validateCustomer.validate(customerData, { abortEarly: false });
        return await customerData.update(customerID, customerData);
    } catch (error) {
        throw error;
    }
}

const deleteCustomer = async (customerID) => {
    try {
        return await customerModels.destroy(customerID);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

module.exports = {
    findAllCustomer,
    findCustomerByID,
    createCustomer,
    updateCustomer,
    deleteCustomer,
}