import { Texture, Rectangle } from 'pixi.js';

export interface AtlasRect {
    name: string;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    offsets?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    rotate?: number;
}

export interface AtlasData {
    [key: string]: AtlasRect;
}

export class AtlasParser {
    /**
     * Парсит текст атласа в структурированные данные
     */
    static parse(atlasText: string): AtlasData {
        const lines = atlasText.split('\n');
        const result: AtlasData = {};
        
        let currentRect: Partial<AtlasRect> | null = null;
        let i = 0;
        
        // Первая строка - имя файла текстуры, пропускаем
        i = 1;
        
        while (i < lines.length) {
            const line = lines[i].trim();
            
            // Пропускаем пустые строки и мета-информацию
            if (line === '' || line.startsWith('size:') || line.startsWith('format:') || 
                line.startsWith('filter:') || line.startsWith('repeat:') || line.startsWith('pma:')) {
                i++;
                continue;
            }
            
            // Если строка не пустая и не начинается с bounds/offsets/rotate - это имя спрайта
            if (line && !line.startsWith('bounds:') && !line.startsWith('offsets:') && !line.startsWith('rotate:')) {
                // Сохраняем предыдущий спрайт
                if (currentRect && currentRect.name) {
                    result[currentRect.name] = currentRect as AtlasRect;
                }
                
                // Начинаем новый спрайт
                currentRect = {
                    name: line
                };
                i++;
                continue;
            }
            
            // Парсим bounds
            if (line.startsWith('bounds:')) {
                if (currentRect) {
                    const parts = line.replace('bounds:', '').trim().split(',');
                    if (parts.length === 4) {
                        currentRect.bounds = {
                            x: parseInt(parts[0].trim()),
                            y: parseInt(parts[1].trim()),
                            width: parseInt(parts[2].trim()),
                            height: parseInt(parts[3].trim())
                        };
                    }
                }
                i++;
                continue;
            }
            
            // Парсим offsets
            if (line.startsWith('offsets:')) {
                if (currentRect) {
                    const parts = line.replace('offsets:', '').trim().split(',');
                    if (parts.length === 4) {
                        currentRect.offsets = {
                            x: parseInt(parts[0].trim()),
                            y: parseInt(parts[1].trim()),
                            width: parseInt(parts[2].trim()),
                            height: parseInt(parts[3].trim())
                        };
                    }
                }
                i++;
                continue;
            }
            
            // Парсим rotate
            if (line.startsWith('rotate:')) {
                if (currentRect) {
                    const value = line.replace('rotate:', '').trim();
                    currentRect.rotate = parseInt(value);
                }
                i++;
                continue;
            }
            
            i++;
        }
        
        // Сохраняем последний спрайт
        if (currentRect && currentRect.name) {
            result[currentRect.name] = currentRect as AtlasRect;
        }
        
        return result;
    }
    
    /**
     * Создаёт текстуру из атласа по имени спрайта
     */
    static createTextureFromAtlas(
        atlasTexture: Texture,
        atlasData: AtlasData,
        spriteName: string
    ): Texture | null {
        const rect = atlasData[spriteName];
        
        if (!rect) {
            return null;
        }
        
        if (!rect.bounds) {
            return null;
        }
        
        try {
            // В PixiJS v8 текстуры создаются по-другому
            // Используем базовую текстуру и создаем новую с нужным прямоугольником
            
            const baseTexture = atlasTexture.source; // В v8 используется source вместо baseTexture
            
            // Создаём прямоугольник для вырезания
            const frameRect = new Rectangle(
                rect.bounds.x,
                rect.bounds.y,
                rect.bounds.width,
                rect.bounds.height
            );
            
            // Создаём новую текстуру с указанным прямоугольником
            // В v8 используется другой конструктор
            const texture = new Texture({
                source: baseTexture,
                frame: frameRect
            });
            
            // Для повёрнутых текстур нужно дополнительно настроить
            if (rect.rotate === 90 || rect.rotate === 270) {
                // В v8 поворот обрабатывается иначе
                // Можно создать текстуру с поворотом или просто вернуть как есть
                // Для простоты возвращаем без поворота
            }
            
            return texture;
            
        } catch (error) {
            console.error(`Failed to create texture for ${spriteName}:`, error);
            return null;
        }
    }
    
    /**
     * Альтернативный метод для создания текстуры в PixiJS v8
     */
    static createTextureFromAtlasV8(
        atlasTexture: Texture,
        atlasData: AtlasData,
        spriteName: string
    ): Texture | null {
        const rect = atlasData[spriteName];
        
        if (!rect || !rect.bounds) {
            return null;
        }
        
        try {
            // Получаем базовый источник текстуры
            const baseSource = atlasTexture.source;
            
            // Создаём регион для текстуры
            const region = new Rectangle(
                rect.bounds.x,
                rect.bounds.y,
                rect.bounds.width,
                rect.bounds.height
            );
            
            // Создаём новую текстуру из региона
            // В PixiJS v8 используется другой подход
            const texture = new Texture({
                source: baseSource,
                frame: region
            });
            
            return texture;
            
        } catch (error) {
            return null;
        }
    }
}