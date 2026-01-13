import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { AIServiceError } from '../utils/errors';
import { RiskLevel } from '@prisma/client';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export interface DocumentAnalysisResult {
  summary: string;
  keyPoints: string[];
  entities: {
    parties: string[];
    dates: string[];
    amounts: string[];
  };
  riskLevel: RiskLevel;
  riskFactors: string[];
  flags: string[];
}

export class AnalysisService {
  async analyzeDocument(
    text: string,
    documentType?: string
  ): Promise<DocumentAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(text, documentType);

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      return this.parseAnalysisResponse(responseText);
    } catch (error) {
      logger.error('AI analysis failed', error);
      throw new AIServiceError('Failed to analyze document', 'Claude');
    }
  }

  private buildAnalysisPrompt(text: string, documentType?: string): string {
    return `You are a legal due diligence expert analyzing documents for potential risks and key information.

Document Type: ${documentType || 'Unknown'}

Document Text:
${text.substring(0, 50000)} ${text.length > 50000 ? '...(truncated)' : ''}

Please analyze this document and provide:

1. A concise summary (2-3 paragraphs)
2. Key points (5-10 bullet points)
3. Entities mentioned:
   - Parties involved
   - Important dates
   - Financial amounts
4. Risk assessment:
   - Overall risk level (LOW, MEDIUM, HIGH, or CRITICAL)
   - Specific risk factors
   - Red flags or concerns
5. Any unusual clauses or provisions that require attention

Format your response as JSON with the following structure:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "entities": {
    "parties": ["..."],
    "dates": ["..."],
    "amounts": ["..."]
  },
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "riskFactors": ["..."],
  "flags": ["..."]
}`;
  }

  private parseAnalysisResponse(response: string): DocumentAnalysisResult {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || '',
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        entities: {
          parties: Array.isArray(parsed.entities?.parties)
            ? parsed.entities.parties
            : [],
          dates: Array.isArray(parsed.entities?.dates)
            ? parsed.entities.dates
            : [],
          amounts: Array.isArray(parsed.entities?.amounts)
            ? parsed.entities.amounts
            : [],
        },
        riskLevel: this.normalizeRiskLevel(parsed.riskLevel),
        riskFactors: Array.isArray(parsed.riskFactors)
          ? parsed.riskFactors
          : [],
        flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      };
    } catch (error) {
      logger.error('Failed to parse AI response', error);
      throw new AIServiceError('Failed to parse analysis results', 'Claude');
    }
  }

  private normalizeRiskLevel(level: string): RiskLevel {
    const normalized = level?.toUpperCase();
    if (normalized in RiskLevel) {
      return normalized as RiskLevel;
    }
    return RiskLevel.MEDIUM;
  }

  async answerQuestion(
    question: string,
    context: string
  ): Promise<string> {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Based on the following document context, please answer this question:

Question: ${question}

Context:
${context.substring(0, 50000)}

Provide a clear, concise answer based solely on the information in the document.`,
          },
        ],
      });

      return message.content[0].type === 'text'
        ? message.content[0].text
        : 'Unable to generate answer';
    } catch (error) {
      logger.error('Question answering failed', error);
      throw new AIServiceError('Failed to answer question', 'Claude');
    }
  }
}
