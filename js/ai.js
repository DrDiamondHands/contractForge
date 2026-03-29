/**
 * ai.js — AI Draft Assistant panel
 * Manages the chat UI, builds contract context for the system
 * prompt, and calls the Anthropic API.
 */

let aiHistory = [];  // Conversation history sent with each API call

// ═══════════════════════════════════════════
// CONTEXT BUILDER
// ═══════════════════════════════════════════

/** Build a compact contract context string for the AI system prompt. */
function buildContractContext() {
  const c = getActive();
  if (!c) return 'No contract file currently selected.';

  const info = c.info || {};
  return [
    `Contract File: "${c.title}"`,
    `Type: ${CONTRACT_TYPE_LABELS[c.type] || c.type}`,
    `Contract Number: ${info['ci-number']    || 'TBD'}`,
    `Contracting Officer: ${info['ci-co']    || 'TBD'}`,
    `Contractor: ${info['ci-contractor']     || 'TBD'}`,
    `Estimated Value: $${Number(info['ci-value'] || 0).toLocaleString()}`,
    `Description: ${info['ci-desc']          || 'Not provided'}`,
  ].join('\n');
}

// ═══════════════════════════════════════════
// INPUT HELPERS
// ═══════════════════════════════════════════

/** Populate the AI input field with a quick-prompt string. */
function setAIPrompt(text) {
  const input = document.getElementById('ai-input');
  input.value = text;
  input.focus();
}

/** Send on Enter (without Shift). */
function handleAIKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendAIMessage();
  }
}

// ═══════════════════════════════════════════
// SEND MESSAGE
// ═══════════════════════════════════════════

async function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  appendMessage('user', text);

  const typingId = appendTypingIndicator();
  aiHistory.push({ role: 'user', content: text });

  const systemPrompt = `You are ContractForge AI, an expert federal contracting assistant for government contracting officers. You specialize in FAR/DFARS compliance, contract file assembly, acquisition planning, source selection, and contract administration.

Current contract context:
${buildContractContext()}

Provide clear, accurate, and actionable guidance. Reference specific FAR/DFARS parts and clauses where relevant. Draft professional contract language when requested. Always note if something requires legal review or CO warrant authority approval.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     systemPrompt,
        messages:   aiHistory,
      }),
    });

    const data  = await response.json();
    const reply = (data.content || []).map(b => b.text || '').join('') ||
                  'I encountered an error. Please try again.';

    aiHistory.push({ role: 'assistant', content: reply });
    removeTypingIndicator(typingId);
    appendMessage('ai', reply);

  } catch {
    removeTypingIndicator(typingId);
    appendMessage('ai', '⚠ Could not connect to AI. Check your network and try again.');
  }
}

// ═══════════════════════════════════════════
// CHAT UI HELPERS
// ═══════════════════════════════════════════

function appendMessage(role, text) {
  const container = document.getElementById('ai-messages');
  const div       = document.createElement('div');
  div.className   = 'msg';
  div.innerHTML   = `
    <div class="msg-avatar ${role}">${role === 'ai' ? 'CF' : 'YOU'}</div>
    <div class="msg-body ${role}">${text.replace(/\n/g, '<br>')}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
  const container = document.getElementById('ai-messages');
  const id        = 'typing_' + Date.now();
  const div       = document.createElement('div');
  div.id          = id;
  div.className   = 'msg';
  div.innerHTML   = `
    <div class="msg-avatar ai">CF</div>
    <div class="msg-body ai">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  document.getElementById(id)?.remove();
}
