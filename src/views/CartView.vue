<template>
  <VueLoading :active="isLoading"  class="text-center" />
  <h2 class="text-center">購物車</h2>
  <!-- 購物車列表 -->
  <div class="text-end">
    <button
      class="btn btn-outline-danger"
      type="button"
      @click="deleteAllCarts"
    >
      清空購物車
    </button>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-10">
      <table class="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style="width: 150px">數量/單位</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="carts.carts">
            <tr v-for="cartItem in carts.carts" :key="cartItem.id">
              <td>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(cartItem.product.title, cartItem.id)"
                  :disabled="loadingStatus.loadingItem === cartItem.id"
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    aria-hidden="true"
                    v-if="loadingStatus.loadingItem === cartItem.id"
                  ></span>
                  <!-- <i class="fas fa-spinner fa-pulse"></i> -->
                  x
                </button>
              </td>
              <td>
                {{ cartItem.product.title }}
                <div class="text-success">已套用優惠券</div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group my-3">
                    <button
                      class="btn btn-outline-primary"
                      type="button"
                      v-if="cartItem.qty > 1"
                      @click="
                        cartItem.qty--;
                        changeCartQty(cartItem, cartItem.qty);
                      "
                    >
                      -
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      v-else
                      style="padding-left: 10px; padding-right: 10px"
                      @click="
                        removeCartItem(cartItem.product.title, cartItem.id)
                      "
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                    <input
                      min="1"
                      max="50"
                      type="number"
                      class="form-control text-end"
                      v-model="cartItem.qty"
                      readonly
                    />
                    <button
                      class="btn btn-outline-primary"
                      type="button"
                      @click="
                        cartItem.qty++;
                        changeCartQty(cartItem, cartItem.qty);
                      "
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
              <td>$ {{ cartItem.product.price }}</td>
              <td class="text-end">$ {{ cartItem.total }}</td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-end">總計</td>
            <td class="text-end">$ {{ carts.final_total }}</td>
          </tr>
          <tr>
            <td colspan="4" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">0</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
  <div class="my-5 row justify-content-center">
    <VeeForm
      ref="form"
      class="col-md-6"
      v-slot="{ errors }"
      @submit="createOrder"
    >
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <VeeField
          id="email"
          name="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors['email'] }"
          placeholder="請輸入 Email"
          rules="email|required"
          v-model="form.user.email"
        />
        <ErrorMessage name="email" class="invalid-feedback" />
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <VeeField
          id="name"
          name="姓名"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['姓名'] }"
          placeholder="請輸入姓名"
          rules="required"
          v-model="form.user.name"
        />
        <ErrorMessage name="姓名" class="invalid-feedback" />
      </div>

      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <VeeField
          id="tel"
          name="電話"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['電話'] }"
          placeholder="請輸入電話"
          rules="required"
          v-model="form.user.tel"
        />
        <ErrorMessage name="電話" class="invalid-feedback" />
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <VeeField
          id="address"
          name="地址"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['地址'] }"
          placeholder="請輸入地址"
          rules="required"
          v-model="form.user.address"
        />
        <ErrorMessage name="地址" class="invalid-feedback" />
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea
          name=""
          id="message"
          class="form-control"
          cols="30"
          rows="10"
          v-model="form.message"
        ></textarea>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-danger">送出訂單</button>
      </div>
    </VeeForm>
  </div>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';

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
      tempProduct: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      isLoading: false,
      carts: {},
      price: 0,
      qty: 1,
    };
  },
  watch: {
    tempProduct() {
      this.qty = 1;
    },
  },
  methods: {
    addToCart(id, qty = 1) {
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      axios
        .post(url, { data: cart })
        .then((response) => {
          this.getCart();
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
    getCart() {
      this.isLoading = true;
      axios
        .get(`${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart`)
        .then((res) => {
          console.log(res);
          this.carts = res.data.data;
          this.isLoading = false;
          // console.log(this.carts);
        })
        .catch((err) => {
          // console.log(err);
          alert(`${err.response.data.message}`);
        });
    },
    changeCartQty(item, qty = 1) {
      const order = {
        product_id: item.product_id,
        qty,
      };
      this.status.carteQtyLoading = item.id;
      // console.log(order);
      axios
        .put(`${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart/${item.id}`, {
          data: order,
        })
        .then((res) => {
          console.log(res);
          this.status.carteQtyLoading = '';
          this.getCart();
        })
        .catch((err) => {
          // console.log(err);
          alert(`${err.response.data.message}`);
        });
    },
    removeCartItem(productTitle, id) {
      this.isLoading = true;
      this.loadingStatus.loadingItem = id;
      console.log(this.carts);
      axios
        .delete(`${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart/${id}`)
        .then(() => {
          // console.log(res);
          // alert(`已刪除${productTitle}`);
          Swal.fire({
            title: `已刪除${productTitle}`,
            icon: 'success',
          });
          this.getCart();
        })
        .catch((err) => {
          // console.log(err);
          alert(`${err.response.data.message}`);
        });
      this.loadingStatus.loadingItem = '';
      this.isLoading = false;
    },
    deleteAllCarts() {
      this.isLoading = true;
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/carts`;
      axios
        .delete(url)
        .then(() => {
          // alert(response.data.message);
          alert('已全部刪除');
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
      this.isLoading = false;
    },
    createOrder() {
      this.isLoading = true;
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
};
</script>
