export function LoadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

export function checkCollision(entityA, entityB) {
    return (
        entityA.x < entityB.x + entityB.width * entityB.scale &&
        entityA.x + entityA.width * entityA.scale > entityB.x &&
        entityA.y < entityB.y + entityB.height * entityB.scale &&
        entityA.y + entityA.height * entityA.scale > entityB.y
    );
}

export async function LoadJson(path) {
    let jsonData = null;
    await fetch(path)
    .then(response => response.json())
    .then(data => {
        jsonData = data;
    });
    return jsonData;
}

export const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;