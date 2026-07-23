<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="q-pa-xs">
        <div class="text-h6">Productos por vencer en {{ dias }} días</div>

        <div class="row items-end q-col-gutter-md">
          <div class="col-12 col-md-2">
            <q-input v-model.number="valor" type="number" min="1" label="Cantidad" dense outlined />
          </div>
          <div class="col-12 col-md-4">
            <q-option-group
              v-model="unidad"
              :options="[
                { label: 'Días', value: 'dias' },
                { label: 'Semanas', value: 'semanas' },
                { label: 'Meses', value: 'meses' },
                { label: 'Años', value: 'anios' }
              ]"
              type="radio"
              inline
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="proveedor_id"
              :options="proveedores"
              option-label="nombre"
              option-value="id"
              emit-value
              map-options
              dense
              outlined
              clearable
              label="Proveedor (opcional)"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-btn label="Consultar" color="green" icon="search" class="q-mt-sm" @click="consultar" :loading="loading" no-caps />
          </div>
        </div>

        <div class="row q-mt-xs">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtro"
              dense outlined clearable
              label="Filtrar por producto, lote o factura"
            >
              <template #append><q-icon name="filter_alt"/></template>
            </q-input>
          </div>
          <div class="col-12 col-md-8 flex items-center q-pl-sm text-caption text-grey-8">
            Mostrando {{ productosFiltrados.length }} de {{ productos.length }} registros
          </div>
        </div>

        <q-markup-table dense class="q-mt-sm tabla-vencer" flat bordered>
          <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Factura</th>
            <th>Lote</th>
            <th>Proveedor</th>
            <th>Fecha compra</th>
            <th>Fecha de Vencimiento</th>
            <th>Estado</th>
            <th>Días restantes</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(p,i) in productosFiltrados" :key="p.id">
            <td>{{ i + 1 }}</td>
            <td>{{ p.producto?.nombre }}</td>
            <td class="text-right">{{ p.cantidad_venta }}</td>
            <td>
              {{p.compra?.nro_factura}}
            </td>
            <td>{{ p.lote }}</td>
            <td>{{ p.proveedor?.nombre }}</td>
            <td>{{ p.compra?.fecha }}</td>
            <td>{{ p.fecha_vencimiento }}</td>
            <td>
              <q-badge :color="p.estado === 'Activo' ? 'green' : 'red'" class="q-pa-xs">
                {{ p.estado }}
              </q-badge>
            </td>
            <td>
              <q-badge :color="diasRestantesColor(p.fecha_vencimiento).color" class="q-pa-xs">
                {{ diasRestantesColor(p.fecha_vencimiento).dias }} días
              </q-badge>
            </td>
          </tr>
          <tr v-if="productosFiltrados.length === 0">
            <td colspan="10" class="text-center text-grey q-pa-md">Sin resultados</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import moment from 'moment';
export default {
  name: "ProductosPorVencer",
  data() {
    return {
      valor: 1,
      unidad: 'meses',
      dias: 1,
      productos: [],
      proveedores: [],
      proveedor_id: null, // 👈 NUEVO
      filtro: '',
      loading: false
    };
  },
  computed: {
    productosFiltrados() {
      const f = (this.filtro || '').toLowerCase().trim();
      if (!f) return this.productos;
      return this.productos.filter(p => {
        const nombre = (p.producto?.nombre || '').toLowerCase();
        const lote = (p.lote || '').toLowerCase();
        const factura = String(p.compra?.nro_factura || '').toLowerCase();
        return nombre.includes(f) || lote.includes(f) || factura.includes(f);
      });
    }
  },
  mounted() {
    this.cargarProveedores();
    this.consultar();
  },
  methods: {
    cargarProveedores() {
      this.$axios.get('/proveedores').then(res => {
        this.proveedores = res.data;
      });
    },
    consultar() {
      this.dias = this.convertirADias(this.valor, this.unidad);

      this.loading = true;
      this.$axios.get('/productosPorVencer', {
        params: {
          dias: this.dias,
          proveedor_id: this.proveedor_id // 👈 NUEVO
        }
      })
        .then(res => {
          this.productos = res.data;
        })
        .catch(() => {
          this.$alert.error("Error al consultar productos por vencer");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    convertirADias(valor, unidad) {
      switch (unidad) {
        case 'semanas':
          return valor * 7;
        case 'meses':
          return valor * 30;
        case 'anios':
          return valor * 365;
        default:
          return valor;
      }
    },
    diasRestantesColor(fechaVencimiento) {
      const hoy = moment();
      const vencimiento = moment(fechaVencimiento);
      const diasRestantes = vencimiento.diff(hoy, 'days');

      const tercio = Math.ceil(this.dias / 3);

      if (diasRestantes <= tercio) {
        return { color: 'red', dias: diasRestantes };
      } else if (diasRestantes <= tercio * 2) {
        return { color: 'orange', dias: diasRestantes };
      } else {
        return { color: 'green', dias: diasRestantes };
      }
    }
  }
}

</script>
<style scoped>
.tabla-vencer :deep(th),
.tabla-vencer :deep(td) {
  padding: 2px 6px;
  font-size: 12px;
  height: 26px;
  line-height: 1.1;
}
.tabla-vencer :deep(th) {
  font-weight: bold;
}
</style>
