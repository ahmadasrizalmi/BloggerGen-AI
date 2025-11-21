import { GoogleGenAI, Type } from "@google/genai";
import { ArticleParams, GeneratedContent } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client
const ai = new GoogleGenAI({ apiKey: apiKey });

// --- HELPER: IMAGE GENERATION ---
const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
  try {
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
          aspectRatio: "16:9" 
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data; 
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Visual Core Error:", error);
    return null; 
  }
};

// --- HELPER: SMART WIDGET AI (Description & CTA) ---
export const generateProductMetadata = async (productTitle: string): Promise<{ description: string; cta_label: string }> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Analisa judul produk ini: "${productTitle}".
    Tugasmu adalah membuat dua hal:
    1. "description": Deskripsi singkat (15-20 kata), persuasif, bahasa Indonesia natural, fokus benefit.
    2. "cta_label": Label Call-to-Action yang sangat pendek (max 2-3 kata), huruf kapital, dan nendang (contoh: "DISKON 50%", "TERLARIS", "GRATIS ONGKIR"). Jangan gunakan nama brand.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            cta_label: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Widget AI Error:", error);
    return { description: "Produk rekomendasi terbaik untuk kebutuhan Anda.", cta_label: "CEK DETAIL" };
  }
};

// --- MAIN: BLOG GENERATION ---
export const generateBlogContent = async (params: ArticleParams): Promise<GeneratedContent> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const { topic, location, tone, style, keyword, visualStyle, textColor, backgroundColor, productWidgetHtml } = params;

  const isIndonesianContext = ['Indonesia', 'Jakarta', 'Bali', 'Surabaya'].includes(location) || 
                              location.toLowerCase().includes('indonesia');
  
  const targetLanguage = isIndonesianContext ? "Bahasa Indonesia (Indonesian)" : "English";
  const localeInstruction = isIndonesianContext 
    ? "Wajib menulis ARTIKEL INI SEPENUHNYA DALAM BAHASA INDONESIA yang baku dan natural." 
    : "Write this article entirely in fluent, professional English.";

  // WIDGET PLACEHOLDER LOGIC
  // We do not pass the massive HTML string to the prompt. We use a placeholder.
  const hasWidget = !!productWidgetHtml && productWidgetHtml.length > 50;
  const widgetInstruction = hasWidget 
    ? `
      CRITICAL INSTRUCTION:
      You must insert the exact placeholder text "[[PRODUCT_WIDGET_HERE]]" naturally within the article.
      Best position: After the Introduction (H2 'Mengapa...' section) or before the Conclusion.
      Do NOT put it at the very end. Put it where a reader would likely want to buy a solution.
    ` 
    : "";

  let styleInstructions = "";
  switch (visualStyle) {
    case 'AsriStyle':
      styleInstructions = `
        STYLE: ASRI STYLE (CUSTOM)
        - Container/Wrapper: color: ${textColor}; background-color: ${backgroundColor}; padding: 20px; border-radius: 8px;
        - Headers (h2, h3): color: #1e293b; font-family: sans-serif; font-weight: 700; margin-top: 30px;
        - Paragraphs: line-height: 1.7; margin-bottom: 15px;
        - QUOTE / INTERMEZZO STYLE: font-style: italic; color: #64748b; border-left: none; padding: 10px 0; display: block; margin: 20px 0;
        - HIGHLIGHT / SUB-POINT STYLE: background-color: #f0f9ff; border-left: 5px solid #60a5fa; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;
        - KEY TAKEAWAY / CONCLUSION BOX: background-color: #fffbeb; border: 1px dashed #fbbf24; padding: 20px; border-radius: 8px; margin-top: 40px; text-align: center;
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
    Role: You are a Senior SEO Content Scientist.
    Task: Generate a high-quality blog post for Blogger.

    INPUT PARAMETERS:
    - Topic: "${topic}"
    - Keyword: "${keyword}"
    - Location: ${location}
    - Tone: ${tone}
    - Style: ${style}
    
    LANGUAGE RULES:
    1. ${localeInstruction}
    
    STRUCTURE:
    1. Hook/Intro
    2. [[IMAGE_PROMPT: ...]] (Visual 1)
    3. Main Body (H2)
    4. ${widgetInstruction}
    5. Deep Dive (H3)
    6. [[IMAGE_PROMPT: ...]] (Visual 2)
    7. Conclusion with Key Takeaway Box

    STYLING (Inline CSS Mandatory):
    ${styleInstructions}

    OUTPUT FORMAT:
    <!--TITLE_START-->...<!--TITLE_END-->
    <!--CONTENT_START-->...<!--CONTENT_END-->
    
    IMAGE RULES:
    - Use [[IMAGE_PROMPT: <description>]] placeholder.
    - If female subject: "Muslim woman wearing Syari Hijab".
  `;

  try {
    // STEP 1: Text Generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: { temperature: 0.3 }
    });

    const fullText = response.text || "";
    
    // STEP 2: Parsing
    const titleMatch = fullText.match(/<!--TITLE_START-->([\s\S]*?)<!--TITLE_END-->/);
    const contentMatch = fullText.match(/<!--CONTENT_START-->([\s\S]*?)<!--CONTENT_END-->/);

    let title = titleMatch ? titleMatch[1].trim() : "Untitled Article";
    let htmlContent = contentMatch ? contentMatch[1].trim() : (fullText.replace(/<!--.*?-->/g, '').trim());
    htmlContent = htmlContent.replace(/^```html/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();

    // STEP 3: Post-Process Widget Injection
    if (hasWidget) {
      // Replace the placeholder with the actual widget HTML
      if (htmlContent.includes('[[PRODUCT_WIDGET_HERE]]')) {
        htmlContent = htmlContent.replace('[[PRODUCT_WIDGET_HERE]]', productWidgetHtml);
      } else {
        // Fallback: If AI forgot the placeholder, inject after the first closing </p> tag that follows an </h2>
        // Or just append after the first few paragraphs
        const fallbackRegex = /(<\/h2>[\s\S]*?<\/p>)/i;
        if (fallbackRegex.test(htmlContent)) {
           htmlContent = htmlContent.replace(fallbackRegex, "$1" + productWidgetHtml);
        } else {
           htmlContent += productWidgetHtml; // Last resort
        }
      }
    }

    // STEP 4: Image Synthesis
    const placeholderRegex = /\[\[IMAGE_PROMPT: (.*?)\]\]/g;
    const matches = [...htmlContent.matchAll(placeholderRegex)];

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
          const imgTag = `<img src="data:image/png;base64,${img.data}" alt="Generated Visual" style="width: 100%; height: auto; border-radius: 8px; margin: 20px 0; display: block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />`;
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