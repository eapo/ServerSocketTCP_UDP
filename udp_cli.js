const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const conf = require('./config/config');

// Function to handle incoming data
function onData(data) {
    try {
        const jsonData = JSON.parse(data);
        const sensorType = jsonData.type;
        const timestamp = jsonData.timestamp;
        const values = jsonData.values;
        var defined_sensors = 0;
 
        if (sensorType === "android.sensor.accelerometer") {
            const [x, y, z] = values;
            console.log(`accelerometer : x = ${x}, y = ${y}, z = ${z} timestamp = ${timestamp}`);
	    defined_sensors++;
        }

        if (sensorType === "com.google.sensor.pressure_temp") {
            const [t] = values;
            console.log(`Prss Temp = ${t} timestamp = ${timestamp}`);
	    defined_sensors++;
        }

        if (sensorType === "com.google.sensor.gyro_temperature") {
            const [t] = values;
            console.log(`Gyro Temp = ${t} timestamp = ${timestamp}`);
	    defined_sensors++;
        }
        
        if (sensorType === "android.sensor.gyroscope") {
            const [x, y, z] = values;
            console.log(`gyroscope : x = ${x}, y = ${y}, z = ${z} timestamp = ${timestamp}`);
	    defined_sensors++;
        }
        
        if (sensorType === "android.gps") {
            const { longitude, latitude, altitude, bearing, accuracy, speed, time, speedAccuracyMetersPerSecond, bearingAccuracyDegrees, elapsedRealtimeNanos, verticalAccuracyMeters } = jsonData;
            
            console.log(`longitude = ${longitude} latitude = ${latitude} altitude = ${altitude}`);
            
            // Fields only for Android 8.0 and above.
            if (speedAccuracyMetersPerSecond !== undefined) {
                console.log(`speedAccuracyMetersPerSecond = ${speedAccuracyMetersPerSecond}`);
            }
            if (bearingAccuracyDegrees !== undefined) {
                console.log(`bearingAccuracyDegrees = ${bearingAccuracyDegrees}`);
            }
            if (elapsedRealtimeNanos !== undefined) {
                console.log(`elapsedRealtimeNanos = ${elapsedRealtimeNanos}`);
            }
            if (verticalAccuracyMeters !== undefined) {
                console.log(`verticalAccuracyMeters = ${verticalAccuracyMeters}`);
            }
	    defined_sensors++;
        }

	if (defined_sensors <= 0) {
            console.table(jsonData);
	}

    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }
}

// Bind the server to listen on all network interfaces (0.0.0.0) and port 8080
server.on('message', (msg) => {
    onData(msg);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(conf.port, conf.serverHost);
