import PhotoApiService from './getPhotoApi';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const watchPoinEl = document.querySelector('.watchpoint');
console.log('watchPoinEl:', watchPoinEl);
let allHits = 0;
const photoApiService = new PhotoApiService();
let gallery = new SimpleLightbox('.photo-card a', {
  loop: false,
});

formEl.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  resetPhotoList();
  photoApiService.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();

  if (photoApiService.searchQuery === '') {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  photoApiService.resetPageNum();
  resetPhotoList();
  photoApiService.getPhotos().then(({ hits, totalHits }) => {
    allHits = hits.length;
    if (hits.length > totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    if (totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    } else createPhotoMarkup(hits);
    gallery.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
  });
}

function createPhotoMarkup(photos) {
  galleryListEl.insertAdjacentHTML(
    'beforeend',
    photos
      .map(photo => {
        return ` <div class="photo-card">
      <a href="${photo.largeImageURL}"><img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy"  />
</a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${photo.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${photo.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${photos.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${photo.downloads}
        </p>
      </div>
    </div>`;
      })
      .join('')
  );
}

function resetPhotoList() {
  galleryListEl.innerHTML = '';
}
