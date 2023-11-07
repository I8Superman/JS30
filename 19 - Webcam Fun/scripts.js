const video = document.querySelector('.player');
const canvas = document.querySelector('.canvas'); // Used for controlling the 'container' of the canvas
const ctx = canvas.getContext('2d', { willReadFrequently: true }); // ctx is used to actually perform methods on our canvas (ctx.getImageData, ctx.drawImage etc.)
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap'); // Selecting the photo snapshot audio clip

console.log('Takes some time to fetch the device camera media stream and connect it to our video tag...')

// Func that 'pipes' the device camera into our video
// We need to do this, so we can use the canvas to manipulate our video image
const getVideo = () => {
    // Access video, but not audio (returns a promise, so we need to use .then method):
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            // Set the source of our video to the device camera
            video.srcObject = localMediaStream;
            // And activate the media stream:
            video.play()
        })
        .catch(err => {
            console.error('Something went wrong...!', err)
        })
}

// Display the video on the canvas so we can play around with it
const paintToCanvas = () => {
    // Get video stream size (videoWidth/-Height gets the raw pixel size of the media element)
    const vidWidth = video.videoWidth;
    const vidHeight = video.videoHeight;
    // Set canvas to match resolution og the original video media:
    // NOTE: Canvas is set to 100% width, but we can still set it's resolution independent of its actual width on the screen.
    canvas.width = vidWidth;
    canvas.height = vidHeight;

    setInterval(() => {
        ctx.drawImage(video, 0, 0) // Grap video img and paste it on the canvas

        // APPLY EFFECTS:

        // Grap the pixel data of the canvas:
        let pixels = ctx.getImageData(0, 0, vidWidth, vidHeight) // returns arr of millions of elements, where every 4 describes the red, green, blue and alpha color values of 1 pixel (!)

        // Run all our pixels through an effect func (result is returned and stored in the pixels var):
        pixels = rgbSplitEffect(pixels) // Apply filter

        // Put the effects on the canvas:
        ctx.putImageData(pixels, 0, 0);
        ctx.globalAlpha = 0.1;
    }, 64) // Milliseconds between each image draw = frame rate of the copy of the video feed (setInterval turns drawImage into video)
}

getVideo();

const takePhoto = () => {
    // Play snap sound
    snap.currentTime = 0;
    snap.play()
    // Grap the img data from the canvas:
    const data = canvas.toDataURL('image/jpeg'); // returns img data as url to be used elsewhere in the browser
    const imgLink = document.createElement('a');
    imgLink.href = data;
    // Makes the image downloadable:
    imgLink.setAttribute('download', 'handsome'); // param is title of download
    imgLink.innerHTML = `<img src="${data}" alt="handsome dude" />`
    // Insert imgLink (= our new snapshot) in parent node, before the first childElem (so the images pops in on the left, pushing the existing ones to the right):
    strip.insertBefore(imgLink, strip.firstChild);
}

// Filter functions:

const redEffect = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
        // The 4th i value will be the alpha channel, but we skip it    
    }
    return pixels
}

const rgbSplitEffect = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        // Applying current pixels color values to pixels further up or down the arr, resulting in a 'splitting' of the RGB values. 
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels
}

// Wait to trigger paintToCanvas until video is loaded (or we get an empty screen)
video.addEventListener('loadeddata', () => paintToCanvas())

