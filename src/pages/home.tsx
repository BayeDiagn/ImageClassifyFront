import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ImageUploader } from '@/components/shared/image-uploader';
import { ModelResults } from '@/components/shared/model-results';
import { ModeToggle } from '@/components/shared/theme-toogle';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, AlertCircle, Brain, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { classifyImage, transformApiResponse, type ClassificationResponse } from '@/service/classify-image.service';
import { simulateClassification } from '@/service/demo-data.service';

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [results, setResults] = useState<ClassificationResponse | null>(null);
  const [demoMode] = useState(false); // Mode démo activé/désactivé

  // Mutation pour la classification
  const classifyMutation = useMutation({
    mutationFn: async (file: File) => {
      if (demoMode) {
        // Mode démo : utiliser les données simulées
        const apiResponse = await simulateClassification(file);
        return transformApiResponse(apiResponse);
      } else {
        // Mode réel : appeler l'API Django
        return classifyImage(file);
      }
    },
    onSuccess: (data) => {
      setResults(data);
      const modelCount = data.predictions.length;
      toast.success('Classification réussie !', {
        description: `${modelCount} modèle${modelCount > 1 ? 's ont' : ' a'} analysé votre image en ${data.total_time.toFixed(2)}s`,
      });
    },
    onError: (error: any) => {
      console.error('Erreur de classification:', error);
      toast.error('Erreur de classification', {
        description: error.response?.data?.message || 'Impossible de classifier l\'image. Vérifiez que le backend est en cours d\'exécution.',
      });
    },
  });

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResults(null);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResults(null);
  };

  const handleClassify = () => {
    if (selectedImage) {
      classifyMutation.mutateAsync(selectedImage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Image Classification</h1>
                <p className="text-sm text-muted-foreground">
                  Propulsé par des modèles de Deep Learning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button
                variant={demoMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setDemoMode(!demoMode);
                  toast.info(
                    !demoMode ? 'Mode Démo activé' : 'Mode Réel activé',
                    {
                      description: !demoMode 
                        ? 'Les données seront simulées' 
                        : 'Connexion au backend Django',
                    }
                  );
                }}
              >
                <TestTube2 className="w-4 h-4 mr-2" />
                Mode Démo
              </Button> */}
              <ModeToggle />
            </div>
          </div>
          
          {/* Banner Mode Démo */}
          {/* {demoMode && (
            <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Mode Démo actif - Les résultats sont simulés pour tester l'interface
              </span>
            </div>
          )} */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Intelligence Artificielle Avancée
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Classifiez vos images instantanément
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Téléchargez une image et découvrez comment plusieurs modèles de deep learning 
              l'analysent et la classifient en temps réel.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg border bg-card text-center">
              <div className="flex justify-center mb-2">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">2-3</div>
              <div className="text-sm text-muted-foreground">Modèles IA</div>
            </div>
            <div className="p-6 rounded-lg border bg-card text-center">
              <div className="flex justify-center mb-2">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">&lt; 3s</div>
              <div className="text-sm text-muted-foreground">Temps moyen</div>
            </div>
            <div className="p-6 rounded-lg border bg-card text-center">
              <div className="flex justify-center mb-2">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">99%+</div>
              <div className="text-sm text-muted-foreground">Précision</div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <ImageUploader
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClear}
              disabled={classifyMutation.isPending}
            />

            {selectedImage && !results && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleClassify}
                  disabled={classifyMutation.isPending}
                  className="min-w-[200px]"
                >
                  {classifyMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Classification en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Classifier l'image
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {classifyMutation.isPending && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Brain className="w-5 h-5 animate-pulse" />
                <span>Analyse en cours par les modèles...</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3 p-6 border rounded-lg">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {classifyMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Une erreur s'est produite lors de la classification. 
                Veuillez vérifier que votre backend Django est en cours d'exécution.
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {results && !classifyMutation.isPending && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">
                      Classification terminée
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Temps total: {results.total_time.toFixed(2)}s
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleClear}>
                  Nouvelle image
                </Button>
              </div>

              <ModelResults predictions={results.predictions} />
            </div>
          )}

          {/* Info Section */}
          {!selectedImage && (
            <div className="mt-12 p-8 rounded-lg border bg-muted/50">
              <h3 className="text-xl font-semibold mb-4">Comment ça marche ?</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-semibold">Téléchargez</h4>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez une image depuis votre appareil
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-semibold">Analysez</h4>
                  <p className="text-sm text-muted-foreground">
                    Nos 3 modèles IA traitent votre image en parallèle
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-semibold">Comparez</h4>
                  <p className="text-sm text-muted-foreground">
                    Visualisez et comparez les résultats de chaque modèle
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            FastAPI + React • Deep Learning Classification
          </p>
        </div>
      </footer>
    </div>
  );
}