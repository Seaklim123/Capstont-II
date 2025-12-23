import React, { useState, useEffect } from 'react';
import { QrCode, X, Download, Printer } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, table }) => {
  const [qrCodeURL, setQrCodeURL] = useState('');

  // Generate the menu URL for the QR code
  const generateQRContent = () => {
    const customerMenuBaseUrl = 'http://localhost:5174';
    if (!table || !table.id) {
      return '';
    }
    return `${customerMenuBaseUrl}/menu?table_id=${table.id}`;
  };

  // Generate the QR code image URL using api.qrserver.com
  useEffect(() => {
    if (isOpen && table && table.id) {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(generateQRContent())}&size=200x200`;
      setQrCodeURL(qrApiUrl);
    } else {
      setQrCodeURL('');
    }
  }, [isOpen, table]);

  const handleDownload = async () => {
    if (!qrCodeURL) return;
    try {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = qrCodeURL;
      img.onload = () => {
        const qrSize = 200;
        const padding = 24;
        const textHeight = 32;
        const width = qrSize + padding * 2;
        const height = qrSize + padding * 2 + textHeight;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // White background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        // Draw frame
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 4;
        ctx.strokeRect(padding / 2, padding / 2, width - padding, height - padding - textHeight / 2);
        // Draw QR code
        ctx.drawImage(img, padding, padding, qrSize, qrSize);
        // Draw table info text
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'center';
        ctx.fillText(`Table ID: ${table.id}  |  No: ${table.number}`, width / 2, qrSize + padding + textHeight / 1.5);
        // Download
        canvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `table-${table.id}-menu-qr-code.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.onerror = () => alert('Failed to load QR code image for download.');
    } catch (error) {
      alert('Failed to download QR code image.');
    }
  };
  const handlePrint = () => {
    // Logic to print QR code
    window.print();
  };

  if (!isOpen || !table) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content modal-small">
        <div className="modal-header">
          <h3 className="modal-title">
            <QrCode size={20} />
            QR Code - Table ID {table.id}
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body text-center">
          <div className="qr-display">
            {qrCodeURL ? (
              <img 
                src={qrCodeURL} 
                alt={`QR Code for table ID ${table.id}`}
                className="qr-image"
                onError={(e) => {
                  console.error('Failed to load QR code');
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <div className="qr-loading">Generating QR Code...</div>
            )}
            <div className="qr-error" style={{display: 'none'}}>
              Failed to generate QR code
            </div>
          </div>
          
          <div className="qr-info">
            <p><strong>Table:</strong> Table ID {table.id} (Number: {table.number})</p>
            <p><strong>Menu URL:</strong></p>
            <code className="qr-url">{generateQRContent()}</code>
            <small className="text-gray block mt-2">
              Customers scan this QR code to access the menu for Table ID {table.id}
            </small>
          </div>

          <div className="qr-actions">
            <button className="btn btn-secondary" onClick={handleDownload}>
              <Download size={16} />
              Download
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={16} />
              Print
            </button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;