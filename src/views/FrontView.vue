<template>
  <div class="container my-5 col-9">
    <h2 class=" text-center">這是前台</h2>
    <nav class="mb-3 text-center">
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink> |
      <RouterLink to="/products">產品列表</RouterLink> |
      <RouterLink to="/Cart">購物車</RouterLink> |
      <RouterLink to="/login">管理者登入</RouterLink> |
      <RouterLink to="/admin/products">後台產品列表</RouterLink> |
    </nav>
    <router-view></router-view>
  </div>
</template>
