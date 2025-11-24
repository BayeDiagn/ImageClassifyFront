# Image Classification - Frontend React

Application React moderne pour la classification d'images avec 3 modèles de Deep Learning.

## 🚀 Stack Technique

- **React 19.2** avec TypeScript
- **Vite 7.2** - Build tool ultra-rapide
- **Tailwind CSS 4** - Styling moderne
- **shadcn/ui** - Composants UI professionnels
- **TanStack Query** - Gestion de l'état asynchrone
- **React Dropzone** - Upload d'images drag & drop
- **Axios** - Requêtes HTTP

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Créer le fichier .env (copier depuis .env.example)
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

## ⚙️ Configuration

Modifiez le fichier `.env` pour pointer vers votre backend Django :

```env
VITE_API_URL=http://localhost:8000/api
```

## 🔌 Format de l'API Backend Django

L'application s'attend à recevoir les données suivantes depuis votre backend Django :

### Endpoint: `POST /api/classify/`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (File)

**Response:**
```json
{
  "success": true,
  "image_url": "https://...",
  "predictions": [
    {
      "model_name": "ResNet50",
      "prediction": "Golden Retriever",
      "confidence": 0.95,
      "processing_time": 0.234,
      "probabilities": [
        {
          "class_name": "Golden Retriever",
          "probability": 0.95
        },
        {
          "class_name": "Labrador",
          "probability": 0.03
        }
      ]
    },
    {
      "model_name": "VGG16",
      "prediction": "Golden Retriever",
      "confidence": 0.92,
      "processing_time": 0.189,
      "probabilities": [...]
    },
    {
      "model_name": "InceptionV3",
      "prediction": "Golden Retriever",
      "confidence": 0.97,
      "processing_time": 0.256,
      "probabilities": [...]
    }
  ],
  "total_time": 0.679
}
```

## 🎨 Exemple de Vue Django

Voici un exemple de vue Django pour votre backend :

```python
# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
import time

@api_view(['POST'])
def classify_image(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image provided'}, status=400)
    
    image_file = request.FILES['image']
    start_time = time.time()
    
    # Sauvegarder l'image temporairement
    image_path = default_storage.save(f'temp/{image_file.name}', image_file)
    
    # Charger vos 3 modèles et faire les prédictions
    predictions = []
    
    # Modèle 1
    model1_start = time.time()
    pred1 = model1.predict(image_path)  # Votre logique ici
    predictions.append({
        'model_name': 'ResNet50',
        'prediction': pred1['class'],
        'confidence': pred1['confidence'],
        'processing_time': time.time() - model1_start,
        'probabilities': pred1['top_5']
    })
    
    # Modèle 2
    model2_start = time.time()
    pred2 = model2.predict(image_path)
    predictions.append({
        'model_name': 'VGG16',
        'prediction': pred2['class'],
        'confidence': pred2['confidence'],
        'processing_time': time.time() - model2_start,
        'probabilities': pred2['top_5']
    })
    
    # Modèle 3
    model3_start = time.time()
    pred3 = model3.predict(image_path)
    predictions.append({
        'model_name': 'InceptionV3',
        'prediction': pred3['class'],
        'confidence': pred3['confidence'],
        'processing_time': time.time() - model3_start,
        'probabilities': pred3['top_5']
    })
    
    total_time = time.time() - start_time
    
    return Response({
        'success': True,
        'image_url': default_storage.url(image_path),
        'predictions': predictions,
        'total_time': total_time
    })
```

## 📝 Scripts

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Linter le code
```

## 🎨 Fonctionnalités

- ✅ Upload d'images par drag & drop
- ✅ Preview de l'image uploadée
- ✅ Classification avec 3 modèles en parallèle
- ✅ Affichage des performances individuelles
- ✅ Comparaison des modèles
- ✅ Badge "Meilleur modèle"
- ✅ Graphiques de confiance
- ✅ Top 3 prédictions par modèle
- ✅ Mode clair/sombre
- ✅ Notifications toast
- ✅ Design responsive
- ✅ Loading states & error handling

## 🔧 Structure du Projet

```
src/
├── components/
│   ├── shared/
│   │   ├── image-uploader.tsx    # Composant d'upload
│   │   ├── model-results.tsx     # Affichage des résultats
│   │   ├── theme-provider.tsx
│   │   └── theme-toogle.tsx
│   └── ui/                       # Composants shadcn
├── lib/
│   ├── api.ts                    # Client API & types
│   └── utils.ts
├── pages/
│   └── home.tsx                  # Page principale
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 TODO Backend Django

Pour que l'application fonctionne, votre backend Django doit :

1. Avoir un endpoint `POST /api/classify/`
2. Accepter des images via multipart/form-data
3. Retourner le format JSON spécifié ci-dessus
4. Activer CORS pour permettre les requêtes depuis le frontend

Exemple de configuration CORS :

```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
]
```

## 📸 Screenshots

L'interface comprend :
- Header avec logo et toggle de thème
- Section hero avec statistiques
- Zone d'upload drag & drop
- Affichage des résultats avec cartes individuelles par modèle
- Graphique de comparaison
- Footer

## 🤝 Support

Pour toute question, n'hésitez pas à ouvrir une issue !
