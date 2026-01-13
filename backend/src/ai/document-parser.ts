import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import xlsx from 'xlsx';
import { logger } from '../config/logger';
import { AppError } from '../utils/errors';

export interface ParsedDocument {
  text: string;
  metadata?: {
    pages?: number;
    author?: string;
    title?: string;
    createdAt?: Date;
  };
}

export class DocumentParser {
  async parsePDF(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const data = await pdfParse(buffer);
      return {
        text: data.text,
        metadata: {
          pages: data.numpages,
          author: data.info?.Author,
          title: data.info?.Title,
        },
      };
    } catch (error) {
      logger.error('Failed to parse PDF', error);
      throw new AppError('Failed to parse PDF document', 500);
    }
  }

  async parseDOCX(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return {
        text: result.value,
      };
    } catch (error) {
      logger.error('Failed to parse DOCX', error);
      throw new AppError('Failed to parse Word document', 500);
    }
  }

  async parseXLSX(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      let text = '';

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        text += `Sheet: ${sheetName}\n`;
        text += xlsx.utils.sheet_to_txt(sheet);
        text += '\n\n';
      });

      return { text };
    } catch (error) {
      logger.error('Failed to parse XLSX', error);
      throw new AppError('Failed to parse Excel document', 500);
    }
  }

  async parse(buffer: Buffer, mimeType: string): Promise<ParsedDocument> {
    switch (mimeType) {
      case 'application/pdf':
        return this.parsePDF(buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.parseDOCX(buffer);
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return this.parseXLSX(buffer);
      default:
        throw new AppError(`Unsupported file type: ${mimeType}`, 400);
    }
  }
}
