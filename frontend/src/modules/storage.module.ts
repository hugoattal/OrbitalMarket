export default {
    setElement (name: string, data: any): void {
        localStorage.setItem(name, data);
    },
    getElement (name: string, defaultValue?: any): any {
        const storageValue = localStorage.getItem(name);
        if (storageValue || !defaultValue) {
            return storageValue;
        }
        return defaultValue;
    }
};
