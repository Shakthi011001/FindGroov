const video = document.getElementById("video");
const emo=document.getElementsByClassName("emotion")
var constraints = { audio: false, video: { width: 1280, height: 720 } };
// Initiate model
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(() => {
  console.log("Success");
  startVideo();
  setTimeout(() => {
    video.pause();
  }, 3000);
});
// Start webcam video
function startVideo() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      var video = document.querySelector("video");
      video.srcObject = mediaStream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}
let count = 0;
let exp_prob= []
const avg=[]
// MAX INDEX OF ARRAY
function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }
  var max = arr[0];
  var maxIndex = 0;
  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }
  return maxIndex;
}
// Live recognition
video.addEventListener("play", async () => {
  const canvas = await faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  var s = setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = await faceapi.resizeResults(
      detections,
      displaySize
    );
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  /*  faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);*/

    if (detections) {
      const exp = detections[0].expressions;
      exp_prob[0]= exp.angry;
      exp_prob[1]= exp.disgusted;
      exp_prob[2]= exp.fearful;
      exp_prob[3]= exp.happy;
      exp_prob[4]= exp.neutral;
      exp_prob[5] = exp.sad;
      exp_prob[6] = exp.surprised;
      count += 1;
    }
  }, 100);
  setTimeout(() => {
    clearInterval(s);
      avg[0]= exp_prob[0]/count
      avg[1]= exp_prob[1]/count
      avg[2]= exp_prob[2]/count
      avg[3]= exp_prob[3]/count
      avg[4]= exp_prob[4]/count
      avg[5]= exp_prob[5]/count
      avg[6]= exp_prob[6]/count
      console.log(avg);
      const exp_index=indexOfMax(avg);
      switch(exp_index) {
        case 0:
          console.log('Angry')
          break;
        case 1:
          console.log('Disgusted')
          break;
        case 2:
          console.log('fearful')
          break;
        case 3:
          console.log('Happy')
          break;
        case 4:
          console.log('Neutral')
          break;
        case 5:
          console.log('Sad')
          break;
        case 6:
          console.log('Surprised')
          break;
        default:
          console.log('Detect again')
      }

  }, 3000);
});
