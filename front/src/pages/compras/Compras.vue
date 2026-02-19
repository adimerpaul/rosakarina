<template>
  <q-page class="q-pa-xs">
    <div class="row">
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-green">
              <q-item-section avatar>
                <q-icon name="inventory_2" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Compras Totales</q-item-label>
                <q-item-label class="text-white text-h4">{{ totalCompras }} Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-negative">
              <q-item-section avatar>
                <q-icon name="cancel" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Compras Anuladas</q-item-label>
                <q-item-label class="text-white text-h4">{{ totalAnuladas }} Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-indigo">
              <q-item-section avatar>
                <q-icon name="inventory_2" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Total Compras</q-item-label>
                <q-item-label class="text-white text-h4">
                  {{ (compras.length) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mt-sm">
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12 col-md-2">
            <q-input v-model="fechaInicio" label="Fecha inicio" dense outlined type="date" />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="fechaFin" label="Fecha fin" dense outlined type="date" />
          </div>
          <div class="col-12 col-md-2">
            <q-select v-model="user" :options="usersTodos" label="Usuario" dense outlined emit-value map-options/>
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="proveedor_id"
              :options="proveedoresTodos"
              label="Proveedor"
              dense outlined
              emit-value map-options
            />
          </div>
          <div class="col-12 col-md-2">
            <q-btn color="primary" label="Buscar" icon="search" @click="comprasGet" :loading="loading" no-caps />
          </div>
<!--           btn crear-->
          <div class="col-12 col-md-2">
            <q-btn color="positive" label="Compra" icon="add_circle_outline" @click="$router.push({ name: 'compras-create' })" no-caps :loading="loading" />
          </div>
          <div class="col-12 col-md-2">
            <q-btn color="primary" label="Excel" icon="file_download" @click="excel" no-caps :loading="loading" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-markup-table dense wrap-cells>
      <thead>
      <tr class="bg-primary text-white">
        <th>Acciones</th>
        <th>ID</th>
        <th>Fecha</th>
        <th>Proveedor</th>
        <th>Usuario</th>
        <th>Estado</th>
        <th>Total</th>
        <th>Detalle</th>
        <th>Pago</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="compra in compras" :key="compra.id">
        <td>
          <q-btn-dropdown color="primary" label="Opciones" no-caps dense size="10px">
            <q-item clickable @click="imprimir(compra)" v-close-popup>
              <q-item-section avatar><q-icon name="print" /></q-item-section>
              <q-item-section>Imprimir</q-item-section>
            </q-item>
            <q-item clickable @click="anular(compra.id)" v-close-popup>
              <q-item-section avatar><q-icon name="delete" /></q-item-section>
              <q-item-section>Anular</q-item-section>
            </q-item>
          </q-btn-dropdown>
<!--          <pre>{{$store.env}}</pre>-->
        </td>
        <td>{{ compra.id }}</td>
        <td>{{ compra.fecha }} {{ compra.hora }}</td>
        <td>{{ compra.proveedor?.nombre }}</td>
        <td>{{ compra.user?.name }}</td>
        <td><q-chip :color="compra.estado === 'Activo' ? 'positive' : 'negative'" class="text-white" dense>{{ compra.estado }}</q-chip></td>
        <td class="text-bold">{{ compra.total }} Bs</td>
        <td>
          <div class="detalle-wrap">
            <ul v-if="detallesCompra(compra).length" class="detalle-list">
              <li v-for="d in detallesCompra(compra)" :key="d.id || `${compra.id}-${d.producto_id}-${d.lote || 'sin-lote'}`" class="detalle-item">
                <span class="detalle-nombre">{{ d.cantidad }} x {{ d.nombre || d.producto?.nombre || 'Producto' }}</span>
                <span class="detalle-precio">{{ formatBs(d.precio) }} Bs</span>
              </li>
            </ul>
            <span v-else class="text-grey-6">Sin detalle</span>
          </div>
        </td>
        <td><q-chip :color="compra.tipo_pago === 'Efectivo' ? 'green' : 'blue'" class="text-white" dense>{{ compra.tipo_pago }}</q-chip></td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
  <div id="myElement" class="hidden"></div>
</template>

<script>
import moment from 'moment'
import {Imprimir} from "src/addons/Imprimir";
import {Excel} from "src/addons/Excel";
export default {
  data() {
    return {
      compras: [],
      fechaInicio: moment().format('YYYY-MM-DD'),
      fechaFin: moment().format('YYYY-MM-DD'),
      user: '',
      users: [],
      proveedor_id: '',
      proveedores: [],
      loading: false
    }
  },
  mounted() {
    this.comprasGet()
    this.usersGet()
    this.proveedoresGet()

  },
  computed: {
    proveedoresTodos() {
      return [{ label: 'Todos', value: '' }, ...this.proveedores.map(p => ({ label: p.nombre, value: p.id }))]
    },
    usersTodos() {
      return [{ label: 'Todos', value: '' }, ...this.users.map(u => ({ label: u.name, value: u.id }))]
    },
    totalCompras() {
      return this.compras.reduce((sum, c) => c.estado === 'Activo' ? sum + parseFloat(c.total) : sum, 0).toFixed(2)
    },
    totalAnuladas() {
      return this.compras.reduce((sum, c) => c.estado === 'Anulado' ? sum + parseFloat(c.total) : sum, 0).toFixed(2)
    }
  },
  methods: {
    detallesCompra(compra) {
      return compra.compra_detalles || compra.compraDetalles || []
    },
    formatBs(value) {
      const n = Number(value || 0)
      return n.toFixed(2)
    },
    proveedoresGet() {
      this.$axios.get('proveedores').then(res => {
        this.proveedores = res.data
      })
    },
    excel() {
      const data = [{
        columns: [
          { label: "ID", value: "id" },
          { label: "Fecha", value: row => `${row.fecha} ${row.hora}` },
          { label: "Proveedor", value: row => row.proveedor?.nombre || row.nombre || '' },
          { label: "Usuario", value: row => row.user?.name || '' },
          { label: "Estado", value: "estado" },
          { label: "Total (Bs)", value: "total" },
          { label: "Detalle", value: "detailsText" },
          { label: "Tipo de pago", value: "tipo_pago" },
          { label: "Factura", value: "nro_factura" }
        ],
        content: this.compras
      }]
      Excel.export(data, `Compras_${this.fechaInicio}_a_${this.fechaFin}`)
    },
    comprasGet() {
      this.loading = true
      this.$axios.get('compras', {
        params: {
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          user: this.user,
          proveedor_id: this.proveedor_id
        }
      }).then(res => {
        this.compras = res.data
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'Error al obtener compras')
      }).finally(() => {
        this.loading = false
      })
    },
    usersGet() {
      this.$axios.get('users').then(res => {
        console.log(res.data)
        this.users = res.data
      })
    },
    imprimir(compra) {
      Imprimir.reciboCompra(compra)
    },
    anular(id) {
      this.$alert.dialog('¿Anular esta compra?').onOk(() => {
        this.loading = true
        this.$axios.put(`comprasAnular/${id}`).then(() => {
          this.$alert.success('Compra anulada')
          this.comprasGet()
        })
      })
    }
  }
}
</script>

<style scoped>
.detalle-wrap {
  min-width: 220px;
  max-width: 300px;
}
.detalle-list {
  margin: 0;
  padding-left: 14px;
  line-height: 1.15;
}
.detalle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 2px 0;
}
.detalle-nombre {
  font-size: 12px;
}
.detalle-precio {
  font-size: 12px;
  font-weight: 700;
  color: #1b5e20;
  white-space: nowrap;
}
</style>
