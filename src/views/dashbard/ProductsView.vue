<template>

    <div class="text-end mt-4">
      <button
        class="btn btn-primary"
        id="addModalBtn"
        @click="openModal('new', product)"
      >
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120" class="text-end">原價</th>
          <th width="120" class="text-end">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="productItem in products" :key="productItem.id">
          <td>{{ productItem.category }}</td>
          <td>{{ productItem.title }}</td>
          <td class="text-end">{{ productItem.origin_price }}</td>
          <td class="text-end">{{ productItem.price }}</td>
          <td>
            <span class="text-success" v-if="productItem.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', productItem)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', productItem)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  <Pagination :pages="pages" :get-products="getProducts"></Pagination>

  <!-- Modal -->
  <!-- 'tempProduct','updateProduct' -->
  <Product-Modal
    :temp-product="tempProduct"
    :update-product="updateProduct"
    :upload="upload"
    :is-new="isNew"
    ref="pModal"
  ></Product-Modal>

  <!-- ModalDEL  -->
  <Del-product-modal
    :temp-product="tempProduct"
    :delete-product="deleteProduct"
    ref="delpModal"
  ></Del-product-modal>
</template>
<script>
import axios from 'axios';
// import { Modal } from 'bootstrap';
import Pagination from '../../components/PaginationComponent.vue';
import ProductModal from '../../components/ProductModal.vue';
import DelProductModal from '../../components/DelProductModal.vue';

const { VITE_APP_API_URL, VITE_APP_API_NAME } = import.meta.env;

export default {
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      pages: {},
      modalProduct: null, // productModal
      modalDel: null, // delProductModal
      isNew: false,
    };
  },
  methods: {
    getProducts(page = 1) { // 參數預設值
      // 有分頁
      axios
        .get(`${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/products?page=${page}`)
        .then((res) => {
          console.log(res);
          this.products = res.data.products;
          this.pages = res.data.pagination;
        })
        .catch((err) => {
          alert(`${err.response.data.message}`);
        });
    },
    openModal(status, product) {
      // myModal.show();=>element id方法
      // console.log(status,product);
      if (status === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.$refs.pModal.openModal();
      } else if (status === 'edit') {
        this.tempProduct = { ...product };
        if (!Array.isArray(this.tempProduct.imagesUrl)) {
          this.tempProduct.imagesUrl = [];
        }
        this.isNew = false;
        this.$refs.pModal.openModal();
      } else if (status === 'delete') {
        this.tempProduct = { ...product };
        this.$refs.delpModal.openModal();
      }
    },
    updateProduct() {
      // 新增
      if (this.isNew) {
        axios
          .post(`${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/product`, {
            data: this.tempProduct,
          })
          .then((res) => {
            console.log(res);
            alert('已建立產品');
            this.getProducts();
            this.tempProduct = {};
            this.$refs.pModal.closeModal();
          })
          .catch((err) => {
            // console.log(err);
            alert(`${err.data.message}`);
          });
      } else if (!this.isNew) {
        // 更新
        axios
          .put(
            `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/product/${this.tempProduct.id}`,
            { data: this.tempProduct },
          )
          .then(() => {
            // console.log(res);
            alert('已更新產品');
            this.getProducts();
            this.tempProduct = {};
            this.$refs.pModal.closeModal();
          })
          .catch((err) => {
            // console.log(err);
            alert(`${err.data.message}`);
          });
      }
    },
    deleteProduct() {
      axios
        .delete(
          `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/product/${this.tempProduct.id}`,
          { data: this.tempProduct },
        )
        .then(() => {
          // console.log(res);
          this.getProducts();
          this.tempProduct = {};
          this.$refs.delpModal.closeModal();
        })
        .catch((err) => {
          // console.log(err);
          alert(`${err.data.message}`);
        });
    },
    upload() {
      // const fileInput = document.querySelector("#file");

      // 上傳檔案
      const { fileInput } = this.$refs.pModal.$refs;
      // console.dir(fileInput)
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append('file-to-upload', file);
      // console.log(file);
      axios
        .post(`${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/upload`, formData)
        .then((res) => {
          const confirmationMessage = `
            網址產生中，請稍後...
            關閉提示視窗後，等待顯示圖片網址，再點確認按鈕
          `;
          alert(`${confirmationMessage}`);

          // 使用 setTimeout 等待一段時間（這裡是3秒，根據需求調整）
          setTimeout(() => {
            // 執行後續的代碼
            this.tempProduct.imagesUrl.push(res.data.imageUrl);
            // console.log(res.data.imageUrl);
            // 彈出警告
            // 其他後續操作
          }, 3000); // 3000 毫秒即為 3 秒
          // alert(`${res.data.imageUrl}`);
        })
        .catch((err) => {
        //   console.log(err);
          // console.dir(err);
          alert(`${err.data.message}`);
        });
    },
  },
  components: {
    Pagination,
    ProductModal,
    DelProductModal,
  },
  mounted() {
    this.getProducts();
    // this.modalProduct = new Modal(this.$refs.productModal);
    // this.modalDel = new Modal(this.$refs.delProductModal);
  },
};
</script>
