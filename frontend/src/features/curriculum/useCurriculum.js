import { useEffect, useState } from 'react'
import { fetchA1Modules, fetchTopicLessons, fetchTopics } from './curriculumRepository'

export function useCurriculum(userId) {
  const [modules, setModules] = useState([])
  const [topics, setTopics] = useState([])
  const [lessons, setLessons] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [topicLoading, setTopicLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadModules() {
      try {
        setLoading(true)
        const nextModules = await fetchA1Modules()
        if (!active) return
        setModules(nextModules)
        setSelectedModule(nextModules[0] ?? null)
      } catch (loadError) {
        if (active) setError(loadError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadModules()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!selectedModule) return undefined
    let active = true

    async function loadTopics() {
      try {
        setTopicLoading(true)
        setError('')
        const nextTopics = await fetchTopics(selectedModule.id)
        if (!active) return
        setTopics(nextTopics)
        setSelectedTopic(null)
        setSelectedLesson(null)
        setLessons([])
      } catch (loadError) {
        if (active) setError(loadError.message)
      } finally {
        if (active) setTopicLoading(false)
      }
    }

    loadTopics()
    return () => { active = false }
  }, [selectedModule])

  async function openTopic(topic) {
    if (!topic) {
      setSelectedTopic(null)
      setSelectedLesson(null)
      setLessons([])
      return
    }

    try {
      setTopicLoading(true)
      setError('')
      setSelectedTopic(topic)
      setSelectedLesson(null)
      const nextLessons = await fetchTopicLessons(topic.id, userId)
      setLessons(nextLessons)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setTopicLoading(false)
    }
  }

  async function refreshLessons() {
    if (!selectedTopic) return
    try {
      const nextLessons = await fetchTopicLessons(selectedTopic.id, userId)
      setLessons(nextLessons)
    } catch (loadError) {
      setError(loadError.message)
    }
  }

  return {
    modules,
    topics,
    lessons,
    selectedModule,
    selectedTopic,
    selectedLesson,
    loading,
    topicLoading,
    error,
    setSelectedModule,
    setSelectedLesson,
    openTopic,
    refreshLessons,
  }
}
