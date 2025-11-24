import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Clock } from 'lucide-react';
import type { ModelPrediction } from '@/service/classify-image.service';

interface ModelResultsProps {
  predictions: ModelPrediction[];
}

export function ModelResults({ predictions }: ModelResultsProps) {
  // Trouver le meilleur modèle
  const bestModel = predictions.reduce((prev, current) => 
    current.confidence > prev.confidence ? current : prev
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Résultats de Classification</h2>
        <Badge variant="outline" className="text-sm">
          {predictions.length} Modèle{predictions.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className={`grid gap-4 ${predictions.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {predictions.map((prediction, index) => {
          const isBest = prediction.model_name === bestModel.model_name;
          
          return (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                isBest ? 'ring-2 ring-primary' : ''
              }`}
            >
              {isBest && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Meilleur
                  </div>
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {prediction.model_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  {prediction.processing_time.toFixed(2)}s
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Prédiction principale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Prédiction
                    </span>
                    <Badge variant={isBest ? "default" : "secondary"}>
                      {(prediction.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-xl font-bold text-primary capitalize">
                    {prediction.prediction}
                  </p>
                  <Progress 
                    value={prediction.confidence * 100} 
                    className="h-2"
                  />
                </div>

                {/* Informations supplémentaires */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Classe ID</span>
                    <span className="font-medium">#{prediction.class_id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confiance</span>
                    <span className="font-medium">{(prediction.confidence * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparaison globale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comparaison des Performances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictions
              .sort((a, b) => b.confidence - a.confidence)
              .map((prediction, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-6 text-center">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium">
                        {prediction.model_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {prediction.processing_time.toFixed(2)}s
                      </span>
                      <Badge variant="outline">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={prediction.confidence * 100} 
                    className="h-2"
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
