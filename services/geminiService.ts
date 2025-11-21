import { GoogleGenAI } from "@google/genai";
import { ArticleParams, GeneratedContent } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client
const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to generate image using Gemini Nano/Flash Image model
const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
  try {
    // Scientific Prompt Engineering for Image Model
    // RULE 1 & 2: Candid iPhone 16 Pro style & Muslim Syari compliance
    const enhancedPrompt = `
      captured with iPhone 16 Pro, candid photography, natural lighting, imperfect realistic texture, no studio setup, 
      if subject is female then she must be wearing modern muslim syari hijab, modest clothing,
      ${prompt}
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: enhancedPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9" // Cinematic landscape for blogs
        }
      }
    });

    // Iterate to find the image part (InlineData)
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data; // Returns Base64 string
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Visual Core Error:", error);
    return null; // Fail gracefully
  }
};

export const generateBlogContent = async (params: ArticleParams): Promise<GeneratedContent> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const { topic, location, tone, style, keyword, visualStyle, textColor, backgroundColor, products } = params;

  // 1. SCIENTIFIC LOGIC: Language Determinism
  const isIndonesianContext = ['Indonesia', 'Jakarta', 'Bali', 'Surabaya'].includes(location) || 
                              location.toLowerCase().includes('indonesia');
  
  const targetLanguage = isIndonesianContext ? "Bahasa Indonesia (Indonesian)" : "English";
  const localeInstruction = isIndonesianContext 
    ? "Wajib menulis ARTIKEL INI SEPENUHNYA DALAM BAHASA INDONESIA yang baku dan natural." 
    : "Write this article entirely in fluent, professional English.";

  // 2. PRODUCT INJECTION LOGIC
  const productList = products.filter(p => p.name && p.url).map(p => `- Name: ${p.name}, Link: ${p.url}`).join('\n');
  const hasProducts = productList.length > 0;
  
  const productInjectionInstruction = hasProducts 
    ? `
      AFFILIATE INJECTION PROTOCOL (STRICT):
      You have a list of products to recommend. You MUST insert a "Product Card" HTML block for EACH product in natural, relevant positions within the content (e.g., after a problem is described, suggest the product as a solution).
      
      STYLE FOR PRODUCT CARD (Shopee/Marketplace Style):
      <div style="border: 1px solid #fdba74; background-color: #fff7ed; border-radius: 12px; padding: 16px; margin: 25px 0; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 2px 4px rgba(251, 146, 60, 0.1);">
         <div style="font-weight: bold; color: #ea580c; font-size: 1.1em;">🛍️ Rekomendasi Pilihan: [Product Name]</div>
         <p style="margin: 0; font-size: 0.95em; color: #475569;">[Write a short, persuasive 1-sentence reason why this product helps based on the article context]</p>
         <a href="[Product Link]" target="_blank" rel="nofollow" style="background-color: #ea580c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; text-align: center; display: inline-block; align-self: start; margin-top: 5px;">Beli Sekarang di Shopee &rarr;</a>
      </div>

      PRODUCT LIST TO INJECT:
      ${productList}
    ` 
    : "";

  // 3. SCIENTIFIC LOGIC: Strict Visual Definitions (CSS)
  let styleInstructions = "";
  switch (visualStyle) {
    case 'AsriStyle':
      styleInstructions = `
        STYLE: ASRI STYLE (CUSTOM)
        - Container/Wrapper: color: ${textColor}; background-color: ${backgroundColor}; padding: 20px; border-radius: 8px;
        - Headers (h2, h3): color: #1e293b; font-family: sans-serif; font-weight: 700; margin-top: 30px;
        - Paragraphs: line-height: 1.7; margin-bottom: 15px;
        
        - QUOTE / INTERMEZZO STYLE (Reference Image 3):
          font-style: italic; color: #64748b; border-left: none; padding: 10px 0; display: block; margin: 20px 0;
        
        - HIGHLIGHT / SUB-POINT STYLE (Reference Image 1):
          background-color: #f0f9ff; border-left: 5px solid #60a5fa; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;
        
        - KEY TAKEAWAY / CONCLUSION BOX (Reference Image 2):
          background-color: #fffbeb; border: 1px dashed #fbbf24; padding: 20px; border-radius: 8px; margin-top: 40px; text-align: center;
      `;
      break;
    case 'Corporate':
      styleInstructions = `
        STYLE: CORPORATE PROFESSIONAL
        - Container: color: ${textColor}; background-color: ${backgroundColor};
        - Headers (h2, h3): color: #1e3a8a (Dark Blue)
        - Paragraphs: color: ${textColor}; font-family: 'Arial', sans-serif
        - Key Takeaway Box: background-color: #eff6ff (Blue 50), border-left: 4px solid #2563eb
      `;
      break;
    case 'Warm':
      styleInstructions = `
        STYLE: WARM EDITORIAL
        - Container: color: ${textColor}; background-color: ${backgroundColor};
        - Headers (h2, h3): color: #78350f (Amber 900), font-family: 'Georgia', serif
        - Paragraphs: color: ${textColor}; font-family: 'Georgia', serif
        - Key Takeaway Box: background-color: #fffbeb (Amber 50), border: 1px dashed #d97706, border-radius: 8px
      `;
      break;
    case 'Vibrant':
      styleInstructions = `
        STYLE: VIBRANT & BOLD
        - Container: color: ${textColor}; background-color: ${backgroundColor};
        - Headers (h2, h3): color: #dc2626 (Red 600), text-transform: uppercase, letter-spacing: 0.05em
        - Paragraphs: color: ${textColor}; font-weight: 400
        - Key Takeaway Box: background-color: #fff1f2 (Rose 50), border: 2px solid #e11d48
      `;
      break;
    case 'Minimalist':
    default:
      styleInstructions = `
        STYLE: MINIMALIST MODERN
        - Container: color: ${textColor}; background-color: ${backgroundColor};
        - Headers (h2, h3): color: #111827 (Gray 900)
        - Paragraphs: color: ${textColor}; line-height: 1.8
        - Key Takeaway Box: background-color: #f9fafb (Gray 50), border: 1px solid #e5e7eb
      `;
      break;
  }

  const prompt = `
    Role: You are a Senior SEO Content Scientist and Front-End Engineer.
    Task: Generate a high-quality blog post compatible with Blogger/Blogspot.
    
    ----------------------------------------
    CRITICAL CONFIGURATION:
    ----------------------------------------
    1. TARGET LANGUAGE: ${targetLanguage}.
    2. ${localeInstruction}
    3. VISUAL STYLE: ${visualStyle} (Strictly adhere to the CSS rules below).
    
    ----------------------------------------
    INPUT PARAMETERS:
    ----------------------------------------
    - Topic: "${topic}"
    - Keyword: "${keyword}"
    - Location Context: ${location}
    - Tone: ${tone}
    - Content Style: ${style}

    ----------------------------------------
    STYLING RULES (INLINE CSS MANDATORY):
    ----------------------------------------
    You must inject inline 'style="..."' attributes into every HTML tag.
    ${styleInstructions}
    
    ${productInjectionInstruction}

    ----------------------------------------
    IMAGE PLACEHOLDER PROTOCOL:
    ----------------------------------------
    - DO NOT generate <img> tags with URLs.
    - Instead, generate exactly TWO (2) placeholders where images should be.
    - FORMAT: [[IMAGE_PROMPT: <detailed_english_description>]]
    - If the prompt describes a woman, explicitly add "Muslim woman wearing Syari Hijab".

    ----------------------------------------
    OUTPUT STRUCTURE (STRICT FORMATTING):
    ----------------------------------------
    You MUST return the response in two distinct parts using the following separators:
    
    <!--TITLE_START-->
    (Write the catchy SEO Title here, plain text no HTML tags)
    <!--TITLE_END-->

    <!--CONTENT_START-->
    (Write the HTML Body here. DO NOT include <html>, <head>, or <body> tags. Wrap in a main <div> with container styles.)
    <!--CONTENT_END-->

    ----------------------------------------
    EXECUTE:
    ----------------------------------------
    Write the article now in ${targetLanguage}.
  `;

  try {
    // STEP 1: Generate Text Structure
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: {
        temperature: 0.3, 
        topK: 30,
        topP: 0.8,
      }
    });

    const fullText = response.text || "";

    // STEP 2: Parse Title and Content
    const titleMatch = fullText.match(/<!--TITLE_START-->([\s\S]*?)<!--TITLE_END-->/);
    const contentMatch = fullText.match(/<!--CONTENT_START-->([\s\S]*?)<!--CONTENT_END-->/);

    let title = titleMatch ? titleMatch[1].trim() : "Untitled Article";
    let htmlContent = contentMatch ? contentMatch[1].trim() : (fullText.replace(/<!--.*?-->/g, '').trim()); // Fallback

    // Cleanup markdown code blocks if present
    htmlContent = htmlContent.replace(/^```html/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();

    // STEP 3: Detect Visual Placeholders
    const placeholderRegex = /\[\[IMAGE_PROMPT: (.*?)\]\]/g;
    const matches = [...htmlContent.matchAll(placeholderRegex)];

    // STEP 4: Parallel Visual Synthesis
    if (matches.length > 0) {
      const imagePromises = matches.map(async (match) => {
        const fullPlaceholder = match[0];
        const promptText = match[1];
        const base64Data = await generateImageFromPrompt(promptText);
        return { placeholder: fullPlaceholder, data: base64Data };
      });

      const generatedImages = await Promise.all(imagePromises);

      generatedImages.forEach((img) => {
        if (img.data) {
          const imgTag = `<img src="data:image/png;base64,${img.data}" alt="Generated Image" style="width: 100%; height: auto; border-radius: 8px; margin: 20px 0; display: block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />`;
          htmlContent = htmlContent.replace(img.placeholder, imgTag);
        } else {
          htmlContent = htmlContent.replace(img.placeholder, '');
        }
      });
    }

    return { title, htmlBody: htmlContent };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};