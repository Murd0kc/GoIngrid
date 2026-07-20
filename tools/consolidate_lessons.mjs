import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('E:/GoIngrid/content/lessons/A1');
const partsDir = path.join(root, 'parts');
const outputDir = path.join(root, 'final');
fs.mkdirSync(outputDir, { recursive: true });

const topicFiles = fs.readdirSync(root).filter((name) => /^A1-M\d-T\d+\.json$/.test(name));
const partFiles = fs.readdirSync(partsDir).filter((name) => /^A1-M\d-T\d+-L\d+\.json$/.test(name));
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const groups = new Map();

for (const name of topicFiles) {
  const data = readJson(path.join(root, name));
  groups.set(data.id, { metadata: data, lessons: data.lessons ?? [] });
}

for (const name of partFiles) {
  const data = readJson(path.join(partsDir, name));
  const topicId = data.id.replace(/-L\d+$/, '');
  if (!groups.has(topicId)) {
    groups.set(topicId, {
      metadata: {
        id: topicId,
        level: data.level,
        module_code: data.module_code,
        topic: data.topic,
        title: data.topic,
        estimated_seconds: 3600,
        communication_goal: 'Usar ' + data.topic.toLowerCase() + ' en situaciones cotidianas.',
        cefr_objectives: ['Can use basic language related to ' + data.topic.toLowerCase() + '.'],
        explanation_es: 'Este tema desarrolla ' + data.topic.toLowerCase() + ' mediante práctica guiada y comunicación contextual.',
        key_language: [],
        spanish_speaker_notes: [],
        pronunciation_targets: [],
        vocabulary: []
      },
      lessons: []
    });
  }
  groups.get(topicId).lessons.push(data);
}

for (const [topicId, group] of groups) {
  group.lessons.sort((a, b) => a.id.localeCompare(b.id));
  if (group.lessons.length !== 4) throw new Error(topicId + ': expected 4 lessons, found ' + group.lessons.length);
  const activityCount = group.lessons.reduce((sum, lesson) => sum + lesson.activities.length, 0);
  if (activityCount !== 40) throw new Error(topicId + ': expected 40 activities, found ' + activityCount);
  const output = {
    ...group.metadata,
    lessons: group.lessons,
    estimated_seconds: group.lessons.reduce((sum, lesson) => sum + lesson.estimated_seconds, 0),
    activity_count: activityCount,
    lesson_count: group.lessons.length,
    review_schedule: group.metadata.review_schedule ?? [1, 3, 7, 14, 30],
    mastery_criteria: group.metadata.mastery_criteria ?? {
      minimum_score: 0.8,
      transfer_required: true,
      pronunciation_is_intelligibility_first: true
    }
  };
  fs.writeFileSync(path.join(outputDir, topicId + '.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
}

console.log('Consolidados ' + groups.size + ' temas, ' + groups.size * 4 + ' lecciones y ' + groups.size * 40 + ' actividades.');
