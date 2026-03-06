import * as PIXI from 'pixi.js';
import { AtlasParser } from '../utils/AtlasParser';
import { AssetResources } from './types';
import { GAME_CONFIG } from '../config/GameConfig';

export type ProgressCallback = (percent: number) => void;

export class AssetLoader {
    private resources: Partial<AssetResources> = {};
    private loadingPromise: Promise<AssetResources> | null = null;

    async loadAll(onProgress?: ProgressCallback): Promise<AssetResources> {
        if (this.loadingPromise) return this.loadingPromise as Promise<AssetResources>;

        this.loadingPromise = this.performLoad(onProgress);
        return this.loadingPromise as Promise<AssetResources>;
    }

    private async performLoad(onProgress?: ProgressCallback): Promise<AssetResources> {
        const { basePath, files } = GAME_CONFIG.assets;
        let loadedCount = 0;
        const totalCount = files.length;

        const updateProgress = () => {
            loadedCount++;
            if (onProgress) {
                onProgress((loadedCount / totalCount) * 100);
            }
        };

        try {
            // Параллельная загрузка всех ресурсов
            const loadPromises = files.map(async (file) => {
                const fullPath = `${basePath}/${file.path}`;
                
                switch (file.type) {
                    case 'texture':
                        this.resources[file.id as keyof AssetResources] = 
                            await PIXI.Assets.load(fullPath);
                        break;
                        
                    case 'json':
                        const response = await fetch(fullPath);
                        this.resources[file.id as keyof AssetResources] = await response.json();
                        break;
                        
                    case 'atlas':
                        const atlasResponse = await fetch(fullPath);
                        const atlasText = await atlasResponse.text();
                        this.resources[file.id as keyof AssetResources] = 
                            AtlasParser.parse(atlasText);
                        break;
                }
                
                updateProgress();
            });

            await Promise.all(loadPromises);

            return this.resources as AssetResources;

        } catch (error) {
            this.loadingPromise = null;
            throw new Error(`Failed to load assets: ${error}`);
        }
    }

    getResource<K extends keyof AssetResources>(key: K): AssetResources[K] {
        return this.resources[key] as AssetResources[K];
    }

    dispose(): void {
        Object.values(this.resources).forEach(resource => {
            if (resource instanceof PIXI.Texture) {
                resource.destroy(true);
            }
        });
        this.resources = {};
        this.loadingPromise = null;
    }
}