const form = document.querySelector('#questionForm');
const answerCard = document.querySelector('#answerCard');
const WEBHOOK_URL = 'https://YOUR-N8N-DOMAIN/webhook/classify';

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
    const result = await response.json();
        answerCard.innerHTML = `<b>${result.category}</b><p>${result.answer}</p><small>중요도: ${result.priority}</small>`;
  } catch (error) {
    answerCard.textContent = '연결에 실패했습니다. Webhook URL을 확인하세요.';
    console.error(error);
  }
});
