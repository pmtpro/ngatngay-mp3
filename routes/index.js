var express = require('express');
var router = express.Router();

const fs = require('node:fs');
const path = require('node:path');
const NodeID3 = require('node-id3');

const appDir = path.dirname(__dirname);
const mp3Dir = path.join(appDir, 'public/mp3');
const mp3Url = '/mp3';

function fileList(folderPath) {
    var data = [];

    try {
        var files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            
            data.push(filePath);
        }
    } catch (err) {
        console.error(err);
    }

    return data;
}


function readID3(file) {
    const options = {
        include: [
            'TALB',
            'TIT2'
        ]
    }
    
    const tags = NodeID3.read(file);


    console.log(tags);
    
    if (!tags.title) {
        tags.title = path.basename(file);
    }
        
    return tags;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('whoaaaa');
});


router.get('/list', function(req, res, next) {
    const data = [];
    const files = fileList(mp3Dir);
    var i = 0;

    for (const file of files) {
        i++;
        
        const tags = readID3(file);
        var imageCover = '';
        
        if (tags.image?.imageBuffer) {
            const imageB64 = Buffer.from(tags.image.imageBuffer).toString('base64');
            const imageMime = tags.image.mime;
    
            imageCover = `data:${imageMime};base64,${imageB64}`;
        }
        
        data.push({
            title: tags.title || '',
            artist: tags.artist || '',
            //corverImage: imageCover,
            //lyric: tags.unsynchronisedLyrics?.text || '',
            downloadLink: path.join(mp3Url, encodeURIComponent(path.basename(file)))
        });


//break;
        if (i > 20) {
            //break;
        }
    }
    
    res.json(data);
});


module.exports = router;
