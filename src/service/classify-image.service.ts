import api from "./api.service";

// Types correspondant à la réponse de votre API Django
export interface ApiPrediction {
  model_name: string;
  classe_id: number;
  nom_classe: string;
  probabilite: number;
}

export interface ApiResponse {
  training_times: {
    CNN: number;
    MobileNetV2: number;
    GoogleNet?: number;
  };
  predictions: {
    cnn: ApiPrediction;
    mobileNetv2: ApiPrediction;
    googleNet?: ApiPrediction;
  };
}

// Types pour l'interface utilisateur (format normalisé)
export interface ModelPrediction {
  model_name: string;
  prediction: string;
  confidence: number;
  processing_time: number;
  class_id: number;
}

export interface ClassificationResponse {
  predictions: ModelPrediction[];
  total_time: number;
}

/**
 * Transforme la réponse de l'API Django en format utilisable par l'interface
 */
export const transformApiResponse = (apiResponse: ApiResponse): ClassificationResponse => {
  const predictions: ModelPrediction[] = [
    {
      model_name: apiResponse.predictions.cnn.model_name,
      prediction: apiResponse.predictions.cnn.nom_classe,
      confidence: apiResponse.predictions.cnn.probabilite,
      processing_time: apiResponse.training_times.CNN,
      class_id: apiResponse.predictions.cnn.classe_id,
    },
    {
      model_name: apiResponse.predictions.mobileNetv2.model_name,
      prediction: apiResponse.predictions.mobileNetv2.nom_classe,
      confidence: apiResponse.predictions.mobileNetv2.probabilite,
      processing_time: apiResponse.training_times.MobileNetV2,
      class_id: apiResponse.predictions.mobileNetv2.classe_id,
    },
  ];

  // Ajouter GoogleNet s'il est disponible
  if (apiResponse.predictions.googleNet) {
    predictions.push({
      model_name: apiResponse.predictions.googleNet.model_name,
      prediction: apiResponse.predictions.googleNet.nom_classe,
      confidence: apiResponse.predictions.googleNet.probabilite,
      processing_time: apiResponse.training_times.GoogleNet || 0,
      class_id: apiResponse.predictions.googleNet.classe_id,
    });
  }

  // Calculer le temps total
  const total_time = Object.values(apiResponse.training_times).reduce((sum, time) => sum + time, 0);

  return {
    predictions,
    total_time,
  };
};

/**
 * Envoie une image au backend pour classification avec les 3 modèles
 */
export const classifyImage = async (file: File): Promise<ClassificationResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ApiResponse>(
    `/predict`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    }
  );

  // Transformer la réponse API en format utilisable
  return transformApiResponse(response.data);
};