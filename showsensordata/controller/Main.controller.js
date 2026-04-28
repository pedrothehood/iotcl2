sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";
    return Controller.extend("showsensordata.controller.Main", {
        onInit: function () {
            // Hier kommt deine Logik rein
        },

  onLoadData: function () {
            var sensorId = this.byId("sensorInput").getValue();
            
            if (!sensorId) {
                MessageBox.error("Please enter a sensor ID");
                return;
            }
            
            // Disable button during loading
            this.byId("loadButton").setEnabled(false);
            
            // Load sensor data from REST service
            this.loadSensorData(sensorId);
        },
        loadSensorData: function (sensorId) {
            var that = this;
            
            // REST service URL
            var serviceUrl = "http://localhost/projekte-01/iotph1/getsdata.php?api_key=tP3434AATdasd444&sensor_id=" + sensorId;
            
            // Create a new XMLHttpRequest object
            var xhr = new XMLHttpRequest();
            
            xhr.open("GET", serviceUrl, true);
            
            // Set up a handler for when the request finishes
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // Successful response
                        try {
                            var response = JSON.parse(xhr.responseText);
                            that.displaySensorData(response, sensorId);
                        } catch (e) {
                            MessageBox.error("Error parsing sensor data: " + e.message);
                            that.byId("loadButton").setEnabled(true);
                        }
                    } else {
                        // Error response
                        MessageBox.error("Error loading sensor data. HTTP Status: " + xhr.status);
                        that.byId("loadButton").setEnabled(true);
                    }
                }
            };
            
            // Send the request
            xhr.send();
        },
        displaySensorData: function (data, sensorId) {
            // Enable button again
            this.byId("loadButton").setEnabled(true);
            
            // Check if data is valid
            if (!data || !data.Sensor || !data.Sensorid) {
                MessageBox.error("Invalid data structure returned from service");
                return;
            }
            
            // Display sensor information
            this.displaySensorInfo(data.Sensorid[0]);
            
            // Sort sensor data by reading_time descending
            var sortedData = data.Sensor.sort(function(a, b) {
                // Convert timestamps to Date objects for proper comparison
                return new Date(b.reading_time) - new Date(a.reading_time);
            });
            
            // Set model for table data
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
                sensorData: sortedData
            });
            
            this.getView().setModel(oModel);
        },

        displaySensorInfo: function (sensorInfo) {
            // Clear previous content
            var infoContent = this.byId("sensorInfoContent");
            infoContent.destroyItems();
            
            // Create new content
            infoContent.addItem(
                new sap.m.Text({
                    text: "Sensor ID: " + sensorInfo.sensorid,
                    wrapping: true
                })
            );
            
            infoContent.addItem(
                new sap.m.Text({
                    text: "Sensor Description: " + sensorInfo.bezeichnung,
                    wrapping: true
                })
            );
        }

    });
});
