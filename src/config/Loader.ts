import {Assets} from "pixi.js";

export class LoaderError extends Error {
    public assetsName: string;

    constructor(assetsName: string, message: string) {
        super(message);

        this.assetsName = assetsName;

        this.name = 'LoaderError';
    };
}

export class Loader {
    private static criticalAssets = ['symbols', 'game', 'buttons'];

    public static async load(onProgress?: (progress: number) => void): Promise<void> {
        const assets = [
            { alias: 'symbols',       src: '/assets/data/atlases/symbols.json' },
            { alias: 'game',          src: '/assets/data/atlases/game.json' },
            { alias: 'buttons',       src: '/assets/data/atlases/buttons.json' },
            { alias: 'frames',        src: '/assets/data/atlases/frames.json' },
            { alias: 'flags',         src: '/assets/data/atlases/flags.json' },
            { alias: 'animations1',   src: '/assets/data/atlases/animations1.json' },
            { alias: 'animations2',   src: '/assets/data/atlases/animations2.json' },
            { alias: 'animations3-0', src: '/assets/data/atlases/animations3-0.json' },
            { alias: 'bg',            src: '/images/background/bg.webp' },
        ];

        const failedAssets: string[] = [];

        Assets.add(assets);

        let loaded = 0;

        for (const asset of assets) {
         try {
             await Assets.load(asset.alias);

             loaded++;

             onProgress?.(loaded / assets.length);
         } catch (error) {
             console.error(`Failed to load: ${asset.alias}`, error);
             if (this.criticalAssets.includes(asset.alias)) {
                 failedAssets.push(asset.alias);
             }
         }
        }
        if (failedAssets.length > 0) {
            throw new LoaderError( failedAssets.join(', '),
                `Failed to load critical assets: ${failedAssets.join(', ')}`)
        }
    }
}