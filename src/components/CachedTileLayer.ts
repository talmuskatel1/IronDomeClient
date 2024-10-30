import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

const CachedTileLayer: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    class CustomTileLayer extends L.TileLayer {
      constructor(urlTemplate: string, options?: L.TileLayerOptions) {
        super(urlTemplate, options);
      }

      createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
        const url = this.getTileUrl(coords);
        const img = document.createElement('img');
        img.crossOrigin = 'Anonymous';
        img.alt = '';

        const loadTile = (src: string) => {
          img.onload = () => {
            done(undefined, img);
            if (src === url) {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              canvas.getContext('2d')?.drawImage(img, 0, 0);
              try {
                localStorage.setItem(url, canvas.toDataURL());
              } catch (e) {
                console.error('Error caching tile:', e);
              }
            }
          };
          img.onerror = (e) => {
            done(e as unknown as Error, img);
          };
          img.src = src;
        };

        const cachedImage = localStorage.getItem(url);
        if (cachedImage) {
          console.log('Loading tile from cache:', url);
          loadTile(cachedImage);
        } else {
          console.log('Loading tile from network:', url);
          loadTile(url);
        }

        return img;
      }
    }

    const customTileLayer = new CustomTileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    customTileLayer.addTo(map);

    return () => {
      map.removeLayer(customTileLayer);
    };
  }, [map]);

  return null;
};

export default CachedTileLayer;