import fs from 'node:fs';
import path from 'node:path';

const sourceDir = path.resolve('E:/GoIngrid/content/lessons/A1/final');
const outputFile = path.resolve('E:/GoIngrid/supabase/seeds/100_import_a1_content.sql');
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

const sql = (value) => value == null ? 'null' : "'" + String(value).replaceAll("'", "''") + "'";
const json = (value) => value == null ? 'null' : sql(JSON.stringify(value)) + '::jsonb';
const array = (value) => value?.length ? 'ARRAY[' + value.map(sql).join(', ') + ']::text[]' : 'ARRAY[]::text[]';
const files = fs.readdirSync(sourceDir).filter((name) => name.endsWith('.json')).sort();
const contents = files.map((name) => JSON.parse(fs.readFileSync(path.join(sourceDir, name), 'utf8')));
const out = [];

out.push('-- Generated from content/lessons/A1/final. Do not edit manually.');
out.push('begin;');
out.push('');
out.push('do $$');
out.push('declare');
out.push('  v_level_id uuid; v_module_id uuid; v_topic_id uuid; v_lesson_id uuid; v_exercise_id uuid;');
out.push('begin');

for (const topic of contents) {
  const moduleOrder = Number(topic.module_code.split('-M')[1]);
  const topicOrder = Number(topic.id.split('-T')[1]);
  out.push('  select id into v_level_id from public.levels where code = ' + sql(topic.level) + ' limit 1;');
  out.push('  if v_level_id is null then raise exception ' + sql('Missing level ' + topic.level) + '; end if;');
  out.push('  select id into v_module_id from public.modules where level_id = v_level_id and sort_order = ' + moduleOrder + ' limit 1;');
  out.push('  if v_module_id is null then raise exception ' + sql('Missing module ' + topic.module_code) + '; end if;');
  out.push('  select id into v_topic_id from public.topics where module_id = v_module_id and sort_order = ' + topicOrder + ' limit 1;');
  out.push('  if v_topic_id is null then raise exception ' + sql('Missing topic ' + topic.id) + '; end if;');

  for (let lessonIndex = 0; lessonIndex < topic.lessons.length; lessonIndex++) {
    const lesson = topic.lessons[lessonIndex];
    const lessonOrder = lessonIndex + 1;
    const estimatedMinutes = Math.max(1, Math.ceil((lesson.estimated_seconds ?? 600) / 60));
    out.push('  insert into public.lessons (topic_id, title, objective, estimated_minutes, sort_order, is_published, skill_focus, cefr_objectives, estimated_seconds)');
    out.push('  select v_topic_id, ' + sql(lesson.title) + ', ' + sql(lesson.objective) + ', ' + estimatedMinutes + ', ' + lessonOrder + ', true, ' + array([...new Set(lesson.activities.map((a) => a.skill).filter(Boolean))]) + ', ' + array(topic.cefr_objectives ?? []) + ', ' + (lesson.estimated_seconds ?? 600));
    out.push('  where not exists (select 1 from public.lessons where topic_id = v_topic_id and sort_order = ' + lessonOrder + ');');
    out.push('  select id into v_lesson_id from public.lessons where topic_id = v_topic_id and sort_order = ' + lessonOrder + ' limit 1;');

    for (let exerciseIndex = 0; exerciseIndex < lesson.activities.length; exerciseIndex++) {
      const activity = lesson.activities[exerciseIndex];
      const explanation = activity.feedback_incorrect ?? activity.feedback_correct ?? null;
      const correctAnswer = activity.correct_answer ?? activity.expected_answers ?? null;
      const estimatedSeconds = activity.estimated_seconds ?? 45;
      out.push('  insert into public.exercises (lesson_id, exercise_type, prompt, explanation, correct_answer, difficulty, sort_order, is_published, skill, estimated_seconds, source_type)');
      out.push('  select v_lesson_id, ' + sql(activity.type) + ', ' + sql(activity.prompt ?? activity.instruction) + ', ' + sql(explanation) + ', ' + json(correctAnswer) + ', ' + (activity.difficulty ?? 1) + ', ' + (exerciseIndex + 1) + ', true, ' + sql(activity.skill ?? 'grammar') + ', ' + estimatedSeconds + ', ' + sql('original'));
      out.push('  where not exists (select 1 from public.exercises where lesson_id = v_lesson_id and sort_order = ' + (exerciseIndex + 1) + ');');
      out.push('  select id into v_exercise_id from public.exercises where lesson_id = v_lesson_id and sort_order = ' + (exerciseIndex + 1) + ' limit 1;');
      if (Array.isArray(activity.options)) {
        for (let optionIndex = 0; optionIndex < activity.options.length; optionIndex++) {
          const option = activity.options[optionIndex];
          const isCorrect = JSON.stringify(option) === JSON.stringify(activity.correct_answer);
          out.push('  insert into public.exercise_options (exercise_id, option_text, is_correct, sort_order)');
          out.push('  select v_exercise_id, ' + sql(option) + ', ' + isCorrect + ', ' + (optionIndex + 1));
          out.push('  where not exists (select 1 from public.exercise_options where exercise_id = v_exercise_id and sort_order = ' + (optionIndex + 1) + ');');
        }
      }
    }
  }
}

out.push('end $$;');
out.push('commit;');
out.push('');
fs.writeFileSync(outputFile, out.join('\n'), 'utf8');
console.log('Generated ' + outputFile + ' (' + out.length + ' SQL lines).');
