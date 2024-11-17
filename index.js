const MAX_CAPACITY = 100;
const SAFE_CAPACITY = 92;
const DEVICE_MAX = 40;

let activeDevices = []; // List of active devices { id, timestamp, requested, allocated }
let totalConsumption = 0; // Current total power consumption

// Function to calculate remaining power
function remainingPower() {
    return SAFE_CAPACITY - totalConsumption;
}

// Function to allocate power to devices
function allocatePower() {
    totalConsumption = 0; // Reset total consumption

    for (const device of activeDevices) {
        const availablePower = remainingPower();
        const allocation = Math.min(device.requested, DEVICE_MAX, availablePower);
        device.allocated = allocation;
        totalConsumption += allocation;
    }
}

// Function to handle device connection
function onDeviceConnect(id, requestedConsumption) {
    const timestamp = Date.now();
    activeDevices.push({ id, timestamp, requested: requestedConsumption, allocated: 0 });
    activeDevices.sort((a, b) => a.timestamp - b.timestamp); // Maintain FIFO order
    allocatePower();
}

// Function to handle device disconnection
function onDeviceDisconnect(id) {
    activeDevices = activeDevices.filter(device => device.id !== id);
    allocatePower();
}

// Function to handle device consumption change
function onDeviceChange(id, newConsumption) {
    const device = activeDevices.find(device => device.id === id);
    if (device) {
        device.requested = newConsumption;
    }
    allocatePower();
}

// Debug function to print the current state
function printState() {
    console.log("Active Devices:", activeDevices);
    console.log("Total Consumption:", totalConsumption, "/", SAFE_CAPACITY);
}

// Example Usage:

// Event t=0: Device A connects
onDeviceConnect("A", 40);
printState();

// Event t=1: Device B connects
onDeviceConnect("B", 40);
printState();

// Event t=2: Device C connects
onDeviceConnect("C", 40);
printState();

// Event t=3: Device A reduces to 20 units
onDeviceChange("A", 20);
printState();

// Event t=4: Device B disconnects
onDeviceDisconnect("B");
printState();
