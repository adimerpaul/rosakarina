<template>
  <q-page class="q-pa-xs">
<q-card flat bordered>
  <q-card-section class="q-pa-xs">
    <div class="text-right">
      <q-btn-dropdown color="primary" label="Descargar" no-caps icon="fa-solid fa-file-excel" :loading="loading">
        <q-list>
          <q-item clickable v-close-popup @click="exportExcel(false)">
            <q-item-section avatar><q-icon name="fa-solid fa-file-excel" color="green" /></q-item-section>
            <q-item-section><q-item-label>Exportar todo (Excel)</q-item-label></q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="exportExcel(true)">
            <q-item-section avatar><q-icon name="fa-solid fa-file-excel" color="teal" /></q-item-section>
            <q-item-section><q-item-label>Exportar solo existentes (Excel)</q-item-label></q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="imprimirPdf">
            <q-item-section avatar><q-icon name="fa-solid fa-file-pdf" color="red" /></q-item-section>
            <q-item-section><q-item-label>Imprimir PDF</q-item-label></q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn color="green" label="Nuevo" @click="productoNew" no-caps  icon="add_circle_outline" :loading="loading" />
      <q-input v-model="filter" label="Buscar" dense outlined debounce="300" @update:modelValue="productosGet">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="flex flex-center">
      <q-pagination
        v-model="pagination.page"
        :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
        :rows-per-page-options="[10, 25, 50, 100]"
        :rows-per-page="pagination.rowsPerPage"
        :rows-number="pagination.rowsNumber"
        color="primary"
        @update:modelValue="productosGet"
        boundary-numbers
        max-pages="5"
        />
    </div>
    <q-markup-table dense wrap-cells>
      <thead>
        <tr>
          <th>Opciones</th>
          <th>Imagen</th>
          <th v-for="column in columns" :key="column.name" :class="column.align">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id">
          <td>
            <q-btn-dropdown label="Opciones" no-caps size="10px" dense color="primary">
              <q-list>
                <q-item clickable @click="productoEdit(producto)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="productoDelete(producto.id)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="delete" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Eliminar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="verHistorial(producto)" v-close-popup>
                  <q-item-section avatar><q-icon name="history" /></q-item-section>
                  <q-item-section><q-item-label>Historial de compras y ventas</q-item-label></q-item-section>
                </q-item>
<!--                opcion de cambiar foto-->
                <q-item clickable v-close-popup @click="productoEditFoto(producto)">
                  <q-item-section avatar><q-icon name="photo" /></q-item-section>
                  <q-item-section><q-item-label>Ver foto</q-item-label></q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </td>
          <td>
<!--            {{`${$url}../images/${producto.imagen}`}}<br>-->
            <q-img
              :src="`${$url}../images/${producto.imagen}`"
              style="width: 50px; height: 50px"
              class="q-mr-sm" ></q-img>
          </td>
          <td>
            <div style="max-width: 150px; wrap-option: wrap;line-height: 0.9;">
              {{ producto.nombre }}
            </div>
          </td>
          <td>
            <div style="max-width: 200px; wrap-option: wrap;line-height: 0.9;">
            {{ producto.descripcion }}
            </div>
          </td>
          <td>
            <div style="max-width: 80px; wrap-option: wrap;line-height: 0.9;">
              {{ producto.unidad }}
            </div>
          </td>
          <td>
<!--            {{ producto.precio }}-->
            <input
              v-model.number="producto.precio"
              type="number"
              step="0.01"
              min="0"
              style="width: 60px; text-align: right"
              @keyup="debouncedCambioPrecio(producto)"
            />
          </td>
          <td>
            {{ producto.cantidad }}
          </td>
          <td>{{ producto.stock_minimo }}</td>
          <td>{{ producto.stock_maximo }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card-section>
</q-card>
    <q-dialog v-model="productoDialog" persistent>
      <q-card style="width: 400px;margin: 0 auto">
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} producto
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="productoDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="producto.id ? productoPut() : productoPost()">

            <!-- CAMPOS EXISTENTES -->
            <q-input v-model="producto.nombre" label="Nombre" dense outlined />
            <q-input v-model="producto.descripcion" label="Descripción" dense outlined />
            <q-input v-model="producto.unidad" label="Presentacion" dense outlined />
            <q-input v-model="producto.precio" label="Precio" dense outlined type="number" />
            <q-input v-model="producto.stock" label="Stock" dense outlined />

            <!-- FOTO -->
            <div class="q-mt-sm">
              <q-btn
                label="Seleccionar foto"
                icon="photo"
                color="primary"
                no-caps
                dense
                @click="$refs.fotoInput.click()"
              />
              <input
                type="file"
                ref="fotoInput"
                accept="image/*"
                style="display:none"
                @change="onFotoChange"
              />
            </div>

            <!-- PREVIEW -->
            <div v-if="fotoPreview" class="q-mt-sm">
              <q-img
                :src="fotoPreview"
                style="width: 120px; height: 120px"
                spinner-color="primary"
              />
            </div>

            <div class="text-right q-mt-md">
              <q-btn label="Cancelar" color="negative" flat @click="productoDialog = false" />
              <q-btn label="Guardar" color="primary" type="submit" no-caps />
            </div>

          </q-form>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="historialDialog" persistent>
      <q-card style="width: 1100px; max-width: 95vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Historial de Compras y Ventas: {{ productoHistorialNombre }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="historialDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-tabs v-model="historialTab" dense align="left" class="text-primary">
            <q-tab name="compras" label="Compras" no-caps icon="fa-solid fa-cart-shopping" />
            <q-tab name="ventas" label="Ventas" no-caps icon="fa-solid fa-cash-register" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="historialTab" animated>
            <q-tab-panel name="compras" class="q-pa-none">
              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Lote</th>
                  <th>Vencimiento</th>
                  <th>Cantidad</th>
                  <th>Vendida</th>
                  <th>Disponible</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in historialCompras" :key="item.id">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.compra?.fecha }}</td>
                  <td>{{ item.proveedor?.nombre }}</td>
                  <td>{{ item.lote }}</td>
                  <td>{{ item.fecha_vencimiento }}</td>
                  <td class="text-center">
                    <q-chip color="blue" text-color="white" dense square>{{ item.cantidad }}</q-chip>
                  </td>
                  <td class="text-center">
                    <q-chip color="orange" text-color="white" dense square>{{ vendida(item) }}</q-chip>
                  </td>
                  <td class="text-center">
                    <q-chip :color="Number(item.cantidad_venta) > 0 ? 'green' : 'grey'" text-color="white" dense square>{{ item.cantidad_venta }}</q-chip>
                  </td>
                  <td>{{ item.precio }}</td>
                  <td>{{ item.total }}</td>
                  <td class="text-center">
                    <q-chip :color="item.estado === 'Activo' ? 'positive' : 'negative'" text-color="white" dense :icon="item.estado === 'Activo' ? 'check_circle' : 'cancel'">
                      {{ item.estado }}
                    </q-chip>
                  </td>
                </tr>
                <tr v-if="!historialCompras.length">
                  <td colspan="11" class="text-center text-grey">Sin compras registradas</td>
                </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>
            <q-tab-panel name="ventas" class="q-pa-none">
              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Lote</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in historialVentas" :key="item.id">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.venta?.fecha }}</td>
                  <td>{{ item.venta?.nombre }}</td>
                  <td>{{ item.lote }}</td>
                  <td>{{ item.cantidad }}</td>
                  <td>{{ item.precio }}</td>
                  <td>{{ (Number(item.cantidad) * Number(item.precio)).toFixed(2) }}</td>
                  <td class="text-center">
                    <q-chip :color="item.venta?.estado === 'Anulado' ? 'negative' : 'positive'" text-color="white" dense :icon="item.venta?.estado === 'Anulado' ? 'cancel' : 'check_circle'">
                      {{ item.venta?.estado }}
                    </q-chip>
                  </td>
                </tr>
                <tr v-if="!historialVentas.length">
                  <td colspan="8" class="text-center text-grey">Sin ventas registradas</td>
                </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogFoto">
      <q-card style="width: 400px">
        <q-card-section class="q-pb-none text-bold row items-center">
          Cambiar foto de producto
          {{ producto.nombre }}
          <q-space />
          <q-btn icon="close" flat round dense @click="dialogFoto = false" />
        </q-card-section>
        <q-card-section class="row items-center q-pb-none">
          <q-btn
            label="Subir foto"
            color="primary"
            @click="$refs.fileInput.click()"
            class="q-mr-sm"
            no-caps dense
            icon="cloud_upload"
            :loading="loading"
          />
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="onFileChange"
            style="display: none">
          <img :src="`${$url}../images/${producto.imagen}`" style="width: 350px; height: 350px" class="q-mr-sm" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import moment from 'moment'
import {Excel} from "src/addons/Excel";
import {debounce} from "quasar";
export default {
  name: 'ProductosPage',
  data() {
    return {
      productos: [],
      producto: {},
      productoFoto: null,     // 👈 archivo
      fotoPreview: null,      // 👈 preview
      productoDialog: false,
      loading: false,
      actionPeriodo: '',
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0,
      },
      columns: [
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
        { name: 'descripcion', label: 'Descripción', align: 'left', field: 'descripcion' },
        { name: 'unidad', label: 'Presentacion', align: 'left', field: 'unidad' },
        { name: 'precio', label: 'Precio', align: 'left', field: 'precio' },
        { name: 'stock', label: 'Stock', align: 'left', field: 'stock' },
        { name: 'stock_minimo', label: 'Stock mínimo', align: 'left', field: 'stock_minimo' },
        { name: 'stock_maximo', label: 'Stock máximo', align: 'left', field: 'stock_maximo' },
      ],
      historialDialog: false,
      historialCompras: [],
      historialVentas: [],
      historialTab: 'compras',
      productoHistorialNombre: '',
      dialogFoto: false,
    }
  },
  mounted() {
    this.productosGet()
    this.debouncedCambioPrecio = debounce(this.cambioPrecio, 500)
    this.debouncedCambioStock = debounce(this.cambioStock, 500)
  },
  methods: {
    onFotoChange(e) {
      const file = e.target.files[0]
      if (!file) return

      this.productoFoto = file
      this.fotoPreview = URL.createObjectURL(file)
    },
    onFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        this.loading = true
        this.$axios.post(`productos/${this.producto.id}/foto`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.productosGet()
          this.$alert.success('Foto actualizada')
          this.dialogFoto = false
        }).catch(error => {
          this.$alert.error(error.response.data.message)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    productoEditFoto(producto) {
      this.dialogFoto = true
      this.producto = { ...producto }
    },
    vendida(item) {
      return Number(item.cantidad || 0) - Number(item.cantidad_venta || 0)
    },
    verHistorial(producto) {
      this.loading = true;
      this.productoHistorialNombre = producto.nombre;
      Promise.all([
        this.$axios.get(`productos/${producto.id}/historial-compras`),
        this.$axios.get(`productos/${producto.id}/historial-ventas`)
      ]).then(([compras, ventas]) => {
        this.historialCompras = compras.data;
        this.historialVentas = ventas.data;
        this.historialTab = 'compras';
        this.historialDialog = true;
      }).catch(err => {
        this.$alert.error("Error al obtener historial");
      }).finally(() => {
        this.loading = false;
      });
    },
    cambioStock(producto) {
      this.loading = true
      this.$axios.put('productos/' + producto.id, { stock: producto.stock }).then(res => {
        this.productosGet()
        this.$alert.success('Stock actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    cambioPrecio(producto) {
      this.loading = true
      this.$axios.put('productos/' + producto.id, { precio: producto.precio }).then(res => {
        this.productosGet()
        this.$alert.success('Precio actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    exportExcel(soloExistentes = false) {
      this.loading = true
      this.$axios.get('productosAll').then(res => {
        let content = res.data
        if (soloExistentes) {
          content = content.filter(p => Number(p.cantidad) > 0)
        }
        let data = [{
          columns: [
            {label: "Nombre", value: "nombre"},
            {label: "Descripción", value: "descripcion"},
            {label: "Unidad", value: "unidad"},
            {label: "Precio", value: "precio"},
            {label: "Stock", value: "stock"},
            {label: "Stock mínimo", value: "stock_minimo"},
            {label: "Stock máximo", value: "stock_maximo"},
          ],
          content: content
        }]
        Excel.export(data, soloExistentes ? 'ProductosExistentes' : 'Productos')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    imprimirPdf() {
      window.open(`${this.$url}/../productos-pdf`, '_blank')
    },
    productoNew() {
      this.producto = {}
      this.productoFoto = null
      this.fotoPreview = null
      this.actionPeriodo = 'Nuevo'
      this.productoDialog = true
    },
    productosGet() {
      this.loading = true
      this.$axios.get('productos', {
        params: {
          search: this.filter,
          page: this.pagination.page,
          per_page: this.pagination.rowsPerPage
        }
      }).then(res => {
        this.productos = res.data.data
        this.pagination.rowsNumber = res.data.total
      }).catch(error => {
        this.$alert.error(error.response?.data?.message || 'Error al cargar productos')
      }).finally(() => {
        this.loading = false
      })
    },
    gestionGet() {
      this.loading = true
      this.$axios.get('gestiones').then(res => {
        this.gestiones = res.data
        this.loading = false
      }).catch(error => {
        this.$alert.error(error.response.data.message)
        this.loading = false
      })
    },
    productoPost() {
      this.loading = true

      const formData = new FormData()
      Object.keys(this.producto).forEach(key => {
        formData.append(key, this.producto[key])
      })

      if (this.productoFoto) {
        formData.append('foto', this.productoFoto)
      }

      this.$axios.post('productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        this.productosGet()
        this.productoDialog = false
        this.$alert.success('Producto creado')
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'Error')
      }).finally(() => {
        this.loading = false
      })
    },

    productoPut() {
      this.loading = true
      this.$axios.put('productos/' + this.producto.id, this.producto).then(res => {
        this.productosGet()
        this.productoDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    productoEdit(producto) {
      this.producto = { ...producto }
      this.actionPeriodo = 'Editar'
      this.productoDialog = true
    },
    productoDelete(id) {
      this.$alert.dialog('¿Desea eliminar el producto?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('productos/' + id).then(res => {
            this.productosGet()
            this.$alert.success('Periodo eliminado')
          }).catch(error => {
            this.$alert.error(error.response.data.message)
          }).finally(() => {
            this.loading = false
          })
        })
    }
  }
}
</script>
