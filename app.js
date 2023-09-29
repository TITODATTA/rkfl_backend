const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const financialRoutes = require('./routes/financialRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const taxatationRoutes = require('./routes/taxationRoutes')
const File = require('./models/file');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/employees', employeeRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/taxations', taxatationRoutes);





const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { filename, path } = req.file;

        // Save file information to MongoDB
        const file = new File({
            filename,
            filepath: path,
        });
        await file.save();
        res.json({ filename, file });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error uploading file');
    }
});

// Endpoint to retrieve files
app.get('/file/:id', async (req, res) => {
    try {
        const fileId = req.params.id;

        // Retrieve file from MongoDB by ID
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).send('File not found');
        }
        res.sendFile(path.join(__dirname, file.filepath));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving file');
    }
});

app.delete('/file/:id', async (req, res) => {
    try {
        const fileId = req.params.id;

        // Retrieve file from MongoDB by ID
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Delete the file from the uploads folder
        fs.unlinkSync(file.filepath);

        // Delete the file from MongoDB
        await File.findByIdAndDelete(fileId);

        res.send('File deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting file');
    }
});





// Connect to MongoDB
connectDB();


module.exports = app;
