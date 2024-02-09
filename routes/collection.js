const express = require('express');
const router = express();
const Data = require('../models/collection')


router.get('/collection', async (req, res) => {
    try {
        const allData = await Data.find();
        if (!allData || allData.length === 0) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        return res.status(200).json({ message: 'Collection Details fetched successfully!', data: allData });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to fetch data from the database.', error: error });
    }
});

router.get('/collection/:serviceName', async (req, res) => {
    try {
        const { serviceName } = req.params;
        const data = await Data.find({ "serviceName": serviceName });
        if (data.length === 0) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        return res.status(200).json({ message: 'Collection Details fetched successfully!', data: data });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to fetch data from the database.', error: error });
    }
});

router.post('/collection', async (req, res) => {
    try {
        const arrObj = req.body;
        const result = [];
        for (const item of arrObj) {
            const { serviceName, endpoints } = item;
            const existingData = await Data.findOne({ serviceName });

            if (existingData) {
                existingData.endpoints = endpoints;
                await existingData.save();
                result.push(existingData);
            } else {
                const newData = new Data({ serviceName, endpoints });
                await newData.save();
                result.push(newData);
            }
        }
        return res.status(200).json({ message: 'Collection Details added successfully!', data: result });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to add data to the database.', error: error });
    }
});


router.put('/collection/:serviceName', async (req, res) => {
    try {
        const { serviceName } = req.params;
        const updatedData = await Data.findOneAndUpdate({ serviceName }, req.body, { new: true });
        if (!updatedData) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        return res.status(200).json({ message: 'Collection Details updated successfully!', data: updatedData });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to update data in the database.', error: error });
    }
});

router.delete('/collection/:serviceName', async (req, res) => {
    try {
        const { serviceName } = req.params;
        const { url } = req.query;
        let deletedData = null
        if (!url) {
            deletedData = await Data.findOneAndDelete({ serviceName });
        } else {
            let endpoints = {}

            if (url) {
                endpoints.url = url.toString()
            }

            deletedData = await Data.findOneAndUpdate({}, { $pull: { "endpoints": endpoints } }, { multi: true });
        }
        if (!deletedData) {
            return res.status(404).json({ error: 'Data not found.' });
        }

        return res.status(200).json({ message: `Data deleted successfully for serviceName: ${serviceName}`, data: deletedData });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete data from the database.', error: error });
    }
});


module.exports = router;