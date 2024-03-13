<template>
  <div class="container my-5">
    <h2 class="text-center">這是後台</h2>
    <nav class="mb-3 text-center">
      <RouterLink to="/admin/products">產品列表</RouterLink> |
      <RouterLink to="/admin/order">訂單列表</RouterLink> |
      <RouterLink to="/">回到前台</RouterLink> |
    </nav>
    <router-view></router-view>
  </div>
</template>
<script>
import axios from 'axios';

const { VITE_APP_API_URL } = import.meta.env;

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    checkAdmin() {
      // 取得cookie資料
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      axios.defaults.headers.common.Authorization = token;
      axios
        .post(`${VITE_APP_API_URL}/api/user/check`)
        .then(() => {
          // console.log(res);
          //   this.getProducts();
        })
        .catch(() => {
          // console.log(err);
          //   alert(`${err.response.data.message}`);
          this.$router.push('/login');
        });
    },
  },
  mounted() {
    this.checkAdmin();
  },
};
</script>
