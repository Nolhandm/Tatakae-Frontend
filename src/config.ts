export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'


// Importe toutes les images du dossier Vagabond automatiquement
const vagabondImages = import.meta.glob('@/assets/Vagabond/*.png', {
  eager: true,
  import: 'default'
})

// Construit le dict { 0: url, 1: url, ... } en extrayant le numéro du nom de fichier
export const DICT_PATH_VAGABOND_IMG = {}

for (const path in vagabondImages) {
  // path ressemble à "/src/assets/Vagabond/12-Passeur de Frontière.png"
  const filename = path.split('/').pop()
  const match = filename.match(/^(\d+)-/)
  if (match) {
    const rank = parseInt(match[1], 10)
    DICT_PATH_VAGABOND_IMG[rank] = vagabondImages[path]
  }
}
