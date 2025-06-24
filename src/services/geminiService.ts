// Temporary solution until environment variables are properly set up
const GEMINI_API_KEY = 'AIzaSyDDOZPuhqfVx23iXnPWwIoJ1Nvhj6yE0EU'; // IMPORTANT: Replace with your real API key

const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

export interface SymptomAnalysisResponse {
  responseText: string;
  identifiedSymptom: string | null;
  isUrgent: boolean;
}

// Bu fonksiyon, hastanın girdisini alıp özel bir talimata dönüştürecek.
export const getSymptomAnalysis = async (userInput: string): Promise<SymptomAnalysisResponse> => {
  const prompt = `
    Context: You are an AI assistant in a health app for cancer patients. Your role is to analyze user input and provide a structured JSON response in Turkish.

    Patient's input: "${userInput}"

    Task:
    1.  Analyze the input for symptoms (pain, nausea, fatigue, etc.).
    2.  Provide an empathetic and reassuring response in Turkish.
    3.  Identify if any mentioned symptoms are urgent (e.g., "severe chest pain," "uncontrollable bleeding," "difficulty breathing").
    4.  Extract the primary symptom name in Turkish if one is clearly mentioned.

    Output Format:
    Return ONLY a valid JSON object. Do not add any text or markdown (like \`\`\`json) before or after the JSON.
    The JSON object MUST have this structure:
    {
      "responseText": "Your empathetic, reassuring response in Turkish.",
      "identifiedSymptom": "The main symptom identified in Turkish (e.g., 'baş ağrısı', 'mide bulantısı'), or null if none is clear.",
      "isUrgent": true if urgent symptoms are detected, otherwise false.
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBodyText = await response.text();
      let errorMessage = `API isteği başarısız oldu (HTTP ${response.status})`;
      try {
        const errorJson = JSON.parse(errorBodyText);
        // Google AI API'sinin standart hata formatından mesajı al
        if (errorJson.error && errorJson.error.message) {
          errorMessage = errorJson.error.message;
        } else {
          errorMessage = errorBodyText;
        }
      } catch (e) {
        // JSON parse edilemezse, ham metni kullan
        errorMessage = errorBodyText;
      }
      console.error('API request failed:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    const responseContent = data.candidates[0].content.parts[0].text;
    // Yanıtın JSON formatında olduğundan emin olalım
    try {
      // Bazen Gemini, JSON'ı ```json ... ``` bloğu içinde dönebilir.
      const cleanedResponse = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('Failed to parse JSON from Gemini response:', responseContent, e);
      // Eğer parse edilemezse, ham metni bir hata mesajıyla gösterelim.
      return {
        responseText: `Anladım ama yanıtı işlerken bir sorun oluştu. Gemini: "${responseContent}"`,
        identifiedSymptom: null,
        isUrgent: false,
      };
    }

  } catch (error: any) {
    console.error('Failed to fetch or parse Gemini reply:', error);
    return {
      responseText: `Üzgünüm, bir sorunla karşılaştım. Lütfen daha sonra tekrar deneyin.\n\nDetay: ${error.message}`,
      identifiedSymptom: null,
      isUrgent: false,
    };
  }
}; 