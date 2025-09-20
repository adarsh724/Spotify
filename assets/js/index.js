const audio = document.getElementById("audio-player");

function songPlay(url) {
  audio.src = url;
  audio.play();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const ul = document.getElementById("songs-ul-list");
  const pageHeading = document.getElementById("page-heading");
  const likedAnchor = document.getElementById("anchor-tag");
  const homeAnchor = document.getElementById("home-anchor");
  const unlikeSong = document.querySelectorAll('.like-link');

  // Search filter
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const songItems = document.querySelectorAll(".song-item");

      songItems.forEach((item) => {
        const title = item.querySelector("h3")?.textContent.toLowerCase() || "";
        let artist = "";
        item.querySelectorAll("p").forEach((p) => {
          if (p.textContent.toLowerCase().includes("artist:")) {
            artist = p.textContent.toLowerCase().replace("artist:", "").trim();
          }
        });

        const matches = title.includes(query) || artist.includes(query);
        item.style.display = matches ? "" : "none";
      });
    });
  }

  // Like/Unlike handler using event delegation
  if (ul) {
    ul.addEventListener("click", async (e) => {
      const likeBtn = e.target.closest(".like-btn");
      if (!likeBtn) return;

      e.preventDefault();

      const songId = likeBtn.getAttribute("data-song-id");
      const icon = likeBtn.querySelector("i");

      try {
        const response = await fetch(`/songs/like/${songId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "same-origin",
        });

        const result = await response.json();

        if (result.success) {
          if (result.liked) {
            icon.classList.add("liked");
            icon.style.color = "#77bb41";
            likeBtn.innerHTML = `<i class="fa-solid fa-heart liked"></i> Liked`;
          } else {
            icon.classList.remove("liked");
            icon.style.color = "#ffffff";
            likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i> Add to favourites`;
          }
        } else {
          alert("Login required to like songs.");
          window.location.href = "/users/sign-in";
        }
      } catch (err) {
        console.error("Error liking song", err);
      }
    });
  }

  // Reusable content loader
  async function loadSongs(url, pageType) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "same-origin",
      });

      const songs = await response.json();
      if (!ul) return;

      ul.innerHTML = "";

      if (songs.length === 0) {
        ul.innerHTML = `<li><p>No ${pageType === "liked" ? "liked" : ""} songs found.</p></li>`;
      } else {
        songs.forEach((song) => {
          ul.innerHTML += generateSongItemHTML(song, pageType === "liked");
        });
      }

      pageHeading.innerText = pageType === "liked" ? "💖 Your Liked Songs" : "🎵 List of Songs";

      // Update URL without reload
      history.pushState({ page: pageType }, "", url);
    } catch (error) {
      console.error(`Error loading ${pageType} songs:`, error);
    }
  }

  // Liked Songs click
  if (likedAnchor) {
    likedAnchor.addEventListener("click", (e) => {
      e.preventDefault();
      loadSongs("/songs/likedSongs", "liked");
    });
  }

  // Home click
  if (homeAnchor) {
    homeAnchor.addEventListener("click", (e) => {
      e.preventDefault();
      loadSongs("/", "home");
    });
  }

  

  // Back/forward button handling
  window.addEventListener("popstate", (event) => {
    const path = window.location.pathname;
    if (path === "/songs/likedSongs") {
      loadSongs("/songs/likedSongs", "liked");
    } else {
      loadSongs("/", "home");
    }
  });

  // Initial auto-load on page refresh
  const initialPath = window.location.pathname;
  if (initialPath === "/songs/likedSongs") {
    loadSongs("/songs/likedSongs", "liked");
  } else if (initialPath === "/") {
    loadSongs("/", "home");
  }
});

// Helper function to generate HTML
function generateSongItemHTML(song, liked = false) {
  if (liked) {
    return `
      <li class="song-item">
          <div class="song">
            <img src="${song.coverArt}" alt="Cover Art" class="cover-image" />
            <h3>${song.title}</h3>
            <p><strong>Artist:</strong> ${song.artist}</p>
            <div class="like-icon">
              <button onclick="songPlay('${song.url}')" class="play-btn">▶</button>
              <a href="/songs/unlike/${song.id}" class="like-link">
  <i class="fa-solid fa-heart liked"></i> Remove from favourites
</a>

            </div>
          </div>
        </li>`;
  } else {
    return `
      <li class="song-item">
        <div class="song">
          <img src="${song.coverArt}" alt="Cover Art for ${song.title}" class="cover-image" />
          <h3>${song.title}</h3>
          <p><strong>Artist:</strong> ${song.artist}</p>
          <div class="like-icon">
            <button onclick="songPlay('${song.url}')" class="play-btn" aria-label="Play ${song.title}">▶</button>
            <button class="like-btn" data-song-id="${song.id}" aria-label="Add to favourites" style="background:none;border:none;color:white;">
              <i class="fa-solid fa-heart"></i> Add to favourites
            </button>
          </div>
        </div>
      </li>`;
  }
}
