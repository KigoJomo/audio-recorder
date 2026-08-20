# Audio Recorder

A small MediaRecorder experiment for capturing microphone audio in the browser and playing it back immediately.

The app asks for microphone access when recording starts. Stopping creates an `audio/webm` file in memory and passes it to the page as a normal `File`. Nothing is uploaded or saved, and clearing the recording revokes its temporary object URL.

## Run it locally

```bash
bun install
bun run dev
```

Open `http://localhost:3000` and allow microphone access when the browser asks.

Microphone capture requires a secure context. `localhost` is allowed during development, but a deployed copy must use HTTPS. The default `audio/webm` format also depends on browser support, so Safari may need a different MIME type.

## Reuse the component

[`components/audio-recorder.tsx`](components/audio-recorder.tsx) accepts an `onRecord` callback, an optional error callback, and an optional MIME type.

```tsx
<AudioRecorder
  mimeType="audio/webm"
  onRecord={(file) => console.log(file.name, file.size)}
/>
```

## Check it

```bash
bun run lint
bun run build
```
