<template>
  <div class="my-5">
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="productItem in products" :key="productItem.id">
        <div class="card h-100">
          <img
            :src="productItem.imageUrl"
            class="img-fluid card-img-top2"
            :alt="productItem.title"
          />
          <div class="card-body">
            <h5 class="card-title">{{ productItem.title }}</h5>
            <p class="card-text">
              {{ productItem.description }}
            </p>
          </div>
          <div class="card-footer bg-transparent d-flex justify-content-between">
            <RouterLink :to="`/products/${productItem.id}`"
            class="btn btn-outline-primary" type="button"
              >查看更多</RouterLink
            >
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="addToCart(productItem.id)"
              :disabled="productItem.id === status.addCartLoading"
            >
              <span class="spinner-border spinner-border-sm"
                aria-hidden="true"
                v-if="productItem.id === status.addCartLoading"
              ></span>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.table-transparent {
  background-color: transparent !important;
}
.table-image {
  height: 100px;
  width: 100px;
  object-fit: cover;
}
.card-img-top2 {
  height: 200px;
  object-fit: cover;
}
</style>
<script>
import axios from 'axios';

const { VITE_APP_API_URL, VITE_APP_API_NAME } = import.meta.env;

export default {
  data() {
    return {
      products: [],
      loadingStatus: {
        loadingItem: '',
      },
      status: {
        addCartLoading: '',
        carteQtyLoading: '',
      },
      isLoading: false,
    };
  },
  methods: {
    addToCart(id, qty = 1) {
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      this.status.addCartLoading = id;
      axios
        .post(url, { data: cart })
        .then((response) => {
          this.status.addCartLoading = '';
          alert(response.data.message);
        })
        .catch((err) => {
          alert(err.response);
        });
    },
    getProducts() {
      axios
        .get(`${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/products`)
        .then((res) => {
          console.log(res);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(`${err.response.data.message}`);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
