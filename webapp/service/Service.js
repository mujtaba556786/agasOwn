sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var agService = {
            
            onPost: function (url, oData) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: oData,
                        success: function (data) {
                            resolve(data)
                        },
                        error: function (error) {
                            reject(error)
                        },
                    })
                })
            },
            
            onGet: function (url) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: url,
                        type: 'Get',
                        success: function (data) {
                            resolve(data)
                        },
                        error: function (error) {
                            reject(error)
                        },
                    })
                })
            }
        }
        return agService;
    });
