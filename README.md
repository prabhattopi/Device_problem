# FIFO Power Allocation Algorithm

## Overview
This project implements a **FIFO-based Power Allocation System** to manage power consumption efficiently while adhering to real-world constraints. The system ensures fair and safe distribution of power among connected devices.

---

## Problem Statement
You manage a power supply system with the following constraints:
1. Maximum capacity: **100 units**
2. Safety limit: **92 units**
3. Each device can draw up to **40 units**.

The system needs to:
- Allocate power to devices in **FIFO order**.
- Handle events where devices connect, disconnect, or change their power consumption.
- Redistribute power dynamically as devices leave or update their consumption.

### Example Scenario
1. **t=0**: Device A connects → A gets 40 units.
2. **t=1**: Device B connects → A keeps 40 units, B gets 40 units.
3. **t=2**: Device C connects → A keeps 40 units, B keeps 40 units, C gets 12 units.
4. **t=3**: Device A drops to 20 units → B keeps 40 units, C increases to 32 units.
5. **t=4**: Device B disconnects → A keeps 20 units, C increases to 40 units.

---

## Pseudo Code

```plaintext
DEFINE MAX_CAPACITY = 100
DEFINE SAFE_CAPACITY = 92
DEFINE DEVICE_MAX = 40

INITIALIZE activeDevices = []  // List of devices with {id, timestamp, requestedConsumption, allocatedConsumption}
INITIALIZE totalConsumption = 0

FUNCTION allocatePower():
    totalConsumption = 0
    FOR device IN activeDevices:
        ALLOCATE minimum(device.requestedConsumption, DEVICE_MAX, remainingPower())
        UPDATE totalConsumption

FUNCTION remainingPower():
    RETURN SAFE_CAPACITY - totalConsumption

FUNCTION onDeviceConnect(deviceID, requestedConsumption):
    ADD (deviceID, timestamp, requestedConsumption, 0) TO activeDevices
    SORT activeDevices BY timestamp
    CALL allocatePower()

FUNCTION onDeviceDisconnect(deviceID):
    REMOVE device WITH deviceID FROM activeDevices
    CALL allocatePower()

FUNCTION onDeviceChange(deviceID, newConsumption):
    FIND device WITH deviceID IN activeDevices
    UPDATE device.requestedConsumption = newConsumption
    CALL allocatePower()

MAIN LOOP:
    LISTEN FOR EVENTS (connect, disconnect, change)
    SWITCH event.type:
        CASE "connect":
            CALL onDeviceConnect(event.deviceID, event.requestedConsumption)
        CASE "disconnect":
            CALL onDeviceDisconnect(event.deviceID)
        CASE "change":
            CALL onDeviceChange(event.deviceID, event.newConsumption)
