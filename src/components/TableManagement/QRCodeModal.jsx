import React, { useState, useEffect } from 'react';
import { QrCode, X, Download, Printer } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, table }) => {
  const [qrCodeURL, setQrCodeURL] = useState('');

  // Generate the QR content (URL that customers will scan)
  const generateQRContent = () => {
    const baseUrl = window.location.origin; // Gets current domain  
    return `${baseUrl}/order/${table.qr_code}`; // URL customers will visit
  };

  // Generate QR code URL using QR Server API
  const generateQRCodeURL = (content) => {
    const size = '200x200';
    const encodedContent = encodeURIComponent(content);
    // Customize QR code appearance
    const params = new URLSearchParams({
      size: size,
      data: encodedContent,
      bgcolor: 'ffffff',    // White background
      color: '000000',      // Black foreground
      qzone: '1',          // Quiet zone
      format: 'png'        // Image format
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  };

  useEffect(() => {
    if (isOpen && table) {
      const qrContent = generateQRContent();
      const qrURL = generateQRCodeURL(qrContent);
      setQrCodeURL(qrURL);
    }
  }, [isOpen, table]);

  const handleDownload = () => {
    if (qrCodeURL) {
      const link = document.createElement('a');
      link.download = `${table.table_number}-qr-code.png`;
      link.href = qrCodeURL;
      link.target = '_blank';
      link.click();
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
            QR Code - {table.table_name}
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
                alt={`QR Code for ${table.table_name}`}
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
            <p><strong>Table:</strong> {table.table_name} (#{table.table_number})</p>
            <p><strong>QR ID:</strong> <code>{table.qr_code}</code></p>
            <p><strong>Scan URL:</strong></p>
            <code className="qr-url">{generateQRContent()}</code>
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