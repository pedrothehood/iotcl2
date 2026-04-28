sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
    "use strict";

    new ComponentContainer({
        name: "showsensordata",
        settings: { id: "showsensordata" },
        async: true
    }).placeAt("content"); // Verknüpfung zur ID im HTML
});
