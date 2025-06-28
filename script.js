// Show live time in taskbar
function updateTime() {
  const now = new Date();
  document.getElementById('taskbar-time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

// Show terminal on icon click
document.getElementById('open-terminal').addEventListener('click', () => {
  document.getElementById('terminal').style.display = 'block';
  document.getElementById('terminal-input').focus();
});

// Terminal logic
const files = {
  "about.txt": `I'm an experienced Application Security Engineer with 2.7+ years in Web, API, and Mobile app testing.
I specialize in manually identifying logic flaws, bypassing filters, and understanding how things break.
I also explore bug bounties with a focus on business logic bugs.`,
  "contact.txt": `LinkedIn: https://linkedin.com/in/gokulkpentester/`,
};

const form = document.getElementById('terminal-form');
const input = document.getElementById('terminal-input');
const output = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

form.addEventListener('submit', () => {
  const command = input.value.trim();

  const commandLine = document.createElement('p');
  commandLine.className = 'line';
  commandLine.innerText = `<span class="prompt">❯</span> ${command}`;
  terminalBody.insertBefore(commandLine, form);

  input.value = '';

  if (command === 'clear') {
    clearTerminal();
    return;
  }

  if (command === 'ls') {
    printOutput(Object.keys(files).join('  '));
  } else if (command.startsWith('cat')) {
    const [, filename] = command.split(' ');
    if (files[filename]) {
      printOutput(files[filename]);
    } else {
      printOutput(`cat: ${filename}: No such file`);
    }
  } else {
    printOutput(`${command}: command not found`);
  }
});

function printOutput(text) {
  const outputLine = document.createElement('p');
  outputLine.className = 'output';
  outputLine.textContent = text;
  terminalBody.insertBefore(outputLine, form);
}

function clearTerminal() {
  const lines = terminalBody.querySelectorAll('.line, .output');
  lines.forEach(el => {
    if (!el.contains(input)) el.remove();
  });
  output.innerText = '';
}

// Handle clicks on non-terminal icons
document.querySelectorAll('.task-icon').forEach(icon => {
  if (icon.dataset.app && icon.dataset.app !== 'terminal') {
    icon.addEventListener('click', () => {
      showPermissionDenied(icon.alt);
    });
  }
});

function showPermissionDenied(appName) {
  // Remove existing dialog if any
  const existing = document.getElementById('permission-denied');
  if (existing) existing.remove();

  const dialog = document.createElement('div');
  dialog.id = 'permission-denied';
  dialog.innerText = `
    <div class="dialog-box">
      <h3>Permission Denied</h3>
      <p>You do not have permission to run <b>${appName}</b>.</p>
      <p>Please contact your system administrator.</p>
      <button onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;
  document.body.appendChild(dialog);
}
