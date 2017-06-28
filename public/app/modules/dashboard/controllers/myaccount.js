﻿
var allIcons = {}; //Object with the icons of the devices (basis 64)

const lstComponenents = {
    device: [], // list_infos_devices.type == "device"
    sensor: [], // list_infos_devices.type == "sensor"
    actuator: [], // list_infos_devices.type == "actuator"
};

const one_id_random = "RaspberryPiTwo"

function Component(element) {
    this.numberOfPins = element.NumberOfPins;
    this.id = element.id;
    this.iconComponentKey = element.imageFile; // This key is used to access the correct image in the another data structure
    this.ownerUser = element.userUid;
}

function createComponent(element) {
    /* if element.type is definied */
    return lstComponenents[element.type].push(new Component(element)); // returns a promise
}

// Reading data from the database (key: images)
firebase.database().ref("images").orderByKey().once("value")
.then(function(snapshot) { // after function(snapshot)
    snapshot.forEach(function(childSnapshot) {
        allIcons[childSnapshot.key] = childSnapshot.val();
        localStorage.setItem(childSnapshot.key, childSnapshot.val());
    });
});
// Reading data from the database (key: "models")
firebase.database().ref("models").orderByKey().once("value")
.then(function(snapshot) { // after function(snapshot)
    snapshot.forEach(function(childSnapshot) {  // Loop into database's information
    //var key = childSnapshot.key;
        switch (childSnapshot.val().type) {
            case "device":
                createComponent(childSnapshot.val());
                localStorage.setItem(childSnapshot.key, childSnapshot.val().id); // Key:Id will be able to access from the whole application
                break;
            case "sensor":
                createComponent(childSnapshot.val());
                localStorage.setItem(childSnapshot.key, childSnapshot.val().id);
                break;
            case "actuator":
                createComponent(childSnapshot.val());
                localStorage.setItem(childSnapshot.key, childSnapshot.val().id);
                break;
            default:
                createComponent(childSnapshot.val());
                localStorage.setItem(childSnapshot.key, childSnapshot.val().id);
        }
    });
}).then(function(createComponent) {
    //var global = "across";
    //localStorage.setItem('text', lstComponenents.device["0"].id);
    console.log("THEN (IN CLIENT) ", lstComponenents.actuator["0"].id); // Now the value isn't undefined
    var prefixIPVS = "ipvs:";
    var deviceOne = lstComponenents.device["0"].id;
    var sensorOne = lstComponenents.sensor["0"].id;
    var actuatorOne = lstComponenents.actuator["0"].id;
    localStorage.setItem('device', deviceOne);
    localStorage.setItem('sensor', sensorOne);
    localStorage.setItem('actuator', actuatorOne);

    var defObject = {
        "@context": {
            "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
            "m3-lite": "http://purl.org/iot/vocab/m3-lite#",
            "owl": "http://www.w3.org/2002/07/owl#",
            "qu": "http://purl.org/NET/ssnx/qu/qu#",
            "qu-rec20": "http://purl.org/NET/ssnx/qu/qu-rec20#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "ssn": "http://purl.oclc.org/NET/ssnx/ssn#",
            "time": "http://www.w3.org/2006/time#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "iot-lite": "http://purl.oclc.org/NET/UNIS/fiware/iot-lite#",
            "ipvs": "http://www.ipvs.uni-stuttgart.de/iot-lite#",
            "ipvs:hasPin": {
                "@id": "ipvs:hasPin",
                "@container": "@list"
            }
        },
        "@graph": [
            {
                "@id": "iot-lite:altRelative",
                "@type": "owl:AnnotationProperty",
                "rdfs:domain": {
                    "@id": "geo:Point"
                },
                "rdfs:range": {
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "geo:alt",
                "@type": "owl:AnnotationProperty",
                "rdfs:domain": {
                    "@id": "geo:Point"
                }
            },
            {
                "@id": "iot-lite:Service",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "Service provided by an IoT Device"
                }
            },
            {
                "@id": "iot-lite:exposedBy",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "A device is exposed by a service.",
                "rdfs:domain": {
                    "@id": "ssn:Device"
                },
                "rdfs:range": {
                    "@id": "iot-lite:Service"
                }
            },
            {
                "@id": "iot-lite:endpoint",
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "Endpoint of the service. It is usually a URL where the service is available.",
                "rdfs:domain": {
                    "@id": "iot-lite:Service"
                },
                "rdfs:range": {
                    "@id": "xsd:anyURI"
                }
            },
            {
                "@id": "geo:location",
                "@type": "owl:ObjectProperty",
                "rdfs:range": {
                    "@id": "geo:Point"
                }
            },
            {
                "@id": "iot-lite:isAssociatedWith",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "Defines the associations between objects and sensors (e.g. A table (object) has an attribute (temperature at the table) which is associated with a sensor (the temperature sensor of the room). ",
                "rdfs:domain": [
                    {
                        "@id": "iot-lite:Object"
                    },
                    {
                        "@id": "iot-lite:Entity"
                    }
                ],
                "rdfs:range": {
                    "@id": "iot-lite:Service"
                }
            },
            {
                "@id": "iot-lite:VirtualEntity",
                "@type": "owl:Class",
                "rdfs:subClassOf": {
                    "@id": "iot-lite:Entity"
                }
            },
            {
                "@id": "iot-lite:interfaceType",
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "Defines the type of interface of the service endpoint.",
                "rdfs:domain": {
                    "@id": "iot-lite:Service"
                },
                "rdfs:range": {
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "iot-lite:Attribute",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "An attribute of an IoT object that can be exposed by an IoT service (i.e. a room (IoT Object) has a temperature (Attribute), that can be exposed by a temperature sensor (IoT device)."
                }
            },
            {
                "@id": "ssn:SensingDevice",
                "@type": "owl:Class",
                "rdfs:subClassOf": [
                    {
                        "@id": "ssn:Sensor"
                    },
                    {
                        "@id": "ssn:Device"
                    }
                ]
            },
            {
                "@id": "iot-lite:hasMetadata",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "Links any concept with metadata about that concept.",
                "rdfs:range": {
                    "@id": "iot-lite:Metadata"
                }
            },
            {
                "@id": "ssn:Platform",
                "@type": "owl:Class"
            },
            {
                "@id": "qu:Unit",
                "@type": "owl:Class"
            },
            {
                "@id": "iot-lite:metadataValue",
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "Value of the metadata",
                "rdfs:domain": {
                    "@id": "iot-lite:Metadata"
                },
                "rdfs:range": {
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "iot-lite:hasAttribute",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "Links the devices with their attributes.",
                "rdfs:domain": [
                    {
                        "@id": "iot-lite:Object"
                    },
                    {
                        "@id": "iot-lite:Entity"
                    }
                ],
                "rdfs:range": {
                    "@id": "iot-lite:Attribute"
                }
            },
            {
                "@id": "iot-lite:interfaceDescription",
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "Description of the service.",
                "rdfs:domain": {
                    "@id": "iot-lite:Service"
                },
                "rdfs:range": {
                    "@id": "xsd:anyURI"
                }
            },
            {
                "@id": "iot-lite:Object",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "IoT entity"
                }
            },
            {
                "@id": "iot-lite:relativeLocation",
                "@type": "owl:AnnotationProperty",
                "rdfs:domain": {
                    "@id": "geo:Point"
                },
                "rdfs:range": {
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "iot-lite:",
                "@type": "owl:Ontology",
                "owl:versionInfo": "0.3 fiesta",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "iot-lite is a lightweight ontology based on SSN to describe Internet of Things (IoT) concepts and relationships."
                },
                "rdfs:label": "iot-lite"
            },
            {
                "@id": "iot-lite:metadataType",
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "Defines the type pf the metadata value (e.g. resolution of the sensor).",
                "rdfs:domain": {
                    "@id": "iot-lite:Metadata"
                },
                "rdfs:range": {
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "ssn:System",
                "@type": "owl:Class"
            },
            {
                "@id": "geo:Point",
                "@type": "owl:Class",
                "geo:alt": "",
                "geo:lat": "",
                "geo:long": "",
                "iot-lite:altRelative": "",
                "iot-lite:relativeLocation": ""
            },
            {
                "@id": "qu:QuantityKind",
                "@type": "owl:Class"
            },
            {
                "@id": "ssn:hasSubSystem",
                "@type": "owl:ObjectProperty",
                "rdfs:domain": {
                    "@id": "ssn:System"
                },
                "rdfs:range": {
                    "@id": "ssn:System"
                }
            },
            {
                "@id": "iot-lite:Metadata",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "Class used to describe properties that cannot be described by QuantityKind and Units. i.e. the resolution of a sensor."
                }
            },
            {
                "@id": "iot-lite:Polygon",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "The coverage is made up by linking several points by strait lines."
                },
                "rdfs:subClassOf": {
                    "@id": "iot-lite:Coverage"
                }
            },
            {
                "@id": "iot-lite:radius",
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "Specifies the radius of a circle coverage defined by a point -the center of the circle- and its radius.",
                "rdfs:domain": {
                    "@id": "iot-lite:Circle"
                },
                "rdfs:range": {
                    "@id": "xsd:double"
                }
            },
            {
                "@id": "geo:lat",
                "@type": "owl:AnnotationProperty",
                "rdfs:domain": {
                    "@id": "geo:Point"
                }
            },
            {
                "@id": "iot-lite:Coverage",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "The coverage of an IoT device (i.e. a temperature sensor inside a room has a coverage of that room)."
                }
            },
            {
                "@id": "iot-lite:TagDevice",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "Tag Device such as QR code or bar code."
                },
                "rdfs:subClassOf": {
                    "@id": "ssn:Device"
                }
            },
            {
                "@id": "iot-lite:exposes",
                "@type": "owl:ObjectProperty",
                "owl:inverseOf": {
                    "@id": "iot-lite:exposedBy"
                },
                "rdfs:comment": "For service-oriented queries. The inverse of exposedBy.",
                "rdfs:domain": {
                    "@id": "iot-lite:Service"
                },
                "rdfs:range": {
                    "@id": "ssn:Device"
                }
            },
            {
                "@id": "ssn:onPlatform",
                "@type": "owl:ObjectProperty",
                "rdfs:domain": {
                    "@id": "ssn:System"
                },
                "rdfs:range": {
                    "@id": "ssn:Platform"
                }
            },
            {
                "@id": "iot-lite:Entity",
                "@type": "owl:Class",
                "owl:equivalentClass": {
                    "@id": "iot-lite:Object"
                }
            },
            {
                "@id": "iot-lite:hasSensingDevice",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "Links a sensor with a sensing device the same way as SSN.",
                "rdfs:domain": {
                    "@id": "ssn:Sensor"
                },
                "rdfs:range": {
                    "@id": "ssn:SensingDevice"
                }
            },
            {
                "@id": "iot-lite:hasCoverage",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "Links the devices with their coverages.",
                "rdfs:domain": {
                    "@id": "ssn:Device"
                },
                "rdfs:range": {
                    "@id": "iot-lite:Coverage"
                }
            },
            {
                "@id": "iot-lite:isSubSystemOf",
                "@type": "owl:ObjectProperty",
                "owl:inverseOf": {
                    "@id": "ssn:hasSubSystem"
                },
                "rdfs:domain": {
                    "@id": "ssn:System"
                },
                "rdfs:range": {
                    "@id": "ssn:System"
                }
            },
            {
                "@id": "ssn:Sensor",
                "@type": "owl:Class"
            },
            {
                "@id": "iot-lite:hasQuantityKind",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "Links a sensor or an attribute with the quantity  kind it measures (e.g. A sensor -sensor1- measures temperature: sensor1 hasQuantityKind temperature).",
                "rdfs:domain": [
                    {
                        "@id": "iot-lite:Attribute"
                    },
                    {
                        "@id": "ssn:Sensor"
                    }
                ],
                "rdfs:range": {
                    "@id": "qu:QuantityKind"
                }
            },
            {
                "@id": "iot-lite:hasUnit",
                "@type": "owl:ObjectProperty",
                "rdfs:comment": "Links the sensor with the units of the quantity kind it measures (e.g. A sensor -sensor1- measures temperature in Celsius: senso1 hasUnit celsius).",
                "rdfs:domain": {
                    "@id": "ssn:Sensor"
                },
                "rdfs:range": {
                    "@id": "qu:Unit"
                }
            },
            {
                "@id": "iot-lite:Rectangle",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "Teh coverage is made up by giving two points which are the oposite corners of a rentangle."
                },
                "rdfs:subClassOf": {
                    "@id": "iot-lite:Coverage"
                }
            },
            {
                "@id": "iot-lite:id",
                "@type": "owl:DatatypeProperty",
                "rdfs:domain": {
                    "@id": "ssn:Device"
                },
                "rdfs:range": {
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "geo:long",
                "@type": "owl:AnnotationProperty",
                "rdfs:domain": {
                    "@id": "geo:Point"
                }
            },
            {
                "@id": "iot-lite:Circle",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "Circle coverage it needs the location of the sensor as the centre of the circle and the radius as a DataProperty."
                },
                "rdfs:subClassOf": {
                    "@id": "iot-lite:Coverage"
                }
            },
            {
                "@id": "ssn:Device",
                "@type": "owl:Class",
                "rdfs:subClassOf": {
                    "@id": "ssn:System"
                }
            },
            {
                "@id": "iot-lite:ActuatingDevice",
                "@type": "owl:Class",
                "rdfs:comment": {
                    "@language": "en",
                    "@value": "Device that can actuate over an object or QuantityKind."
                },
                "rdfs:subClassOf": {
                    "@id": "ssn:Device"
                }
            },
            {
                "@id": "iot-lite:isMobile",
                "@type": "owl:DatatypeProperty",
                "rdfs:domain": {
                    "@id": "ssn:Platform"
                },
                "rdfs:range": {
                    "@id": "xsd:boolean"
                }
            },

            //##### Extensions of IoT-Lite Scheme for own Device-Types #####################################################
            {
                "@id": deviceOne.toString(),          // Define a RaspberryPi as SubClass of Device //(prefixIPVS.concat(lstComponenents.actuator["0"].id)).toString()
                "@type": "owl:Class",
                "rdfs:subClassOf": [
                    {
                        "@id": "ssn:Device"
                    },
                    {
                        "@id" : "ipvs:RaspberryPi-numberOfPins"
                    }
                ]

            },
            {
                "@id": "ipvs:macAddress",     // Define the MacAdress property as Attribute of RaspberryPi
                "@type": "owl:DatatypeProperty",
                "rdfs:domain":{
                    "@id":"ssn:Device"
                },
                "rdfs:range": {
                    //"@id": "ipvs:MacAdress"
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "ipvs:numberOfPins",     // Define the MacAdress property as Attribute of RaspberryPi
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "To specify the number of pins on a device.",
                "rdfs:domain":{
                    "@id":"ssn:Device"
                },
                "rdfs:range": {
                    //"@id": "ipvs:MacAdress"
                    "@id": "xsd:nonNegativeInteger"
                }
            },
            {
                "@id": "ipvs:gpioMode",     // Define the MacAdress property as Attribute of RaspberryPi
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "To specify how the GPIO pin numbers are supposed to be interpreted.",
                "rdfs:domain":{
                    "@id":"ssn:Device"
                },
                "rdfs:range": {
                    //"@id": "ipvs:MacAdress"
                    "@id": "xsd:string"
                }
            },
            {
                "@id": "ipvs:modelNumber",     // Define the MacAdress property as Attribute of RaspberryPi
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "To specify whether it's a RPi model A or B.",
                "rdfs:domain":{
                    "@id":"ssn:Device"
                },
                "rdfs:range": {
                    //"@id": "ipvs:MacAdress"
                    "@id": "xsd:string"
                }
            },
            {
                "@id": sensorOne.toString(),          // Define a Raspberry Pi as SubClass of Device
                "@type": "owl:Class",
                "rdfs:comment": "Temperature Sensor with 3 pins. GND - 1, DQ - 2, VDD -3. Datasheet: https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf",
                "rdfs:subClassOf": [
                    {
                        "@id": "ssn:SensingDevice"
                    }
                    ,
                    {
                        "@id": "ipvs:DS18B20TEST-hasPin"
                    }
                ]
            },
            {
                "@id": "ipvs:hasPin",     // Define the MacAdress property as Attribute of RaspberryPi
                "@type": "owl:DatatypeProperty",
                "rdfs:comment": "To list all pins of a device (sensor, actuator) and to what pins of the super-device they are connected to.",
                "rdfs:domain": {
                    "@id":"ipvs:Device"
                },
                "rdfs:range": {
                    "@id": "xsd:nonNegativeInteger"
                }
            },
            {
                "@id": actuatorOne.toString(),          // Define a RaspberryPi as SubClass of Device
                "@type": "owl:Class",
                "rdfs:comment": "TI Microcontrollor with 16 pins to drive up to two motors. Datasheet: http://www.ti.com/lit/ds/symlink/l293.pdf",
                "rdfs:subClassOf": [
                    {
                        "@id": "iot-lite:ActuatingDevice"
                    },
                    {
                        "@id": "ipvs:L293D-hasPin"
                    }
                ]
            },
            {
                "@id" : "ipvs:RaspberryPi-numberOfPins",
                "@type": "owl:Restriction",
                "rdfs:comment": "OWL restriction specifying the number of pins of a raspberry pi.",
                "owl:onProperty": {
                    "@id": "ipvs:numberOfPins"
                },
                "owl:cardinality": {
                    "@value": "26",
                    "@type": "xsd:nonNegativeInteger"
                }
            },
            {
                "@id" : "ipvs:DS18B20TEST-hasPin",
                "@type": "owl:Restriction",
                "owl:onProperty": {
                    "@id":"ipvs:hasPin"
                },
                "owl:cardinality": {
                    "@value": "3",
                    "@type": "xsd:nonNegativeInteger"
                }
            },
            {
                "@id" : "ipvs:L293D-hasPin",
                "@type": "owl:Restriction",
                "owl:onProperty": {
                    "@id":"ipvs:hasPin"
                },
                "owl:cardinality": {
                    "@value": "16",
                    "@type": "xsd:nonNegativeInteger"
                }
            }
        ]
    }; // close the object
    // Storing the object into the local storage |
    localStorage.setItem('defObject', JSON.stringify(defObject));

});

dashboard.controller("myaccountController", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', '$firebaseArray','$firebaseAuth','$firebaseObject',
function ($rootScope, $scope, $state, $location, dashboardService, Flash, $firebaseArray, $firebaseAuth, $firebaseObject) {
    var vm = this;

    $scope.showAccountinfo = function(user){
      $scope.show = true;
      $scope.Username = user.Username;
      $scope.Email = user.Email;
      $scope.addr = user.addr;
      $scope.id = user.$id;
    }

    $scope.editFormSubmit = function(){
      var user = firebase.auth().currentUser;
      var ref = firebase.database().ref('users/'+$scope.id);
      var userDB = $firebaseObject(ref);

      userDB.$loaded().then(function(){
        userDB.Username = $scope.Username;
        userDB.addr = $scope.addr;
        userDB.Email = $scope.Email;
        userDB.$save().then(function(ref) {

        },
        function(error) {
          console.log("Error:", error);
        });
      });
    user.updateEmail($scope.Email);
  }

  $('#form_id').submit(function() {
    $('#editModal').modal('hide');
  });

}]);
