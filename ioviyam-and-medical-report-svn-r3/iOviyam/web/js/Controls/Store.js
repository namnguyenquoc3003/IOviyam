/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mainDataCenter = [];
var lookup = [];
function Store() {

}

Store.prototype.save = function(dicomObjects, url) {
    if (typeof dicomObjects !== "undefined") {
        mainDataCenter[url] = dicomObjects;
    }
};

Store.prototype.returnImage = function(url) {
    if (typeof url !== "undefined") {
        return mainDataCenter[url];
    }
}

Store.prototype.localFind = function(url) {
    if (typeof url !== "undefined") {
        return typeof mainDataCenter[url];
    }
}

Store.prototype.saveLookup = function(lookupdata) {
    if (typeof lookupdata !== "undefined") {
        lookup = lookupdata;
    }
}
Store.prototype.getLookup = function() {
    return lookup;
}


