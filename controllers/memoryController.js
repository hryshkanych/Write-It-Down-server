const Memory = require('../models/memoryModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('file', 5);

const memoryController = {
    addMemory: async (req, res) => {
        try {
            upload(req, res, async function (err) {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ message: 'Error uploading files', error: err });
                }

                const { userId, creationDate, selected, textNote } = req.body;
                const images = req.files.map(file => file.path);

                const newMemory = new Memory({
                    userId,
                    creationDate,
                    selected,
                    textNote,
                    images
                });

                await newMemory.save();

                return res.status(201).json({ message: 'Memory saved successfully!', memory: newMemory });
            });
        } catch (error) {
            console.error('Error saving memory:', error);
            return res.status(500).json({ message: 'Something went wrong while saving your memory.', error });
        }
    },

    getAllMemories: async (req, res) => {
        try {
            const { userId } = req.body;
            const memories = await Memory.find({ userId });
            
            for (const memory of memories) {
                for (let i = 0; i < memory.images.length; i++) {
                    const imagePath = memory.images[i];
                    const imageData = fs.readFileSync(imagePath);
                    memory.images[i] = `data:image/jpeg;base64,${imageData.toString('base64')}`;
                }
            }

            return res.status(200).json({ memories });
        } catch (error) {
            console.error('Error fetching memories:', error);
            return res.status(500).json({ message: 'Something went wrong while fetching memories.', error });
        }
    },

    deleteMemory: async (req, res) => {
        try {
            const { id } = req.params;
            const memory = await Memory.findById(id);

            if (!memory) {
                return res.status(404).json({ message: 'Memory not found' });
            }

            // Видалення зображень пам'яті з файлової системи
            memory.images.forEach(imagePath => {
                fs.unlinkSync(imagePath);
            });

            // Видалення пам'яті з бази даних
            await Memory.findByIdAndDelete(id);

            return res.status(200).json({ message: 'Memory deleted successfully' });
        } catch (error) {
            console.error('Error deleting memory:', error);
            return res.status(500).json({ message: 'Something went wrong while deleting memory', error });
        }
    },

    updateMemory: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            const memory = await Memory.findById(id);
            if (!memory) {
                return res.status(404).json({ message: 'Memory not found' });
            }

            Object.assign(memory, updates);
            await memory.save();

            return res.status(200).json({ message: 'Memory updated successfully', memory });
        } catch (error) {
            console.error('Error updating memory:', error);
            return res.status(500).json({ message: 'Something went wrong while updating memory', error });
        }
    }
};

module.exports = memoryController;
