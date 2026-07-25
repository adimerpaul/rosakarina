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
              use-input
              input-debounce="0"
              dense
              outlined
              clearable
              label="Proveedor (opcional)"
              @filter="filtrarProveedores"
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
              label="Buscar en todos los registros"
            >
              <template #append><q-icon name="filter_alt"/></template>
            </q-input>
          </div>
          <div class="col-12 col-md-4 flex items-center q-pl-sm text-caption text-grey-8">
            Mostrando {{ productosFiltrados.length }} de {{ productos.length }} registros
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn color="green-7" icon="fa-solid fa-file-excel" label="Excel" dense no-caps class="q-mr-xs" @click="exportarExcel" />
            <q-btn color="red-7" icon="fa-solid fa-file-pdf" label="PDF" dense no-caps @click="exportarPdf" />
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
          <tr v-for="(p,i) in productosPaginados" :key="p.id">
            <td>{{ ((pagina - 1) * porPagina) + i + 1 }}</td>
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

        <div class="flex flex-center q-mt-sm">
          <q-pagination
            v-model="pagina"
            :max="totalPaginas"
            max-pages="7"
            boundary-numbers
            direction-links
            size="sm"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import moment from 'moment';
import { Excel } from 'src/addons/Excel';
export default {
  name: "ProductosPorVencer",
  data() {
    return {
      valor: 1,
      unidad: 'meses',
      dias: 1,
      productos: [],
      proveedores: [],
      proveedoresTodos: [],
      proveedor_id: null, // 👈 NUEVO
      filtro: '',
      temporizadorBusqueda: null,
      pagina: 1,
      porPagina: 15,
      loading: false
    };
  },
  computed: {
    productosFiltrados() {
      const normalizar = valor => String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
      const f = normalizar(this.filtro);
      if (!f) return this.productos;
      return this.productos.filter(p => {
        const diasRestantes = this.diasRestantesColor(p.fecha_vencimiento).dias;
        const campos = [
          p.producto?.nombre,
          p.cantidad_venta,
          p.compra?.nro_factura,
          p.lote,
          p.proveedor?.nombre,
          p.compra?.fecha,
          p.fecha_vencimiento,
          p.estado,
          diasRestantes,
          `${diasRestantes} dias`
        ];
        return campos.some(campo => normalizar(campo).includes(f));
      });
    },
    productosPaginados() {
      const inicio = (this.pagina - 1) * this.porPagina;
      return this.productosFiltrados.slice(inicio, inicio + this.porPagina);
    },
    totalPaginas() {
      return Math.max(1, Math.ceil(this.productosFiltrados.length / this.porPagina));
    }
  },
  mounted() {
    this.cargarProveedores();
    this.consultar();
  },
  beforeUnmount() {
    clearTimeout(this.temporizadorBusqueda);
  },
  watch: {
    filtro() {
      this.pagina = 1;
      clearTimeout(this.temporizadorBusqueda);
      this.temporizadorBusqueda = setTimeout(() => {
        this.consultar();
      }, 350);
    }
  },
  methods: {
    cargarProveedores() {
      this.$axios.get('/proveedores').then(res => {
        this.proveedoresTodos = res.data;
        this.proveedores = res.data;
      });
    },
    filtrarProveedores(valor, actualizar) {
      actualizar(() => {
        const busqueda = String(valor || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim();

        this.proveedores = !busqueda
          ? this.proveedoresTodos
          : this.proveedoresTodos.filter(proveedor => {
              const texto = [
                proveedor.nombre,
                proveedor.ci,
                proveedor.telefono,
                proveedor.direccion
              ].join(' ')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
              return texto.includes(busqueda);
            });
      });
    },
    consultar() {
      this.pagina = 1;
      this.dias = this.convertirADias(this.valor, this.unidad);

      this.loading = true;
      this.$axios.get('/productosPorVencer', {
        params: {
          dias: this.dias,
          proveedor_id: this.proveedor_id,
          buscar: (this.filtro || '').trim()
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
    exportarExcel() {
      if (!this.productosFiltrados.length) {
        this.$q.notify({ type: 'warning', message: 'No hay registros para exportar' });
        return;
      }

      const contenido = this.productosFiltrados.map(p => ({
        producto: p.producto?.nombre || '',
        cantidad: p.cantidad_venta,
        factura: p.compra?.nro_factura || '',
        lote: p.lote || '',
        proveedor: p.proveedor?.nombre || '',
        fecha_compra: p.compra?.fecha || '',
        vencimiento: p.fecha_vencimiento || '',
        estado: p.estado || '',
        dias_restantes: this.diasRestantesColor(p.fecha_vencimiento).dias
      }));

      Excel.export([{
        columns: [
          { label: 'Producto', value: 'producto' },
          { label: 'Cantidad', value: 'cantidad' },
          { label: 'Factura', value: 'factura' },
          { label: 'Lote', value: 'lote' },
          { label: 'Proveedor', value: 'proveedor' },
          { label: 'Fecha compra', value: 'fecha_compra' },
          { label: 'Vencimiento', value: 'vencimiento' },
          { label: 'Estado', value: 'estado' },
          { label: 'Días restantes', value: 'dias_restantes' }
        ],
        content: contenido
      }], 'Productos_por_vencer');
    },
    exportarPdf() {
      const params = new URLSearchParams({
        dias: String(this.dias),
        buscar: (this.filtro || '').trim()
      });
      if (this.proveedor_id) params.set('proveedor_id', String(this.proveedor_id));
      window.open(`${this.$url}productos-por-vencer-pdf?${params.toString()}`, '_blank');
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
      const hoy = moment().startOf('day');
      const vencimiento = moment(fechaVencimiento).startOf('day');
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
