const form = document.querySelector('#questionForm');
const answerCard = document.querySelector('#answerCard');
const WEBHOOK_URL = 'https://gt4065b.zeabur.app/webhook/classify';

// AI 답변이 ```json ... ``` 으로 감싸져 와도 읽을 수 있게 처리
function parseResult(text) {
  const clean = text.replace(/```json|```/g, '').trim();
  try { return JSON.parse(clean); } catch { return { answer: clean }; }
}
const esc = (s) => String(s ?? '-').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = document.querySelector('#question').value.trim();
  if (!question) return;

  answerCard.textContent = '에이전트가 질문을 분석하고 있습니다...';
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    if (!response.ok) throw new Error('Webhook 응답 오류');
    const result = parseResult(await response.text());
    answerCard.innerHTML = `<b>${esc(result.category)}</b><p>${esc(result.answer)}</p><small>중요도: ${esc(result.priority)}</small>`;
  } catch (error) {
    answerCard.textContent = '연결에 실패했습니다. Webhook URL을 확인하세요.';
    console.error(error);
  }
});
