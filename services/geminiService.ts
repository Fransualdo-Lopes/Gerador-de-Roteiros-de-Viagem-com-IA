import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TravelPreferences, Itinerary } from "../types";

const mapBudgetToText = (level: string) => {
  switch (level) {
    case 'economic': return 'econômico (mochileiro)';
    case 'moderate': return 'moderado (conforto)';
    case 'luxury': return 'luxo (alto padrão)';
    default: return 'moderado';
  }
};

const mapTravelersToText = (type: string) => {
  switch (type) {
    case 'solo': return 'viajante solo';
    case 'couple': return 'casal';
    case 'family': return 'família com crianças';
    case 'friends': return 'grupo de amigos';
    default: return 'casal';
  }
};

const mapTransportToText = (type: string) => {
  switch (type) {
    case 'car': return 'Carro Próprio';
    case 'bus': return 'Ônibus de Viagem';
    case 'plane': return 'Avião';
    default: return 'Avião';
  }
};

export const generateTravelItinerary = async (prefs: TravelPreferences, userId: string): Promise<Itinerary> => {
  if (!process.env.API_KEY) {
    throw new Error("Chave de API não configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Atue como um agente de viagens especialista.
    Planeje uma viagem saindo de **${prefs.origin}** para **${prefs.destination}**.
    
    Detalhes da Viagem:
    - Duração: ${prefs.duration} dias.
    - Transporte: ${mapTransportToText(prefs.transportMode)}.
    - Perfil: ${mapTravelersToText(prefs.travelers)}.
    - Orçamento: ${mapBudgetToText(prefs.budgetLevel)}.
    - Interesses: ${prefs.interests.join(', ') || 'turismo geral, gastronomia local'}.
    
    Tarefas:
    1. Calcule a distância aproximada entre a origem e o destino.
    2. Estime o tempo de viagem considerando o meio de transporte escolhido (${mapTransportToText(prefs.transportMode)}).
    3. Crie um roteiro dia-a-dia detalhado.
    4. Forneça uma estimativa de orçamento total na moeda local (BRL se Brasil, ou moeda do destino convertido).
    
    A resposta deve ser estritamente em JSON seguindo o schema fornecido.
    Use português do Brasil para todo o conteúdo de texto. Adicione emojis aos temas dos dias.
  `;

  const activitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      time: { type: Type.STRING, description: "Horário sugerido (ex: 09:00)" },
      title: { type: Type.STRING, description: "Nome da atividade ou local" },
      description: { type: Type.STRING, description: "Breve descrição do que fazer" },
      location: { type: Type.STRING, description: "Endereço ou nome do local para mapa" },
      costEstimate: { type: Type.STRING, description: "Custo estimado (ex: Grátis, R$ 50,00)" },
      type: { type: Type.STRING, enum: ['sightseeing', 'food', 'activity', 'relax'], description: "Tipo da atividade" }
    },
    required: ["time", "title", "description", "location", "costEstimate", "type"]
  };

  const daySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      dayNumber: { type: Type.INTEGER },
      theme: { type: Type.STRING, description: "Tema do dia com Emoji (ex: 🏛️ Centro Histórico)" },
      activities: { type: Type.ARRAY, items: activitySchema }
    },
    required: ["dayNumber", "theme", "activities"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          origin: { type: Type.STRING },
          travelDistance: { type: Type.STRING, description: "Distância estimada (ex: 450 km)" },
          travelTime: { type: Type.STRING, description: "Tempo de viagem estimado (ex: 5h 30m de carro)" },
          totalBudgetEstimate: { type: Type.STRING },
          days: { type: Type.ARRAY, items: daySchema }
        },
        required: ["destination", "origin", "travelDistance", "travelTime", "totalBudgetEstimate", "days"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Falha ao gerar roteiro.");

  const jsonResult = JSON.parse(text);

  // Enforce types and add system fields
  const itinerary: Itinerary = {
    id: crypto.randomUUID(),
    userId: userId,
    createdAt: new Date().toISOString(),
    destination: jsonResult.destination,
    origin: prefs.origin, // Ensure we keep user input if AI varies slightly
    transportMode: prefs.transportMode,
    travelDistance: jsonResult.travelDistance,
    travelTime: jsonResult.travelTime,
    totalBudgetEstimate: jsonResult.totalBudgetEstimate,
    days: jsonResult.days,
    // Add a placeholder image based on destination (random seed)
    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(jsonResult.destination)}/800/400`
  };

  return itinerary;
};