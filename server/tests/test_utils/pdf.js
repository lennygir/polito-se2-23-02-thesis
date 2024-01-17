"use strict";
const fs = require("fs");
const PDFDocument = require("pdfkit");

/**
 * Writes a PDF to the filesystem in the given path
 * @param path
 * @param data
 * @returns {Promise<void>}
 */
exports.writePDF = function (path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Reads a pdf from the path
 * @param path
 * @returns {Promise<Buffer>}
 */
exports.readPDF = function (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Creates a simple test PDF
 * @returns {Promise<Buffer>}
 */
exports.createPDF = function () {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument();

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });

    doc.on("error", (error) => {
      reject(error);
    });

    // Add content to the PDF (e.g., text, images)
    for (let i = 0; i < 100; i++) {
      doc.text("Hello, this is an in-memory PDF!");
    }
    doc.end();
  });
};
