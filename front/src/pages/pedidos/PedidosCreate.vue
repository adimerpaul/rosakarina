<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="row items-center q-pb-none">
        <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
        <div class="text-h6">Nuevo Pedido</div>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-form @submit="openConfirm">
          <div class="row">

            <!-- Productos -->
            <div class="col-12 col-md-5 q-pa-xs">
              <q-input v-model="search" outlined dense debounce="300" label="Buscar producto" @update:modelValue="productosGet" clearable>
                <template #append><q-icon name="search"/></template>
                <template #after><q-btn flat round dense icon="refresh" @click="productosGet"/></template>
              </q-input>

              <div class="flex flex-center">
                <q-pagination
                  v-model="pagination.page"
                  :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
                  max-pages="5"
                  size="xs"
                  boundary-numbers
                  @update:model-value="productosGet"
                  class="q-mt-sm"
                />
              </div>

              <div class="row q-col-gutter-xs q-mt-xs">
                <div class="col-6 col-md-2" v-for="prod in productos" :key="prod.id">
                  <q-card flat bordered class="cursor-pointer" @click="addProducto(prod)">
                    <q-img :src="`${$url}../images/${prod.imagen}`" style="height:120px;">
                      <div class="absolute-bottom text-center" style="padding:0;margin:0;">
                        <div style="max-width:190px;line-height:0.9;">
                          {{ $filters.textUpper(prod.nombre) }}
                        </div>
                        <div style="display:flex;justify-content:space-between;">
                          <span>{{ prod.cantidad }}</span>
<!--                          <span class="text-bold bg-orange text-black">{{ prod.precio }} Bs</span>-->
                        </div>
                      </div>
                    </q-img>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- Seleccionados -->
            <div class="col-12 col-md-7 q-pa-xs">
              <div class="row items-center justify-between q-mb-xs">
                <div>
                  <q-btn size="xs" flat round dense icon="delete" color="red" @click="items=[]" />
                  <span class="text-subtitle2 q-ml-sm">Productos seleccionados</span>
                </div>
              </div>

              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                <tr>
                  <th>Producto</th>
                  <th style="width:90px;">Cantidad</th>
<!--                  <th style="width:110px;">Precio</th>-->
<!--                  <th style="width:120px;">Subtotal</th>-->
                </tr>
                </thead>

                <tbody>
                <tr v-for="(it, i) in items" :key="i">
                  <td style="display:flex;align-items:center;">
                    <q-img :src="`${$url}../images/${it.producto.imagen}`" style="height:35px;width:35px;" class="q-mr-sm"/>
                    <div style="max-width: 220px; line-height: 0.9;">
                      <q-icon name="delete" color="red" class="cursor-pointer" @click="items.splice(i,1)" />
                      {{ $filters.textUpper(it.producto.nombre) }}
                    </div>
                  </td>

                  <td>
                    <input v-model.number="it.cantidad" type="number" min="0" step="0.01" style="width:80px;" />
                  </td>

<!--                  <td class="text-right text-bold">{{ Number(it.producto.precio||0).toFixed(2) }} Bs</td>-->
<!--                  <td class="text-right">{{ (Number(it.cantidad||0)*Number(it.producto.precio||0)).toFixed(2) }} Bs</td>-->
                </tr>

                <tr v-if="items.length===0">
                  <td colspan="4" class="text-center text-grey q-pa-md">Agrega productos</td>
                </tr>
                </tbody>

                <tfoot>
                <tr>
                  <td colspan="" class="text-right text-bold">Total</td>
                  <td class="text-right text-bold">{{ total }} Bs</td>
                </tr>
                </tfoot>
              </q-markup-table>

              <q-btn label="Registrar pedido" color="primary" class="full-width q-mt-sm" no-caps type="submit" :loading="loading" icon="save"/>
            </div>

          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Confirm -->
    <q-dialog v-model="confirmDialog">
      <q-card style="width: 520px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirmar pedido</div>
          <q-space/>
          <q-btn flat round dense icon="close" @click="confirmDialog=false"/>
        </q-card-section>

        <q-card-section>
          <q-form @submit="submit">
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-select
                  v-model="proveedor"
                  :options="proveedores"
                  option-label="nombre"
                  option-value="id"
                  dense outlined
                  label="Proveedor"
                  :rules="[v => !!v || 'Campo requerido']"
                  @update:model-value="syncProveedor"
                />
              </div>

              <div class="col-12">
                <q-input v-model="telefono" dense outlined label="Teléfono (WhatsApp)" />
              </div>

              <div class="col-12">
                <q-input v-model="observacion" type="textarea" autogrow dense outlined label="Observación (opcional)"/>
              </div>
            </div>

            <q-btn label="Guardar" color="primary" class="full-width q-mt-md" type="submit" no-caps icon="save" :loading="loading"/>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
  name: 'PedidosCreate',
  data () {
    return {
      loading: false,
      confirmDialog: false,

      productos: [],
      search: '',
      pagination: { page: 1, rowsPerPage: 24, rowsNumber: 0 },

      items: [],

      proveedores: [],
      proveedor: null,
      telefono: '',
      observacion: ''
    }
  },

  computed: {
    total () {
      const t = this.items.reduce((sum, it) => sum + (Number(it.cantidad || 0) * Number(it.producto.precio || 0)), 0)
      return Number(t).toFixed(2)
    }
  },

  mounted () {
    this.productosGet()
    this.proveedoresGet()
  },

  methods: {
    productosGet () {
      this.loading = true
      this.$axios.get('productos', {
        params: { search: this.search, page: this.pagination.page, per_page: this.pagination.rowsPerPage }
      }).then(res => {
        // si tu endpoint devuelve paginado:
        this.productos = res.data.data || res.data
        this.pagination.rowsNumber = res.data.total || (this.productos.length || 0)
      }).finally(() => { this.loading = false })
    },

    proveedoresGet () {
      this.$axios.get('proveedores').then(res => { this.proveedores = res.data })
    },

    addProducto (producto) {
      const ex = this.items.find(i => i.producto_id === producto.id)
      if (ex) {
        ex.cantidad = Number(ex.cantidad || 0) + 1
      } else {
        this.items.push({ producto_id: producto.id, cantidad: 1, producto })
      }
    },

    openConfirm () {
      if (this.items.length === 0) {
        this.$alert.error('Debe agregar al menos un producto')
        return
      }
      const bad = this.items.find(i => Number(i.cantidad || 0) <= 0)
      if (bad) {
        this.$alert.error('Todas las cantidades deben ser mayores a 0')
        return
      }
      this.confirmDialog = true
    },

    syncProveedor (val) {
      if (val?.telefono && !this.telefono) this.telefono = val.telefono
    },

    submit () {
      if (!this.proveedor?.id) return

      this.loading = true
      const payload = {
        proveedor_id: this.proveedor.id,
        telefono: this.telefono,
        observacion: this.observacion,
        productos: this.items.map(it => ({
          producto_id: it.producto_id,
          cantidad: it.cantidad
        }))
      }

      this.$axios.post('pedidos', payload).then(() => {
        this.$alert.success('Pedido registrado correctamente')
        this.confirmDialog = false
        this.items = []
        this.proveedor = null
        this.telefono = ''
        this.observacion = ''
        this.productosGet()
        this.$router.push({ name: 'pedidos' })
      }).catch(err => {
        console.error(err)
        this.$alert.error(err.response?.data?.message || 'Error al registrar pedido')
      }).finally(() => { this.loading = false })
    }
  }
}
</script>
