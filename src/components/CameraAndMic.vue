<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12">
                <div class="camera-box">
                    <video ref="camera" autoplay playsinline class="w-100"></video>
                </div>
                <button class="btn" :class="isRecording ? 'btn-danger' : 'btn-success'" @click="toggleRecording">
                    {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';

const camera = ref(null);
const streamRef = ref(null);
const audioContext = ref(null);
const mediaRecorder = ref(null);
const recordedChunks = ref([]);

const isRecording = ref(false);

// Start recording function
const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (camera.value) camera.value.srcObject = stream;

        streamRef.value = stream;
        isRecording.value = true;

        mediaRecorder.value = new MediaRecorder(stream);
        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.value.push(event.data);
        };
        mediaRecorder.value.onstop = saveVideoToLocal;

        mediaRecorder.value.start();
    } catch (err) {
        console.error("Error accessing camera or microphone: ", err);
    }
};

// Stop recording function
const stopRecording = () => {
    if (streamRef.value) {
        streamRef.value.getTracks().forEach((track) => track.stop());
        streamRef.value = null;
        console.log("Camera and microphone stopped.");
    }

    if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
        mediaRecorder.value.stop();
    }

    if (audioContext.value) {
        audioContext.value.close().catch(err => console.error("Error closing AudioContext:", err));
    }

    isRecording.value = false;
};

// Save recorded video to local
const saveVideoToLocal = () => {
    const blob = new Blob(recordedChunks.value, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    recordedChunks.value = [];
};

// Toggle recording state
const toggleRecording = () => {
    if (isRecording.value) {
        stopRecording();
    } else {
        startRecording();
    }
};

// Automatically save recording when the document is not visible
const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && isRecording.value) {
        stopRecording();
        saveVideoToLocal();
    }
};

// Cleanup on component unmount
onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    if (isRecording.value) {
        stopRecording();
        saveVideoToLocal(); // Automatically save when component unmounts
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
    if (isRecording.value) {
        stopRecording();
        saveVideoToLocal(); // Automatically save before navigating away
    }
});
</script>

<style scoped>
.camera-box {
    width: 400px;
    height: 400px;
    border: 2px solid #007bff;
    border-radius: 10px;
    background-color: #f8f9fa;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Ensures the video covers the box without distortion */
}

.btn {
    margin-top: 20px;
}
</style>
