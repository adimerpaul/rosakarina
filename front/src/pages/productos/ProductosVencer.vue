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

        <q-markup-table dense class="q-mt-md" flat bordered>
          <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Factura</th>
            <th>Lote</th>
            <th>Proveedor</th>
            <th>Fecha de Vencimiento</th>
            <th>Estado</th>
            <th>Días restantes</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(p,i) in productos" :key="p.id">
            <td>{{ i + 1 }}</td>
            <td>{{ p.producto?.nombre }}</td>
            <td>{{ p.cantidad_venta }}</td>
            <td>
              {{p.compra.nro_factura}}
            </td>
            <td>{{ p.lote }}</td>
            <td>{{ p.proveedor?.nombre }}</td>
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
      loading: false
    };
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
