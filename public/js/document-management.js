/**
 * EstateLink - Document Management and DigiLocker Integration
 * This file handles document uploads, verification, and DigiLocker API integration
 */

// Document management system
const DocumentManager = {
  // Initialize document management system
  init: function () {
    this.setupDocumentUpload();
    this.setupDigiLockerIntegration();
    this.setupDocumentList();
  },

  // Setup document upload functionality
  setupDocumentUpload: function () {
    const fileUpload = document.getElementById("document-upload");
    const uploadBtn = document.getElementById("upload-document-btn");
    const dragDropArea = document.getElementById("drag-drop-area");

    if (!fileUpload || !uploadBtn || !dragDropArea) return;

    // File input change handler
    fileUpload.addEventListener("change", function (e) {
      const files = e.target.files;
      if (files.length > 0) {
        DocumentManager.handleFiles(files);
      }
    });

    // Upload button click handler
    uploadBtn.addEventListener("click", function () {
      fileUpload.click();
    });

    // Drag and drop handlers
    dragDropArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add("drag-over");
    });

    dragDropArea.addEventListener("dragleave", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove("drag-over");
    });

    dragDropArea.addEventListener("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove("drag-over");

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        DocumentManager.handleFiles(files);
      }
    });
  },

  // Handle the uploaded files
  handleFiles: function (files) {
    const uploadProgress = document.getElementById("upload-progress");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (uploadProgress) uploadProgress.classList.remove("hidden");

    // Process each file
    Array.from(files).forEach((file, index) => {
      // Update progress
      if (progressBar && progressText) {
        const progress = Math.round(((index + 1) / files.length) * 100);
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
      }

      // Validate file type
      if (!this.validateFileType(file)) {
        this.showError(`File type not supported: ${file.name}`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.showError(`File too large (max 10MB): ${file.name}`);
        return;
      }

      // Preview and process file
      this.previewFile(file);
      this.uploadFile(file);
    });

    // Hide progress after 1 second
    setTimeout(() => {
      if (uploadProgress) uploadProgress.classList.add("hidden");
    }, 1000);
  },

  // Validate file type
  validateFileType: function (file) {
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/tiff",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return validTypes.includes(file.type);
  },

  // Preview file (for images and PDFs)
  previewFile: function (file) {
    const previewContainer = document.getElementById("document-previews");
    if (!previewContainer) return;

    const previewElement = document.createElement("div");
    previewElement.className = "document-preview";

    const docInfo = document.createElement("div");
    docInfo.className = "document-info";

    // File name and size
    const docName = document.createElement("div");
    docName.className = "document-name";
    docName.textContent = file.name;

    const docSize = document.createElement("div");
    docSize.className = "document-size";
    docSize.textContent = this.formatFileSize(file.size);

    docInfo.appendChild(docName);
    docInfo.appendChild(docSize);

    // Thumbnail preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const thumbnail = document.createElement("img");
        thumbnail.src = e.target.result;
        thumbnail.className = "document-thumbnail";
        previewElement.appendChild(thumbnail);
      };
      reader.readAsDataURL(file);
    } else {
      // Icon for non-image files
      const icon = document.createElement("div");
      icon.className = "document-icon";
      if (file.type === "application/pdf") {
        icon.innerHTML = '<i class="fas fa-file-pdf"></i>';
      } else if (file.type.includes("word")) {
        icon.innerHTML = '<i class="fas fa-file-word"></i>';
      } else {
        icon.innerHTML = '<i class="fas fa-file"></i>';
      }
      previewElement.appendChild(icon);
    }

    previewElement.appendChild(docInfo);

    // Add status indicator
    const statusIndicator = document.createElement("div");
    statusIndicator.className = "upload-status pending";
    statusIndicator.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    previewElement.appendChild(statusIndicator);

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-document-btn";
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener("click", function () {
      previewElement.remove();
    });
    previewElement.appendChild(removeBtn);

    previewContainer.appendChild(previewElement);

    // Store reference to status indicator for later update
    file.statusElement = statusIndicator;
  },

  // Format file size
  formatFileSize: function (bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  },

  // Upload file to server
  uploadFile: function (file) {
    // In a real implementation, this would use fetch or XMLHttpRequest to upload to server
    // For demo purposes, we'll simulate the upload
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate

      if (success) {
        if (file.statusElement) {
          file.statusElement.className = "upload-status success";
          file.statusElement.innerHTML =
            '<i class="fas fa-check"></i> Uploaded';
        }

        // Add to document list
        this.addDocumentToList({
          id: "DOC-" + Math.floor(Math.random() * 1000000),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          verified: false,
        });
      } else {
        if (file.statusElement) {
          file.statusElement.className = "upload-status failure";
          file.statusElement.innerHTML =
            '<i class="fas fa-exclamation-circle"></i> Failed';
        }
        this.showError(`Failed to upload ${file.name}`);
      }
    }, 1500);
  },

  // Show error message
  showError: function (message) {
    const errorContainer = document.getElementById("document-error");
    if (!errorContainer) return;

    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");

    setTimeout(() => {
      errorContainer.classList.add("hidden");
    }, 5000);
  },

  // Add document to the list
  addDocumentToList: function (doc) {
    const documentList = document.getElementById("document-list");
    if (!documentList) return;

    const listItem = document.createElement("tr");
    listItem.innerHTML = `
      <td>${doc.name}</td>
      <td>${this.getDocumentTypeName(doc.type)}</td>
      <td>${this.formatFileSize(doc.size)}</td>
      <td>${new Date(doc.uploadDate).toLocaleDateString()}</td>
      <td>
        <span class="verification-status ${
          doc.verified ? "verified" : "unverified"
        }">
          ${
            doc.verified
              ? '<i class="fas fa-check-circle"></i> Verified'
              : '<i class="fas fa-clock"></i> Pending'
          }
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline view-document" data-id="${
          doc.id
        }">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline verify-document" data-id="${
          doc.id
        }">
          <i class="fas fa-shield-alt"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-document" data-id="${
          doc.id
        }">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    // Add event listeners for buttons
    const viewBtn = listItem.querySelector(".view-document");
    viewBtn.addEventListener("click", () => this.viewDocument(doc.id));

    const verifyBtn = listItem.querySelector(".verify-document");
    verifyBtn.addEventListener("click", () => this.verifyDocument(doc.id));

    const deleteBtn = listItem.querySelector(".delete-document");
    deleteBtn.addEventListener("click", () =>
      this.deleteDocument(doc.id, listItem)
    );

    documentList.appendChild(listItem);
  },

  // Get friendly document type name
  getDocumentTypeName: function (mimeType) {
    switch (mimeType) {
      case "application/pdf":
        return "PDF Document";
      case "image/jpeg":
        return "JPEG Image";
      case "image/png":
        return "PNG Image";
      case "image/tiff":
        return "TIFF Image";
      case "application/msword":
        return "Word Document";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "Word Document";
      default:
        return "Unknown Type";
    }
  },

  // View document
  viewDocument: function (documentId) {
    // In a real app, this would open the document in a viewer or new tab
    console.log(`Viewing document ${documentId}`);
    alert(`Viewing document ${documentId}`);
  },

  // Verify document
  verifyDocument: function (documentId) {
    // In a real app, this would initiate the document verification process
    console.log(`Verifying document ${documentId}`);

    // Show verification options
    const verificationMethodsModal = document.getElementById(
      "verification-methods-modal"
    );
    if (verificationMethodsModal) {
      verificationMethodsModal.classList.remove("hidden");

      // Store document ID for use in verification process
      verificationMethodsModal.setAttribute("data-document-id", documentId);
    }
  },

  // Delete document
  deleteDocument: function (documentId, listItemElement) {
    if (confirm("Are you sure you want to delete this document?")) {
      // In a real app, this would send a delete request to the server
      console.log(`Deleting document ${documentId}`);

      // Remove from UI
      if (listItemElement) {
        listItemElement.remove();
      }
    }
  },

  // Setup document list functionality
  setupDocumentList: function () {
    const documentList = document.getElementById("document-list");
    if (!documentList) return;

    // Demo documents
    const demoDocuments = [
      {
        id: "DOC-123456",
        name: "Property_Deed_2023.pdf",
        type: "application/pdf",
        size: 1258291,
        uploadDate: "2023-08-15T10:30:00Z",
        verified: true,
      },
      {
        id: "DOC-789012",
        name: "Land_Survey_Report.pdf",
        type: "application/pdf",
        size: 3582109,
        uploadDate: "2023-08-10T14:15:00Z",
        verified: false,
      },
      {
        id: "DOC-345678",
        name: "Property_Tax_Receipt.jpg",
        type: "image/jpeg",
        size: 723145,
        uploadDate: "2023-08-05T09:45:00Z",
        verified: true,
      },
    ];

    // Clear any existing items
    documentList.innerHTML = "";

    // Add demo documents to list
    demoDocuments.forEach((doc) => this.addDocumentToList(doc));
  },

  // DigiLocker Integration =======================

  // Setup DigiLocker integration
  setupDigiLockerIntegration: function () {
    const digilockerButton = document.getElementById("digilocker-btn");
    if (!digilockerButton) return;

    digilockerButton.addEventListener("click", () =>
      this.initiateDigiLockerAuth()
    );

    // Setup verification methods
    const verificationMethods = document.querySelectorAll(
      ".verification-method"
    );
    verificationMethods.forEach((method) => {
      method.addEventListener("click", () => {
        const methodType = method.getAttribute("data-method");
        const documentId = document
          .getElementById("verification-methods-modal")
          .getAttribute("data-document-id");

        if (methodType === "digilocker") {
          this.initiateDigiLockerAuth(documentId);
        } else if (methodType === "manual") {
          this.initiateManualVerification(documentId);
        }

        // Hide modal
        document
          .getElementById("verification-methods-modal")
          .classList.add("hidden");
      });
    });

    // Close verification methods modal
    const closeVerificationModal = document.getElementById(
      "close-verification-modal"
    );
    if (closeVerificationModal) {
      closeVerificationModal.addEventListener("click", () => {
        document
          .getElementById("verification-methods-modal")
          .classList.add("hidden");
      });
    }
  },

  // Initiate DigiLocker authentication
  initiateDigiLockerAuth: function (documentId = null) {
    console.log("Initiating DigiLocker authentication");

    // In a real app, this would redirect to DigiLocker OAuth flow
    // For demo purposes, we'll simulate the process

    // Show DigiLocker modal
    const digilockerModal = document.getElementById("digilocker-modal");
    if (digilockerModal) {
      digilockerModal.classList.remove("hidden");

      // If a document ID was provided, store it for later
      if (documentId) {
        digilockerModal.setAttribute("data-document-id", documentId);
      }
    }
  },

  // Complete DigiLocker authentication
  completeDigiLockerAuth: function (success) {
    const digilockerModal = document.getElementById("digilocker-modal");
    if (!digilockerModal) return;

    digilockerModal.classList.add("hidden");

    if (success) {
      this.showDigiLockerDocuments();
    } else {
      this.showError("Failed to authenticate with DigiLocker");
    }
  },

  // Show DigiLocker documents
  showDigiLockerDocuments: function () {
    // In a real app, this would fetch documents from DigiLocker API
    // For demo purposes, we'll simulate the response

    const digilockerDocuments = [
      {
        id: "DL-123456",
        name: "Income Tax Return.pdf",
        issuer: "Income Tax Department",
        docType: "ITR",
        issueDate: "2023-03-31T00:00:00Z",
      },
      {
        id: "DL-789012",
        name: "Aadhaar Card.pdf",
        issuer: "UIDAI",
        docType: "Aadhaar",
        issueDate: "2021-05-15T00:00:00Z",
      },
      {
        id: "DL-345678",
        name: "PAN Card.pdf",
        issuer: "Income Tax Department",
        docType: "PAN",
        issueDate: "2020-10-10T00:00:00Z",
      },
      {
        id: "DL-901234",
        name: "Property Registration.pdf",
        issuer: "Sub-Registrar Office",
        docType: "Property",
        issueDate: "2022-08-22T00:00:00Z",
      },
    ];

    const digilockerDocumentsList = document.getElementById(
      "digilocker-documents-list"
    );
    if (!digilockerDocumentsList) return;

    // Clear any existing items
    digilockerDocumentsList.innerHTML = "";

    // Add documents to list
    digilockerDocuments.forEach((doc) => {
      const listItem = document.createElement("div");
      listItem.className = "digilocker-document";
      listItem.innerHTML = `
        <div class="document-icon">
          <i class="fas fa-file-pdf"></i>
        </div>
        <div class="document-details">
          <div class="document-name">${doc.name}</div>
          <div class="document-issuer">Issued by: ${doc.issuer}</div>
          <div class="document-date">Issue Date: ${new Date(
            doc.issueDate
          ).toLocaleDateString()}</div>
        </div>
        <div class="document-actions">
          <button class="btn btn-primary import-document" data-id="${doc.id}">
            Import
          </button>
        </div>
      `;

      // Add event listener for import button
      const importBtn = listItem.querySelector(".import-document");
      importBtn.addEventListener("click", () =>
        this.importDigiLockerDocument(doc)
      );

      digilockerDocumentsList.appendChild(listItem);
    });

    // Show DigiLocker documents modal
    const digilockerDocumentsModal = document.getElementById(
      "digilocker-documents-modal"
    );
    if (digilockerDocumentsModal) {
      digilockerDocumentsModal.classList.remove("hidden");
    }
  },

  // Import DigiLocker document
  importDigiLockerDocument: function (document) {
    console.log(`Importing DigiLocker document ${document.id}`);

    // In a real app, this would fetch the document from DigiLocker API and store it
    // For demo purposes, we'll simulate the process

    // Add document to our list with verified status
    this.addDocumentToList({
      id: document.id,
      name: document.name,
      type: "application/pdf", // Assuming PDF
      size: 1024 * 1024 * (1 + Math.random()), // Random size between 1-2MB
      uploadDate: new Date().toISOString(),
      verified: true, // Documents from DigiLocker are pre-verified
    });

    // Hide DigiLocker documents modal
    const digilockerDocumentsModal = document.getElementById(
      "digilocker-documents-modal"
    );
    if (digilockerDocumentsModal) {
      digilockerDocumentsModal.classList.add("hidden");
    }

    // Show success message
    alert(`Successfully imported document: ${document.name}`);
  },

  // Initiate manual verification
  initiateManualVerification: function (documentId) {
    console.log(`Initiating manual verification for document ${documentId}`);

    // In a real app, this would start the manual verification process
    // For demo purposes, we'll just show a message
    alert(
      `Document ${documentId} has been submitted for manual verification. You will be notified when verification is complete.`
    );
  },
};

// Export for global use
window.EstateLink = window.EstateLink || {};
window.EstateLink.DocumentManager = DocumentManager;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  DocumentManager.init();
});
