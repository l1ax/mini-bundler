import {Loader} from '../../model/loader';

export class CssLoader extends Loader implements Loader.ILoader {
    run(rawContent: string, filePath: string): string {
        const escaped = rawContent.replace(/\n/g, "").replace(/"/g, '\\"');

        return `const style = document.createElement('style');
                style.innerText = "${escaped}";
                document.head.appendChild(style);`;
    }
}

export const cssLoader = new CssLoader();