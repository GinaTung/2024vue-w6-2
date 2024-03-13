<template>
  <h2>訂單列表</h2>
  <VueLoading :active="isLoading"  class="text-center" />
  <button @click="showAlert">Hello world</button>
</template>
<script>
// import Loading from 'vue-loading-overlay';
// import 'vue-loading-overlay/dist/css/index.css';

export default {
  data() {
    return {
      overNum: 5,
      isLoading: true, // 狀態驅動畫面
    };
  },
  methods: {
    showAlert() {
      // Use sweetalert2
      this.$swal('Hello Vue world!!!');
    },
  },
  mounted() {
    // 跑1秒就停住
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  // components: {
  //   Loading,
  // },
};
</script>
