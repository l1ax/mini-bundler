/**
 * @file 切面的订阅容器
 */

export class Hook {
    // 订阅的回调函数集合
    callbacks: Map<string, Array<(...args: any[]) => any>> = new Map();

    tap(pluginName: string, callback: (...args: any[]) => any) {
        if (!this.callbacks.get(pluginName)) {
            const callbacks = [callback];
            this.callbacks.set(pluginName, callbacks);

            return;
        }

        this.callbacks.set(pluginName, [...this.callbacks.get(pluginName)!, callback])
    }

    call(pluginName: string = '') {
        if (!pluginName) {
            for (const callbacks of this.callbacks.values()) {
                callbacks.forEach(cb => cb());
            }
        }

        if (!this.callbacks.get(pluginName)) {
            return;
        }

        const callbacks = this.callbacks.get(pluginName);
        callbacks!.forEach(cb => cb());
    }
}