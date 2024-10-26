import { IMediaRecorder, MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

let mediaRecorder: IMediaRecorder;
let audioBlobs: Blob[] = [];
let capturedStream: MediaStream;

// Register the extendable-media-recorder-wav-encoder
export const stratConnect = async () => {
  await register(await connect());
}

// Starts recording audio
export function startRecording() {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
    }
  }).then(stream => {
    audioBlobs = [];
    capturedStream = stream;

    // Use the extended MediaRecorder library
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/wav'
    });

    // Add audio blobs while recording 
    mediaRecorder.addEventListener('dataavailable', event => {
      audioBlobs.push(event.data);
    });
    mediaRecorder.start();

  }).catch((e) => {
    console.error(e);
  });

}

export function stopRecording(): Promise<Blob | null> {
  return new Promise(resolve => {
    if (!mediaRecorder) {
      resolve(null);
      return;
    }

    mediaRecorder.addEventListener('stop', () => {
      const mimeType = mediaRecorder.mimeType;
      const audioBlob = new Blob(audioBlobs, { type: mimeType });

      if (capturedStream) {
        capturedStream.getTracks().forEach(track => track.stop());
      }

      resolve(audioBlob);
    });

    mediaRecorder.stop();

  });
}