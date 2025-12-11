import { useState, useRef } from 'react';
import '../styles/InputPage.css';

const InputPage = () => {
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'text'
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (inputMode === 'upload' && selectedImage) {
      // Create FormData to upload file
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      try {
        // Save to public folder
        const response = await fetch(`${import.meta.env.VITE_UPLOAD_SERVER_URL || 'http://localhost:3001'}/api/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          alert('Image uploaded successfully!');
          resetForm();
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed');
      }
    } else if (inputMode === 'text' && textInput.trim()) {
      // Handle text input
      try {
        const response = await fetch(`${import.meta.env.VITE_UPLOAD_SERVER_URL || 'http://localhost:3001'}/api/text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: textInput })
        });
        
        if (response.ok) {
          alert('Text saved successfully!');
          resetForm();
        } else {
          alert('Failed to save text');
        }
      } catch (error) {
        console.error('Save error:', error);
        alert('Save failed');
      }
    }
    
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setTextInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="input-page">
      <div className="input-container">
        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${inputMode === 'upload' ? 'active' : ''}`}
            onClick={() => setInputMode('upload')}
          >
            📷 Upload Image
          </button>
          <button
            className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            📝 Enter Text
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {inputMode === 'upload' ? (
            <div className="upload-section">
              {!imagePreview ? (
                <div
                  className="upload-zone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                >
                  <div className="upload-icon">📁</div>
                  <h3>Upload Your Image</h3>
                  <p>Drag and drop an image here, or click to select</p>
                  <div className="supported-formats">
                    Supported formats: JPG, PNG, GIF, WebP
                  </div>
                </div>
              ) : (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <div className="image-controls">
                    <button onClick={resetForm} className="change-btn">
                      🔄 Change Image
                    </button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="text-section">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter your text here..."
                className="text-input"
                rows={10}
              />
              <div className="text-counter">
                {textInput.length} characters
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={resetForm} className="reset-btn">
            🗑️ Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (inputMode === 'upload' && !selectedImage) ||
              (inputMode === 'text' && !textInput.trim())
            }
            className="submit-btn"
          >
            {isSubmitting ? '⏳ Processing...' : '✅ Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPage;