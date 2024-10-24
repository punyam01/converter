const { PDFDocument } = require("pdf-lib");
const { Document, Packer, Paragraph } = require("docx");
const { PDFImage } = require("pdf-image");
const pdf = require("pdf-parse");
const fs = require("fs");

// Convert PDF to plain text
async function convertToText(pdfPath) {
  try {
    const existingPdfBytes = fs.readFileSync(pdfPath);

    const data = await pdf(existingPdfBytes);
    const fullText = data.text;

    return fullText.trim();
  } catch (error) {
    console.log(error);
  }
}

// Convert PDF to Word (docx)
async function convertToWord(pdfPath) {
  try {
    
    // Read the PDF file
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Use pdf-parse to extract text from the PDF
    const data = await pdf(existingPdfBytes);
    const fullText = data.text; // Extracted text from the PDF
    
    // Create a new Word document
    const doc = new Document();
    console.log("Word document created successfully");
    const lines = fullText.split("\n").filter(line => line.trim().length > 0);  // Filter out empty lines

    // Log the lines that are being converted to Paragraphs
    console.log("Lines to convert to Paragraphs:", lines);

    const paragraphs = lines.map(line => {
      console.log("Creating paragraph for line:", line); // Debugging each line
      return new Paragraph(line); // Create a paragraph for each line
    });
    doc.addSection({
      children: paragraphs,
    });
    const outputFilePath = `./public/temp/converted-${Date.now()}.docx`;
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputFilePath, buffer);

    return outputFilePath;
  } catch (error) {
    console.log(error);
  }
}

// Convert PDF to images (PNG)
async function convertToImages(pdfPath) {
  const pdfImage = new PDFImage(pdfPath);
  const imagePaths = await pdfImage.convertPage(0); // Convert only the first page for simplicity

  const outputFilePath = `./public/uploads/converted-${Date.now()}.png`;
  fs.renameSync(imagePaths[0], outputFilePath);

  return outputFilePath;
}

exports.fileConverter = async (req, res) => {
  try {
    const format = req.body.format; // format selected by user
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let convertedFilePath;

    if (format === "text") {
      console.log(req.file.path);

      const convertedData = await convertToText(req.file.path);

      convertedFilePath = `./public/temp/converted-${Date.now()}.txt`;
      fs.writeFileSync(convertedFilePath, convertedData);
    } else if (format === "word") {
      convertedFilePath = await convertToWord(req.file.path);
    } else if (format === "image") {
      convertedFilePath = await convertToImages(req.file.path);
    }

    res.download(convertedFilePath, (err) => {
      if (err) {
        console.log(err);
      }
      fs.unlinkSync(req.file.path); // Delete original uploaded PDF
      fs.unlinkSync(convertedFilePath); // Delete converted file after download
    });
  } catch (error) {
    res.status(500).send("Error converting PDF");
  }
};
