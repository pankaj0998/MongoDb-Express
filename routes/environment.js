const express = require('express');
const envrouter = express();
const EnvironMentSchema = require('../models/environment')

envrouter.post('/environment', async (req, res) => {
    try {
        const { environmentName, variables } = req.body;
        const existingData = await EnvironMentSchema.findOne({ environmentName });
        let result = {}
        if (existingData) {
            for (const newVar of variables) {
                const existingVarIndex = existingData.variables.findIndex(
                    oldVar => oldVar.variableName === newVar.variableName
                );
                if (existingVarIndex !== -1) {
                    existingData.variables[existingVarIndex] = newVar;
                } else {
                    existingData.variables.push(newVar);
                }
            }

            await existingData.save();

            return res.status(200).json({ message: 'Environment updated successfully!', data: existingData });
        } else {
            const newData = new EnvironMentSchema(req.body);
            await newData.save();
        }
        return res.status(200).json({ message: 'Environments added successfully!', data: newData });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to add data to the database.', error: error });
    }
});


envrouter.get('/environment', async (req, res) => {
    try {
        const allData = await EnvironMentSchema.find({});
        if (allData.length === 0) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        return res.status(200).json({ message: 'EnvironMent Details fetched successfully!', data: allData });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to fetch data from the database.', error: error });
    }
});

envrouter.get('/environment/:environmentName', async (req, res) => {
    try {
        const { environmentName } = req.params;
        const data = await EnvironMentSchema.find({ "environmentName": environmentName });
        if (data.length === 0) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        return res.status(200).json({ message: 'Environment Details fetched successfully!', data: data });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to fetch data from the database.', error: error });
    }
});

envrouter.put('/environment/:environmentName', async (req, res) => {
    try {
        const { environmentName } = req.params;
        const updatedData = await EnvironMentSchema.findOneAndUpdate({ environmentName }, req.body, { new: true });
        if (!updatedData) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        return res.status(200).json({ message: 'Environment Details updated successfully!', data: updatedData });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to update data in the database.', error: error });
    }
});

envrouter.delete('/environment/:environmentName', async (req, res) => {
    try {
        const { environmentName } = req.params;
        const { variableName } = req.query
        let deletedData
        if (!variableName) {
            deletedData = await EnvironMentSchema.findOneAndDelete({ environmentName });
        } else {
            deletedData = await EnvironMentSchema.findOneAndUpdate({}, { $pull: { "variables": { "variableName": variableName } } }, { multi: true });
        }

        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        return res.status(200).json({ message: `Data deleted successfully for environmentName: ${environmentName}`, data: deletedData });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete data from the database.', error: error });
    }
});

module.exports = envrouter;