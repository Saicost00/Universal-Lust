ImageManager.loadBitmap = function(folder, filename, hue, smooth) { 
    if (filename) { 
        var path = folder + encodeURIComponent(filename) + '.png'; 
        var bitmap = this.loadNormalBitmap(path, hue || 0); 
        //console.log("disabling smoothing for "+path);   
        bitmap.smooth = false; return bitmap; 
    } else { 
        return this.loadEmptyBitmap(); 
    }
};