<script setup lang="ts">
import { onMounted, ref } from "vue";
import {startRecording,stopRecording,stratConnect} from "./utils/recorder"
import {convertWavToMp3} from "./utils/convert-wave-to-mp3"
import { formatAudioRecordDuration } from "./utils/format-audio-duration";

const isRecord = ref(false)
const wavAudioBlobURI  = ref("")
const mp3AudioBlobURI  = ref("")
const wavFileSize = ref("")
const mp3FileSize = ref("")
const duration = ref("")
let intervalId:NodeJS.Timeout ;
let ms = 0

const downloadFile = (uri:string,fileType:string)=>{
  return new Promise<void>((resolve)=>{
    const a = document.createElement("a")
    a.href = uri
    a.download = `recording.${fileType}`
    a.click()
    a.remove()
    resolve()
  })
}
const getFileSizeInMB = (blob:Blob) => {
    const sizeInMB = blob.size / (1024 * 1024); // Convert bytes to MB
    return sizeInMB.toFixed(2); // Format to 2 decimal places for readability
};

const toggleRecord = async()=>{
  if(isRecord.value) {
    isRecord.value = false
    duration.value = ""
    if(intervalId) clearInterval(intervalId)
    const wavAudioBlob  = await stopRecording()
    if(wavAudioBlob) {
      const mp3AudioBlob = await convertWavToMp3(wavAudioBlob)
      wavFileSize.value = getFileSizeInMB(wavAudioBlob)
      mp3FileSize.value = getFileSizeInMB(mp3AudioBlob)
      wavAudioBlobURI.value = URL.createObjectURL(wavAudioBlob)
      mp3AudioBlobURI.value = URL.createObjectURL(mp3AudioBlob)
      await downloadFile(wavAudioBlobURI.value,'wav')
      await downloadFile(mp3AudioBlobURI.value,'mp3')
    }
  }else {
    // Start recording
    isRecord.value = true
    wavAudioBlobURI.value = ""
    mp3AudioBlobURI.value = ""
    ms = 0;
    await startRecording()
    intervalId = setInterval(()=>{
      ms += 1000
      duration.value = formatAudioRecordDuration(ms)
    },1000)
  }
}


onMounted(()=>{
  stratConnect()
})

</script>

<template>
  <div>
    <button @click="toggleRecord">
      {{ isRecord ? 'Stop' : 'Start' }}
    </button>
    <p v-if="duration !== ''">Duration : {{ duration }}s</p>
    <div v-if="wavAudioBlobURI && mp3AudioBlobURI">
      <div class="audio-wr">
        <h2>Wav File</h2>
        <p>Size : {{ wavFileSize }} MB</p>
        <audio :src="wavAudioBlobURI" controls></audio>
      </div>
      <div class="audio-wr">
        <h2>Mp3 File</h2>
        <p>Size : {{ mp3FileSize }} MB</p>
        <audio :src="mp3AudioBlobURI" controls></audio>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-wr {
  margin-top: 50px;
  /* background-color: rgb(193, 191, 191); */
  border: 1px solid #FFF;
  border-radius: 20px;
  padding: 20px;
}
.audio-wr h2 {
  color: greenyellow;
}

</style>