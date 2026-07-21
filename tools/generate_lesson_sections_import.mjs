import fs from 'node:fs';
import path from 'node:path';

const sourceDir = path.resolve('E:/GoIngrid/content/lessons/A1/final');
const outputFile = path.resolve('E:/GoIngrid/supabase/seeds/101_import_lesson_sections.sql');
const sql = (value) => "'" + String(value ?? '').replaceAll("'", "''") + "'";
const json = (value) => sql(JSON.stringify(value ?? {})) + '::jsonb';
const files = fs.readdirSync(sourceDir).filter((name) => name.endsWith('.json')).sort();
const out = ['-- Generated lesson teaching sections.', 'begin;', 'do $$', 'declare', '  v_topic_id uuid; v_lesson_id uuid;', 'begin'];

for (const file of files) {
  const topic = JSON.parse(fs.readFileSync(path.join(sourceDir, file), 'utf8'));
  const moduleOrder = Number(topic.module_code.split('-M')[1]);
  const topicOrder = Number(topic.id.split('-T')[1]);
  out.push('  select t.id into v_topic_id from public.topics t join public.modules m on m.id=t.module_id join public.levels lv on lv.id=m.level_id where lv.code=' + sql(topic.level) + ' and m.sort_order=' + moduleOrder + ' and t.sort_order=' + topicOrder + ' limit 1;');
  for (let i = 0; i < topic.lessons.length; i++) {
    const lesson = topic.lessons[i];
    const order = i + 1;
    out.push('  select id into v_lesson_id from public.lessons where topic_id=v_topic_id and sort_order=' + order + ' limit 1;');
    const sections = [
      ['explanation', 'Explicación', { language: 'es', text: topic.explanation_es, objective: lesson.objective }],
      ['examples', 'Ejemplos clave', { phrases: topic.key_language ?? [], vocabulary: topic.vocabulary ?? [] }],
      ['pronunciation', 'Pronunciación', { targets: topic.pronunciation_targets ?? [], notes: topic.spanish_speaker_notes ?? [] }],
      ['review', 'Repaso y dominio', { review_schedule: topic.review_schedule ?? [1, 3, 7, 14, 30], mastery: topic.mastery_criteria ?? { minimum_score: 0.8 } }]
    ];
    for (let s = 0; s < sections.length; s++) {
      const section = sections[s];
      out.push('  insert into public.lesson_sections (lesson_id, section_type, title, content, sort_order) select v_lesson_id, ' + sql(section[0]) + ', ' + sql(section[1]) + ', ' + json(section[2]) + ', ' + (s + 1) + ' where not exists (select 1 from public.lesson_sections where lesson_id=v_lesson_id and sort_order=' + (s + 1) + ');');
    }
  }
}

out.push('end $$;', 'commit;', '');
fs.writeFileSync(outputFile, out.join('\n'), 'utf8');
console.log('Generated ' + outputFile);
