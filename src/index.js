import axios from "axios";
import Notiflix from "notiflix";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "39497508-491be661073b62dac12b07e34";

const form = document.getElementById("search-form");
const input = form.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let page = 1;
let currentSearch = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query === "") {
    Notiflix.Notify.failure("Please enter a search keyword.");
    return;
  }

  currentSearch = query;
  page = 1;
  gallery.innerHTML = "";
  loadMoreBtn.style.display = "none";

  searchImages(query);
});

loadMoreBtn.addEventListener("click", () => {
  page += 1;
  searchImages(currentSearch, page);
});

async function searchImages(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    page: page,
    per_page: 40,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    const data = response.data;

    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
        "Sorry, there are no images matching your search query. Please try again."
      );
      return;
    }

    createGallery(data.hits);

    if (data.totalHits > page * 40) {
      loadMoreBtn.style.display = "block";
    } else {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    Notiflix.Notify.failure("An error occurred while fetching images.");
  }
}

function createGallery(images) {
  images.forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("photo-card");
    card.innerHTML = `
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                <p class="info-item"><b>Views:</b> ${image.views}</p>
                <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
            </div>
        `;
    gallery.appendChild(card);
  });
}
