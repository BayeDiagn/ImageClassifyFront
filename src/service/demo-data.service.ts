import type { ApiResponse } from './classify-image.service';

/**
 * Génère des données de démonstration pour simuler la réponse de l'API
 */
export const generateDemoData = (): ApiResponse => {
  // Exemples de classes d'animaux
  const classes = [
    { id: 0, name: 'ant' },
    { id: 1, name: 'bee' },
    { id: 2, name: 'beetle' },
    { id: 3, name: 'butterfly' },
    { id: 4, name: 'cat' },
    { id: 5, name: 'dog' },
    { id: 6, name: 'bird' },
    { id: 7, name: 'beaver' },
    { id: 8, name: 'spider' },
    { id: 9, name: 'fish' },
  ];

  // Sélectionner une classe aléatoire comme prédiction principale
  const mainClass = classes[Math.floor(Math.random() * classes.length)];
  
  // Générer des prédictions légèrement différentes pour chaque modèle
  const generatePrediction = (modelName: string, baseConfidence: number) => {
    // Parfois le modèle prédit une classe différente
    const predictDifferent = Math.random() < 0.3; // 30% de chance
    const selectedClass = predictDifferent 
      ? classes[Math.floor(Math.random() * classes.length)]
      : mainClass;
    
    return {
      model_name: modelName,
      classe_id: selectedClass.id,
      nom_classe: selectedClass.name,
      probabilite: baseConfidence + (Math.random() * 0.15 - 0.075), // Variation de ±7.5%
    };
  };

  return {
    training_times: {
      CNN: 0.5 + Math.random() * 1.5, // Entre 0.5 et 2 secondes
      MobileNetV2: 1 + Math.random() * 2, // Entre 1 et 3 secondes
      GoogleNet: 0.8 + Math.random() * 1.7, // Entre 0.8 et 2.5 secondes
    },
    predictions: {
      cnn: generatePrediction('CNN', 0.75),
      mobileNetv2: generatePrediction('MobileNetV2', 0.85),
      googlenet: generatePrediction('GoogleNet', 0.88),
    },
  };
};

/**
 * Simule un appel API avec un délai
 */
export const simulateClassification = (_file: File): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    // Simuler un temps de traitement réaliste (2-4 secondes)
    const delay = 2000 + Math.random() * 2000;
    
    setTimeout(() => {
      resolve(generateDemoData());
    }, delay);
  });
};

/**
 * Exemples de données prédéfinies pour différents scénarios
 */
export const demoScenarios = {
  // Tous les modèles d'accord avec haute confiance
  highAgreement: {
    training_times: {
      CNN: 1.234,
      MobileNetV2: 2.456,
      GoogleNet: 1.789,
    },
    predictions: {
      cnn: {
        model_name: 'CNN',
        classe_id: 4,
        nom_classe: 'cat',
        probabilite: 0.96,
      },
      resnet: {
        model_name: 'ResNet50',
        classe_id: 4,
        nom_classe: 'cat',
        probabilite: 0.98,
      },
      googlenet: {
        model_name: 'GoogleNet',
        classe_id: 4,
        nom_classe: 'cat',
        probabilite: 0.97,
      },
    },
  },

  // Modèles en désaccord
  disagreement: {
    training_times: {
      CNN: 0.876,
      MobileNetV2: 1.543,
      GoogleNet: 1.234,
    },
    predictions: {
      cnn: {
        model_name: 'CNN',
        classe_id: 7,
        nom_classe: 'beaver',
        probabilite: 0.65,
      },
      resnet: {
        model_name: 'ResNet50',
        classe_id: 3,
        nom_classe: 'butterfly',
        probabilite: 0.89,
      },
      googlenet: {
        model_name: 'GoogleNet',
        classe_id: 6,
        nom_classe: 'bird',
        probabilite: 0.82,
      },
    },
  },

  // Confiance faible
  lowConfidence: {
    training_times: {
      CNN: 1.123,
      MobileNetV2: 2.234,
      GoogleNet: 1.567,
    },
    predictions: {
      cnn: {
        model_name: 'CNN',
        classe_id: 2,
        nom_classe: 'beetle',
        probabilite: 0.45,
      },
      resnet: {
        model_name: 'ResNet50',
        classe_id: 2,
        nom_classe: 'beetle',
        probabilite: 0.52,
      },
      googlenet: {
        model_name: 'GoogleNet',
        classe_id: 2,
        nom_classe: 'beetle',
        probabilite: 0.48,
      },
    },
  },
} as const;
