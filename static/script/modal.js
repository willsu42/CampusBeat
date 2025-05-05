// // -------------- LOAD "MY COLLECTION" --------------
// document.getElementById("collectionLink").addEventListener("click", (e) => {
//   e.preventDefault();
//   document.getElementById("collectionSection").style.display = "block";
//   document.querySelector(".home").style.display = "none";
//   loadMyCollection();
// });
document.getElementById("collectionLink").addEventListener("click", (e) => {
  e.preventDefault();

  const playlistId = document.getElementById("playlistSelect").value;
  console.log("🎯 Playlist ID selected:", playlistId); 

  if (!playlistId) {
    alert("Please select a playlist first.");
    return;
  }

  document.getElementById("collectionSection").style.display = "block";
  document.querySelector(".home").style.display = "none";
  document.getElementById("collectionTitle").textContent = "🎵 Your Playlist";

  loadPlaylistSongs(playlistId);
});



// -------------- LOAD "HOME" --------------
document.getElementById("homeLink").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("collectionSection").style.display = "none";
  document.querySelector(".home").style.display = "flex";
});

// -------------- LOAD TOP 5 SONGS --------------
window.addEventListener('DOMContentLoaded', () => {
  loadTopSongs();
});


// -------------- LOAD TOP 3 SONGS --------------
async function loadTopSongs() {
  try {
    let response = await fetch('/top_songs');
    if (!response.ok) throw new Error(`Status ${response.status}`);
    let topSongs = await response.json();

    const container = document.getElementById("topSongsContainer");
    container.innerHTML = "";

    topSongs.forEach(song => {
      const item = document.createElement("div");
      item.className = "top-song-item";
      item.innerHTML = `
        <span>${song.title} - ${song.artist} (${song.play_count} plays)</span>
        <button class="add-btn">+</button>
      `;
      // Add click event
      item.querySelector('.add-btn').addEventListener('click', () => {
        addToPlaylist(song._id);
        //addToCollection(song);
      });
      container.appendChild(item);
    });
  } catch (err) {
    console.error("Error loading top songs:", err);
  }
}

// -------------- SEARCH --------------
async function performSearch() {
  const container = document.getElementById("searchResults");
  container.innerHTML = "";

  const search = document.getElementById("search").value.trim();
  if (!search) return;

  try {
    const response = await fetch(`/search?search=${search}`);
    if (!response.ok) {
      throw new Error(`Error: HTTP ${response.status}`);
    }

    const results = await response.json();

    // If no results
    if (!results || results.length === 0) {
      container.innerHTML = "<p>No results found.</p>";
      return;
    }

    // Display each result
    results.forEach(song => {
      const div = document.createElement("div");
      div.className = "top-song-item";
      // Make the text color white
      div.style.color = "white";

      div.innerHTML = `
        <span>${song.title} - ${song.artist} | ${song.album} (${song.play_count} plays, ${song.duration})
        </span>
        <button class="add-btn">+</button>
      `;
      // Add "click" listener to the + button
      div.querySelector('.add-btn').addEventListener('click', () => {
        console.log("Adding song to playlist:", song._id);  // ✅ debug log
        addToPlaylist(song._id);
      });
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Search error:", err);
  }
}


// // -------------- ADD TO COLLECTION --------------
// async function addToCollection(song) {
//   try {
//     let response = await fetch('/add-to-collection', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(song)
//     });
//     let result = await response.json();
//     alert(result.message || "Song added!");
//   } catch (err) {
//     console.error("Error adding to collection:", err);
//   }
// }

async function addToPlaylist(songId) {
  const playlistId = document.getElementById("playlistSelect").value;

  if (!playlistId) {
    alert("Please select a playlist first.");
    return;
  }

  try {
    const response = await fetch('/add-to-playlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        song_id: songId,
        playlist_id: playlistId
      })
    });

    const result = await response.json();
    alert(result.message || "Song added to playlist!");
  } catch (err) {
    console.error("Error adding to playlist:", err);
  }
}




// -------------- LOAD "MY COLLECTION" --------------
async function loadMyCollection() {
  const container = document.getElementById("collectionContainer");
  container.innerHTML = "";

  try {
    const response = await fetch('/my-collection');
    const songs = await response.json();

    if (!songs.length) {
      container.innerHTML = "<p>Your collection is empty.</p>";
      return;
    }

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "top-song-item";
      div.innerHTML = `
        <span>${song.name} - ${song.artist} (${song.genre})</span>
        <button class="add-btn">Remove</button>
      `;
      div.querySelector('.add-btn').addEventListener('click', () => {
        removeFromCollection(song.id);
      });
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load collection:", err);
  }
}

async function removeFromCollection(songId) {
  try {
    await fetch('/remove-from-collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: songId })
    });
    loadMyCollection(); // refresh view
  } catch (err) {
    console.error("Error removing song:", err);
  }
}

async function loadPlaylists() {
  
  try {
    const response = await fetch('/get-playlists');
    const playlists = await response.json();
    const select = document.getElementById('playlistSelect');
    select.innerHTML = '<option value="">Select Playlist</option>'; // Reset

    playlists.forEach(pl => {
      const option = document.createElement('option');
      option.value = pl._id;
      option.textContent = pl.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load playlists:", err);
  }
}


window.onload = function () {
  loadPlaylists();  // ✅ This will run after the page fully loads
};

async function loadPlaylistSongs(playlistId) {
  console.log("📣 loadPlaylistSongs called with:", playlistId);

  if (!playlistId) {
    console.warn("No playlist ID provided.");
    return;
  }

  try {
    const response = await fetch(`/playlist/${playlistId}`);
    const songs = await response.json();
    console.log("🎵 Songs loaded:", songs);

    const container = document.getElementById("playlistSongsContainer");
    if (!container) {
      console.error("❌ Container #playlistSongsContainer not found in HTML.");
      return;
    }

    container.innerHTML = "";

    if (songs.length === 0) {
      container.innerHTML = "<p>No songs in this playlist yet.</p>";
      return;
    }

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "playlist-song-item";
      div.innerHTML = `
        ${song.title} - ${song.artist} || ${song.album} (${song.play_count} plays, ${song.duration})
       <button class="remove-btn">Remove</button>
        `;
      
      // ✅ Add remove button functionality
      div.querySelector(".remove-btn").addEventListener("click", () => {
      const playlistId = document.getElementById("playlistSelect").value;
      removeFromPlaylist(song.id, playlistId);
      });
      container.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Error loading playlist songs:", err);
  }
}

async function removeFromPlaylist(songId, playlistId) {
  try {
    const response = await fetch('/remove-from-playlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ song_id: songId, playlist_id: playlistId })
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      loadPlaylistSongs(playlistId); // ✅ Refresh the list
    } else {
      console.error("❌ Remove error:", result);
      alert(result.error || "Failed to remove song.");
    }
  } catch (err) {
    console.error("❌ Request error:", err);
  }
}

async function loadRecommendationsByGenre() {
  const genre = document.getElementById("genreDropdown").value;
  if (!genre) {
    alert("Please select a genre.");
    return;
  }

  try {
    const response = await fetch(`/recommend-by-genre?genre=${encodeURIComponent(genre)}`);
    const songs = await response.json();
    const container = document.getElementById("recommendationContainer");
    container.innerHTML = "";

    if (!songs || songs.length === 0) {
      container.innerHTML = "<p>No recommendations found for this genre.</p>";
      return;
    }

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "recommendation-item";
      div.innerHTML = `
        <strong>${song.title}</strong> - ${song.artist} | ${song.album} (${song.duration})<br>
        Plays: ${song.play_count}
        <button class="add-btn">Add +</button>
      `;

      div.querySelector(".add-btn").addEventListener("click", () => {
        const playlistId = document.getElementById("playlistSelect").value;
        addToPlaylist(song.id, playlistId);
      });

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching genre recommendations:", err);
  }
}

