// datas to work with
const data = Array.from({
  length: 100
}).map((_, index) => `Item ${index + 1}`)

// way to make easier to select elements from HTML 
const $ = (element) => document.querySelector(element);

function Pagination(NumberPerPage, maxVisibleButtons = 5) {
  // app states
  const perPage = NumberPerPage;
  const state = {
    page: 1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxVisibleButtons: maxVisibleButtons
  }

  function init() {
    update();
    controls.createListeners()
  }

  // update states like datas (items) and navigation numbers buttons
  function update() {
    list.update();
    buttons.update();
  }

  // controls to manipulate the navigation
  const controls = {
    nextPage: () => {
      state.page++
      const lastPage = state.page > state.totalPage;
      lastPage ? state.page-- : null;
    },
    prevPage: () => {
      state.page--
      const firstPage = state.page <= 0;
      firstPage ? state.page++ : null
    },
    goToPage: (page) => {
      if (page < 1) {
        return state.page = 1;
      }
      if (page > state.totalPage) {
        return state.page = state.totalPage;
      }
      state.page = page;
    },
    createListeners() {
      $('.first').addEventListener('click', () => {
        controls.goToPage(1);
        update();
      })
      $('.prev').addEventListener('click', () => {
        controls.prevPage();
        update();
      })
      $('.next').addEventListener('click', () => {
        controls.nextPage();
        update();
      })
      $('.last').addEventListener('click', () => {
        controls.goToPage(state.totalPage);
        update();
      })
    }
  }

  // populate lists on screen 
  const list = {
    create(item) {
      const list = $('.list')
      const div = document.createElement('div');
      div.classList.add('item')
      div.innerHTML = item;
      list.appendChild(div);
    },
    update() {
      $('.list').innerHTML = '';
      let page = state.page - 1;

      let start = page * state.perPage;
      let end = start + state.perPage;

      const paginatedItems = data.slice(start, end)

      paginatedItems.map(list.create)
    },
  }
  // manipulate numbers buttons on navigation
  const buttons = {
    create(number) {
      const button = document.createElement('div');
      button.innerHTML = number;
      if (state.page == number) {
        button.classList.add('active');
      }
      button.addEventListener('click', (event) => {
        const page = event.target.innerText;
        controls.goToPage(parseInt(page));
        update();
      })
      $('.numbers').appendChild(button);
    },
    update() {
      $('.numbers').innerHTML = '';
      const { maxLeft, maxRight } = buttons.calculateMaxVisible();
      for (let page = maxLeft; page < maxRight; page++) {
        buttons.create(page);
      }
    },
    calculateMaxVisible() {
      const { page, maxVisibleButtons, totalPage } = state;
      let maxLeft = page - Math.floor(maxVisibleButtons / 2);
      let maxRight = page + Math.floor(maxVisibleButtons / 2);
      if (maxLeft < 1) {
        maxLeft = 1;
        maxRight = maxVisibleButtons;
      }
      if (maxRight > totalPage) {
        maxRight = totalPage + 1;
        maxLeft = totalPage - (maxVisibleButtons - 2);
      }
      return { maxLeft, maxRight };

    }
  }

  init();
}


// initiate with 5 contents per page and 5 buttons visible on screen to navigate
const pagination = new Pagination(5, 5);