import axios from 'axios';
import { Notify } from 'notiflix';
export default class PhotoApiService {
  constructor() {
    this.API_KEY = '34883427-fe70cd3747fe88c31215abbc1';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  getPhotos = async () => {
    try {
      const { data } = await axios.get(
        `${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}`,
        {
          params: {
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: this.per_page,
          },
        }
      );
      this.incrementPageNum();
      return data;
    } catch (err) {
      return Notify.failure(err.message + ` Please, try again later`);
    }
  };
  incrementPageNum() {
    this.page += 1;
  }
  resetPageNum() {
    this.page = 1;
  }
}
