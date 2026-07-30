import React, { useEffect, useRef, useState } from 'react'

function speak(text, rate = 0.76) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
}

export function PronunciationExercise({ exercise, onSubmit, disabled }) {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [error, setError] = useState('')
  const recorderRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    if (audioUrl) URL.revokeObjectURL(audioUrl)
  }, [audioUrl])

  async function toggleRecording() {
    if (recording && recorderRef.current) {
      recorderRef.current.stop()
      setRecording(false)
      return
    }

    try {
      setError('')
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Tu navegador no permite grabar audio.')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []
      streamRef.current = stream
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => chunks.push(event.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        if (audioUrl) URL.revokeObjectURL(audioUrl)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }
      recorder.start()
      setRecording(true)
    } catch (recordingError) {
      setError(recordingError.message)
    }
  }

  return (
    <div className="pronunciation-exercise">
      <div className="model-phrase">
        <span>Modelo</span>
        <strong>{exercise.prompt}</strong>
        <div>
          <button type="button" onClick={() => speak(exercise.prompt)}>▶ Escuchar</button>
          <button type="button" onClick={() => speak(exercise.prompt, 0.58)}>Modo lento</button>
        </div>
      </div>
      {exercise.content?.pronunciation?.student_feedback && (
        <p className="support-copy">{exercise.content.pronunciation.student_feedback}</p>
      )}
      <div className="recording-box">
        <button className={recording ? 'record-button active' : 'record-button'} type="button" onClick={toggleRecording}>
          {recording ? '■ Detener' : '● Grabar mi voz'}
        </button>
        {recording && <span className="recording-status">Grabando...</span>}
        {audioUrl && <audio controls src={audioUrl} />}
        {error && <p className="inline-error">{error}</p>}
      </div>
      <p className="privacy-note">
        La grabación se reproduce solo en este dispositivo. En esta fase registraremos la práctica; la evaluación automática de voz se conectará después.
      </p>
      <button
        className="primary-button"
        disabled={disabled || !audioUrl}
        type="button"
        onClick={() => onSubmit({
          kind: 'pronunciation_practice',
          value: { target: exercise.prompt, recorded: true },
        })}
      >
        Terminé mi práctica
      </button>
    </div>
  )
}
