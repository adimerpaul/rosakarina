<template>
  <q-page class="q-pa-xs">

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-item class="bg-indigo text-white">
            <q-item-section avatar><q-icon name="shopping_cart" size="40px"/></q-item-section>
            <q-item-section>
              <q-item-label caption class="text-white">Subtotal Pedidos</q-item-label>
              <q-item-label class="text-h5 text-weight-bold">{{ totalSubtotal }} Bs</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-item class="bg-negative text-white">
            <q-item-section avatar><q-icon name="cancel" size="40px"/></q-item-section>
            <q-item-section>
              <q-item-label caption class="text-white">Anulados</q-item-label>
              <q-item-label class="text-h5 text-weight-bold">{{ totalAnulados }} Bs</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-item class="bg-green text-white">
            <q-item-section avatar><q-icon name="receipt_long" size="40px"/></q-item-section>
            <q-item-section>
              <q-item-label caption class="text-white">Total Pedidos</q-item-label>
              <q-item-label class="text-h5 text-weight-bold">{{ pedidos.length }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mt-sm">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm items-end">
          <div class="col-12 col-md-2">
            <q-input v-model="fechaInicio" label="Fecha inicio" dense outlined type="date"/>
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="fechaFin" label="Fecha fin" dense outlined type="date"/>
          </div>

          <div class="col-12 col-md-2">
            <q-select v-model="user" :options="usersTodos" label="Usuario" dense outlined emit-value map-options/>
          </div>

          <div class="col-12 col-md-2">
            <q-select v-model="proveedor_id" :options="proveedoresTodos" label="Proveedor" dense outlined emit-value map-options/>
          </div>

          <div class="col-12 col-md-2">
            <q-btn color="primary" label="Buscar" icon="search" no-caps :loading="loading" @click="pedidosGet"/>
          </div>

          <div class="col-12 col-md-2">
            <q-btn color="positive" label="Pedido" icon="add_circle_outline" no-caps @click="$router.push({ name: 'pedidos-create' })"/>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-markup-table dense wrap-cells class="q-mt-sm">
      <thead>
      <tr class="bg-primary text-white">
        <th>Acciones</th>
        <th>ID</th>
        <th>Fecha</th>
        <th>Proveedor</th>
        <th>Teléfono</th>
        <th>Usuario</th>
        <th>Estado</th>
<!--        <th>Subtotal</th>-->
        <th>Detalle</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="p in pedidos" :key="p.id">
        <td>
          <q-btn-dropdown color="primary" label="Opciones" no-caps dense size="10px">
            <q-item clickable v-close-popup @click="whatsapp(p)">
              <q-item-section avatar><q-icon name="phone" color="green"/></q-item-section>
              <q-item-section>Enviar WhatsApp</q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="anular(p.id)">
              <q-item-section avatar><q-icon name="delete" /></q-item-section>
              <q-item-section>Anular</q-item-section>
            </q-item>
          </q-btn-dropdown>
        </td>

        <td>{{ p.id }}</td>
        <td>{{ p.fecha }} {{ p.hora }}</td>
        <td>{{ p.proveedor?.nombre || p.proveedor_nombre || '-' }}</td>
        <td>{{ p.telefono || '-' }}</td>
        <td>{{ p.user?.name || '-' }}</td>
        <td>
          <q-chip :color="p.estado === 'Activo' ? 'positive' : 'negative'" class="text-white" dense>
            {{ p.estado }}
          </q-chip>
        </td>
<!--        <td class="text-bold">{{ Number(p.subtotal || 0).toFixed(2) }} Bs</td>-->
        <td>
<!--          <div style="max-width: 240px; line-height: 1.1;">{{ p.detailsText }}</div>-->
<!--          <pre>{{p.detalles}}</pre>-->
          <ul class="q-pa-none q-ma-none">
            <li v-for="d in p.detalles" :key="d.id">
              {{ d.cantidad }} x {{ d.nombre }}
<!--              ({{ Number(d.precio).toFixed(2) }} Bs) = {{ Number(d.subtotal).toFixed(2) }} Bs-->
            </li>
          </ul>
<!--          [-->
<!--          {-->
<!--          "id": 6,-->
<!--          "pedido_id": 3,-->
<!--          "producto_id": 4452,-->
<!--          "nombre": "4 DERM 10 GR",-->
<!--          "precio": "30.00",-->
<!--          "cantidad": "1.00",-->
<!--          "subtotal": "30.00",-->
<!--          "estado": "Activo",-->
<!--          "producto": {-->
<!--          "id": 4452,-->
<!--          "nombre": "4 DERM 10 GR",-->
<!--          "imagen": "17063795654 DERM 10 GR.jpg",-->
<!--          "descripcion": "Antimicótico y antiinflamatorio",-->
<!--          "unidad": "CREMA DERMICA",-->
<!--          "precio": "30.00",-->
<!--          "stock": null,-->
<!--          "stock_minimo": null,-->
<!--          "stock_maximo": null,-->
<!--          "cantidad": 0-->
<!--          }-->
<!--          },-->
        </td>
      </tr>

      <tr v-if="!loading && pedidos.length === 0">
        <td colspan="9" class="text-center text-grey q-pa-md">Sin pedidos</td>
      </tr>
      </tbody>
    </q-markup-table>

  </q-page>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Pedidos',
  data () {
    return {
      pedidos: [],
      fechaInicio: moment().format('YYYY-MM-DD'),
      fechaFin: moment().format('YYYY-MM-DD'),
      user: '',
      users: [],
      proveedor_id: '',
      proveedores: [],
      loading: false
    }
  },

  mounted () {
    this.pedidosGet()
    this.usersGet()
    this.proveedoresGet()
  },

  computed: {
    usersTodos () {
      return [{ label: 'Todos', value: '' }, ...this.users.map(u => ({ label: u.name, value: u.id }))]
    },
    proveedoresTodos () {
      return [{ label: 'Todos', value: '' }, ...this.proveedores.map(p => ({ label: p.nombre, value: p.id }))]
    },
    totalSubtotal () {
      return this.pedidos.reduce((sum, p) => p.estado === 'Activo' ? sum + Number(p.subtotal || 0) : sum, 0).toFixed(2)
    },
    totalAnulados () {
      return this.pedidos.reduce((sum, p) => p.estado === 'Anulado' ? sum + Number(p.subtotal || 0) : sum, 0).toFixed(2)
    }
  },

  methods: {
    pedidosGet () {
      this.loading = true
      this.$axios.get('pedidos', {
        params: {
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          user: this.user,
          proveedor_id: this.proveedor_id
        }
      }).then(res => {
        this.pedidos = res.data
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'Error al obtener pedidos')
      }).finally(() => {
        this.loading = false
      })
    },

    usersGet () {
      this.$axios.get('users').then(res => { this.users = res.data })
    },

    proveedoresGet () {
      this.$axios.get('proveedores').then(res => { this.proveedores = res.data })
    },

    anular (id) {
      this.$alert.dialog('¿Anular este pedido?').onOk(() => {
        this.loading = true
        this.$axios.put(`pedidosAnular/${id}`).then(() => {
          this.$alert.success('Pedido anulado')
          this.pedidosGet()
        }).finally(() => { this.loading = false })
      })
    },

    whatsapp (p) {
      const tel = String(p.telefono || '').replace(/\D/g, '')
      if (!tel) {
        this.$alert.error('Este pedido no tiene teléfono')
        return
      }

      const proveedor = p.proveedor?.nombre || p.proveedor_nombre || ''

      // Detalle: cada item en una línea: "cantidad - producto"
      const detalleLineas = (p.detalles || [])
        .filter(d => Number(d.cantidad || 0) > 0)
        .map(d => {
          const nombre = d.nombre || d.producto?.nombre || 'Producto'
          return `${d.cantidad} - ${nombre}`
        })
        .join('\n')

      const msg =
        `Hola ${proveedor}.\n` +
        `Pedido #${p.id} (${p.fecha}).\n` +
        `Detalle:\n${detalleLineas}`

      const url = `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`
      window.open(url, '_blank')
    }

  }
}
</script>
