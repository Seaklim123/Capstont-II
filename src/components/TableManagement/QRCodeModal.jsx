import React, { useState, useEffect } from 'react';
import { QrCode, X, Download, Printer } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, table }) => {
  const [qrCodeURL, setQrCodeURL] = useState('');

  // Generate the QR content (URL that customers will scan)
  const generateQRContent = () => {
    // Point to your customer menu app
    const customerMenuBaseUrl = 'http://localhost:5174';
    //----need u guys change it klun eng depending on local frontend user customer -------
    // const customerMenuBaseUrl = 'https://customer-ordering-m6ertgsda-piseytep26-6848s-projects.vercel.app';
    // Include table number as query parameter so the menu knows which table ordered
    // Changed from /menu to root path since /menu might not exist
    const menuUrl = `${customerMenuBaseUrl}/menu?table=${table.number || table.table_number}`;
    console.log('Generated QR URL:', menuUrl); // Debug log
    return menuUrl;
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
      format: 'png',       // Image format
      timestamp: Date.now() // Cache busting parameter
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  };

  useEffect(() => {
    console.log('QRCodeModal useEffect triggered:', { isOpen, table }); // Debug log
    if (isOpen && table) {
      // Clear previous QR code to force regeneration
      setQrCodeURL('');
      const qrContent = generateQRContent();
      const qrURL = generateQRCodeURL(qrContent);
      console.log('Generated QR Code URL:', qrURL); // Debug log
      setQrCodeURL(qrURL);
    } else {
      // Clear QR code when modal closes
      setQrCodeURL('');
    }
  }, [isOpen, table]);

  const handleDownload = () => {
    if (qrCodeURL) {
      const link = document.createElement('a');
      link.download = `table-${table.number}-menu-qr-code.png`;
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
            QR Code - Table {table.number}
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
            <p><strong>Table:</strong> Table {table.number} (#{table.number})</p>
            <p><strong>Menu URL:</strong></p>
            <code className="qr-url">{generateQRContent()}</code>
            <small className="text-gray block mt-2">
              Customers scan this QR code to access the menu for Table {table.number}
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
            {/* <button className="btn btn-warning" onClick={() => {
              console.log('Force refresh clicked!');
              setQrCodeURL('');
              const qrContent = generateQRContent();
              const qrURL = generateQRCodeURL(qrContent);
              console.log('Force generated URL:', qrContent);
              console.log('Force generated QR:', qrURL);
              setQrCodeURL(qrURL);
            }}>
              🔄 Refresh QR
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;