export default function sortJsonByName(jsonArray) {
    if (!Array.isArray(jsonArray)) {
        throw new Error('Input must be an array');
    }
    
    return [...jsonArray].sort((a, b) => {
        // Check if objects have the name property
        if (!a.hasOwnProperty('name') || !b.hasOwnProperty('name')) {
            throw new Error('All objects in array must have a "name" property');
        }
    
        // Case-insensitive sorting
        return a.name.localeCompare(b.name);
    });
}