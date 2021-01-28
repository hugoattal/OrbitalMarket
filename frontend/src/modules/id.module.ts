let currentId = 0;

export function getUniqueId ():string {
    return (currentId++).toString();
}
