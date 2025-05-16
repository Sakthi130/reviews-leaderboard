// reviews.js
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-aDDMSlRPZWybuzjfxB0ip_F-YuNiITedkjYSYQGCV7amDV5kqihqQ7ajZFxwPJb59wxxpkiVblAf/pubhtml?gid=1831553687&single=true';

function parseName(email) {
  const namePart = email.split('@')[0];
  const parts = namePart.split('.');
  const capitalized = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1));
  return capitalized.join(' ');
}

async function fetchAndUpdate() {
  try {
    const res = await fetch(sheetURL);
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return;
    const headers = lines[0].split(',').map(h => h.trim());
    const emailIndex = headers.indexOf('Email Address');
    const countIndex = headers.indexOf('COUNTA of Customer Trail ID');
    if (emailIndex === -1 || countIndex === -1) {
      console.error('CSV headers not found');
      return;
    }
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const row = lines[i].split(',');
      if (row.length <= Math.max(emailIndex, countIndex)) continue;
      const email = row[emailIndex].trim();
      const count = parseInt(row[countIndex].trim(), 10);
      if (!email || isNaN(count)) continue;
      const name = parseName(email);
      data.push({ name, count });
    }
    data.sort((a, b) => b.count - a.count);
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    data.forEach((item, i) => {
      const tr = document.createElement('tr');
      // Highlight top 3 with colors
      if (i === 0) tr.classList.add('bg-yellow-300', 'text-black');
      else if (i === 1) tr.classList.add('bg-gray-300', 'text-black');
      else if (i === 2) tr.classList.add('bg-orange-300', 'text-black');
      const tdRank = document.createElement('td');
      tdRank.className = 'px-4 py-2 border border-gray-700 text-3xl text-center';
      tdRank.textContent = i + 1;
      const tdName = document.createElement('td');
      tdName.className = 'px-4 py-2 border border-gray-700 text-3xl text-left';
      // Add medal emojis for top 3
      if (i === 0) tdName.textContent = '🥇 ' + item.name;
      else if (i === 1) tdName.textContent = '🥈 ' + item.name;
      else if (i === 2) tdName.textContent = '🥉 ' + item.name;
      else tdName.textContent = item.name;
      const tdCount = document.createElement('td');
      tdCount.className = 'px-4 py-2 border border-gray-700 text-3xl text-center';
      tdCount.textContent = item.count;
      tr.appendChild(tdRank);
      tr.appendChild(tdName);
      tr.appendChild(tdCount);
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching or processing data', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAndUpdate();
  setInterval(fetchAndUpdate, 60000);
});
