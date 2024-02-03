let oreFound = false;
let score = 0;
const messageDisplayTime = 1000; // in milliseconds

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dirtSize = 10; // Adjust the size of each dirt box
const numRows = 50; // Change the number of rows
const numCols = 50; // Change the number of columns
const dirtArray = [];
let message = '';

// Define shovel types with their corresponding prices and ore chances
const shovels = [
    { type: 'Wooden Shovel', price: 10, oreChance: 0.1 },
    { type: 'Tin Shovel', price: 30, oreChance: 0.2 },
    { type: 'Iron Shovel', price: 50, oreChance: 0.3 },
    { type: 'Golden Shovel', price: 100, oreChance: 0.4 },
    { type: 'Diamond Shovel', price: 120, oreChance: 0.5 },
    { type: 'Amethyst Shovel', price: 150, oreChance: 0.6 },
    { type: 'Godly Shovel', price: 200, oreChance: 0.7 },
    { type: 'POG', price: 1000, oreChance: 1 },
];

// Add this code to populate the shovel list in the shop
document.addEventListener('DOMContentLoaded', function () {
    const shovelList = document.getElementById('shovelList');

    shovels.forEach(shovel => {
        const listItem = document.createElement('li');
        listItem.textContent = `${shovel.type} - $${shovel.price}`;
        listItem.addEventListener('click', () => purchaseShovel(shovel));
        shovelList.appendChild(listItem);
    });

    updateScore();
});

function purchaseShovel(selectedShovel) {
    if (money >= selectedShovel.price) {
        showMessage(`You purchased a ${selectedShovel.type}!`);
        money -= selectedShovel.price;
        currentShovel = selectedShovel;
        updateScore();
    } else {
        showMessage("Not enough money to purchase this shovel!");
    }
}


// Initialize the player's money
let money = 0;


function createDirt() {
    canvas.width = dirtSize * numCols;
    canvas.height = dirtSize * numRows;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const dirt = {
                x: j * dirtSize,
                y: i * dirtSize,
                width: dirtSize,
                height: dirtSize,
                isClicked: false
            };
            dirtArray.push(dirt);
        }
    }
    drawDirt();
    updateScore();
}

function drawDirt() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dirtArray.forEach(dirt => {
        if (dirt.isClicked && oreFound) {
            ctx.fillStyle = '#FFD700'; // Yellow color for found ore
        } else {
            ctx.fillStyle = '#8B4513'; // Brown color for regular dirt
        }
        ctx.fillRect(dirt.x, dirt.y, dirt.width, dirt.height);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(dirt.x, dirt.y, dirt.width, dirt.height);
    });
}





function dig(event) {
    if (oreFound) {
        showMessage("You already found ore! Keep digging in other spots.");
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    dirtArray.forEach(dirt => {
        if (
            mouseX > dirt.x &&
            mouseX < dirt.x + dirt.width &&
            mouseY > dirt.y &&
            mouseY < dirt.y + dirt.height &&
            !dirt.isClicked
        ) {
            dirt.isClicked = true; // Set isClicked to true immediately
            checkForOre(dirt);
        }
    });
}

function hideOre(dirt) {
    dirt.isClicked = false;
    dirt.width = 0;
    dirt.height = 0;
    drawDirt(); // Redraw with the hidden ore
    oreFound = false;

    if (dirtArray.every(dirt => dirt.isClicked)) {
        showMessage("All dirt mined! Generating new dirt...");
        setTimeout(() => {
            generateNewDirt();
        }, 2000); // Generate new dirt after 2 seconds
    }
}



let currentShovel = shovels[0]; // Set initial shovel

function checkForOre(dirt) {
    const chance = Math.random();

    if (chance < currentShovel.oreChance) {
        oreFound = true;
        money += currentShovel.price/10; // Collect money from getting an ore
        updateScore();
        showMessage(`Congratulations! You found a valuable ore with your ${currentShovel.type}!`);

        setTimeout(() => {
            hideOre(dirt);
        }, 500); // Hide ore after 2 seconds
    } else {
        showMessage("No ore here. Keep digging!");

        // Set isClicked to true immediately for regular dirt
        dirt.isClicked = true;

        // Redraw immediately for regular dirt
        drawDirt();

        setTimeout(() => {
            hideDirt(dirt);
        }, 100); // Hide dirt after 2 seconds
    }
}




function hideDirt(dirt) {
    dirt.width = 0;
    dirt.height = 0;
    drawDirt(); // Redraw with the hidden dirt
}

function generateNewDirt() {
    // Your logic to generate new dirt goes here
    // For simplicity, let's assume you have a function createDirtBlock(x, y, width, height) to create a dirt block
    dirtArray = [];
    for (let i = 0; i < numberOfDirtBlocks; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = 30;
        const height = 30;
        const dirtBlock = createDirt(x, y, width, height);
        dirtArray.push(dirtBlock);
    }
    drawDirt(); // Redraw the new dirt
}




function showMessage(msg) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = msg;

    setTimeout(() => {
        messageElement.innerText = '';
        drawDirt(); // Redraw without the message
    }, messageDisplayTime);
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
        // Update the money display
        document.getElementById('money').textContent = money;
}

// Call createDirt() when the page loads
window.onload = function () {
    createDirt();
    canvas.addEventListener('click', dig);
};
