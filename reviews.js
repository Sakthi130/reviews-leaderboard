<script>
  // Google Sheet URL published as CSV (Update this link with your sheet's published CSV link)
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfILz4H_k-hywt-s1D7n6Vvs3Sp_97ouZY-CdT0zu8dgkCKLdutfAgl1TOnqlKcYSc2nZgFVon6Nwi/pub?output=csv';

  async function fetchLeaderboardData() {
    const response = await fetch(sheetUrl);
    const text = await response.text();

    const rows = text.trim().split('\n').slice(1); // Skip header
    const data = rows.map(row => {
      const [email, count] = row.split(',');
      const name = email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Clean name
      return { email, name, count: parseInt(count) };
    });

    // Sort by review count descending
    data.sort((a, b) => b.count - a.count);

    // Render
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';

    data.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2 px-4 text-center">${index + 1}</td>
        <td class="py-2 px-4">${item.name}</td>
        <td class="py-2 px-4 text-center font-semibold ${index === 0 ? 'text-green-600 text-xl' : ''}">
          ${item.count}
        </td>
      `;
      leaderboardBody.appendChild(tr);
    });
  }

  // Initial load
  fetchLeaderboardData();

  // Auto-refresh leaderboard every 60 seconds
  setInterval(fetchLeaderboardData, 60000);
</script>