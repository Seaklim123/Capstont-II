const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists in the main project's public folder
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      uploadDate: new Date().toISOString()
    };

    console.log('File uploaded successfully:', fileInfo);
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Text saving endpoint
app.post('/api/text', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Save text to a file
    const timestamp = Date.now();
    const filename = `text-${timestamp}.txt`;
    const textPath = path.join(uploadsDir, filename);
    
    fs.writeFileSync(textPath, text, 'utf8');
    
    const textInfo = {
      filename: filename,
      path: `/uploads/${filename}`,
      size: text.length,
      saveDate: new Date().toISOString()
    };

    console.log('Text saved successfully:', textInfo);
    
    res.json({
      success: true,
      message: 'Text saved successfully',
      file: textInfo
    });
  } catch (error) {
    console.error('Text save error:', error);
    res.status(500).json({ error: 'Failed to save text' });
  }
});

// Get list of uploaded files
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileList = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        path: `/uploads/${filename}`,
        size: stats.size,
        uploadDate: stats.mtime.toISOString()
      };
    });
    
    res.json({ success: true, files: fileList });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: error.message || 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
  console.log(`Uploads will be saved to: ${uploadsDir}`);
});