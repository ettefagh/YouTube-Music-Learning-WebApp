export class AudioRecorderEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioCtx: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;

  isRecording = $state(false);
  volumeLevel = $state(0);
  activeMimeType = $state('audio/webm;codecs=opus');

  private detectBestMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus'
    ];
    for (const type of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }

  async start(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.activeMimeType = this.detectBestMimeType();

    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = this.audioCtx.createMediaStreamSource(stream);
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.fftSize = 64;
    source.connect(this.analyserNode);

    this.monitorVolume();

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: this.activeMimeType || undefined,
      audioBitsPerSecond: 96000 // Constrain bitrate to save disk space
    });

    this.audioChunks = [];
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.start(100);
    this.isRecording = true;
  }

  private monitorVolume() {
    if (!this.analyserNode) return;
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);

    const update = () => {
      if (!this.isRecording || !this.analyserNode) return;
      this.analyserNode.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      this.volumeLevel = sum / dataArray.length / 255;
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  async stop(): Promise<{ blob: Blob; mimeType: string }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return;
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.activeMimeType });
        this.isRecording = false;
        this.audioCtx?.close();
        resolve({ blob: audioBlob, mimeType: this.activeMimeType });
      };
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }
}
