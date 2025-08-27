import OpenAI from 'openai';

export async function generatePrep(title: string, company: string, description: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return stubPrep(title, company, description);
  }
  try {
    const client = new OpenAI({ apiKey });
    const prompt = `You are an interview coach. Role: ${title} at ${company}. Job description: ${description}. Produce JSON with keys questions (10), skills (array of {name, url}), schedule (7 days with tasks).`;
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    const content = completion.choices[0]?.message?.content || '';
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      return stubPrep(title, company, description);
    }
  } catch {
    return stubPrep(title, company, description);
  }
}

function stubPrep(title: string, company: string, _description: string) {
  const skills = [
    { name: 'System Design Basics', url: 'https://github.com/donnemartin/system-design-primer' },
    { name: 'Behavioral STAR Method', url: 'https://www.themuse.com/advice/star-interview-method' },
    { name: 'Data Structures & Algorithms', url: 'https://neetcode.io/' },
  ];
  const questions = Array.from({ length: 10 }).map((_, i) => `Question ${i + 1} tailored to ${title} at ${company}`);
  const schedule = Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, tasks: [`Practice topic ${i + 1}`, 'Mock interview 30m'] }));
  return { questions, skills, schedule };
}

