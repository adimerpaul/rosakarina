<template>
  <q-page class="q-pa-xs bg-grey-1 dashboard-compacto">
    <!-- Header + Filtros -->
    <q-card class="q-pa-xs q-mb-xs shadow-1" bordered>
      <div class="row items-center q-col-gutter-xs">
        <div class="col-12 col-md">
          <div class="text-h6 text-weight-bold">Dashboard</div>
          <div class="text-caption text-grey-7">Resumen de ventas y gastos</div>
        </div>

        <div class="col-12 col-md-7">
          <div class="row items-end q-col-gutter-sm">
            <div class="col-12 col-sm-3">
              <q-input v-model="f.desde" type="date" label="Desde" dense outlined @update:model-value="cargarDashboard" />
            </div>
            <div class="col-12 col-sm-3">
              <q-input v-model="f.hasta" type="date" label="Hasta" dense outlined @update:model-value="cargarDashboard" />
            </div>

            <div class="col-12 col-sm-6">
              <div class="row q-col-gutter-sm">
                <div class="col">
                  <q-btn outline color="primary" label="HOY" class="full-width" @click="preset('hoy')" />
                </div>
                <div class="col">
                  <q-btn outline color="primary" label="ESTA SEMANA" class="full-width" @click="preset('semana')" />
                </div>
                <div class="col">
                  <q-btn outline color="primary" label="ESTE MES" class="full-width" @click="preset('mes')" />
                </div>
                <div class="col">
                  <q-btn color="primary" label="APLICAR" class="full-width" :loading="loading" @click="cargarDashboard" />
                </div>
              </div>
            </div>
          </div>

          <div class="text-caption text-grey-7 q-mt-sm">
            Rango: <span class="text-weight-medium">{{ rangoLegible }}</span>
          </div>
        </div>
      </div>
    </q-card>

    <!-- KPIs -->
    <div class="row q-col-gutter-xs q-mb-xs">
      <div class="col-12 col-md-4">
        <q-card class="kpi kpi-green text-white shadow-2">
          <q-card-section class="row items-center q-pa-xs">
            <q-icon name="attach_money" size="20px" class="q-mr-xs" />
            <div>
              <div class="text-subtitle2">Ventas</div>
              <div class="text-subtitle1 text-weight-bold">{{ fmt(k.ventas) }} Bs</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="kpi kpi-red text-white shadow-2">
          <q-card-section class="row items-center q-pa-xs">
            <q-icon name="money_off" size="20px" class="q-mr-xs" />
            <div>
              <div class="text-subtitle2">Gastos</div>
              <div class="text-subtitle1 text-weight-bold">{{ fmt(k.gastos) }} Bs</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="kpi kpi-teal text-white shadow-2">
          <q-card-section class="row items-center q-pa-xs">
            <q-icon name="trending_up" size="20px" class="q-mr-xs" />
            <div>
              <div class="text-subtitle2">TOTAL</div>
              <div class="text-subtitle1 text-weight-bold">{{ fmt(k.ganancia) }} Bs</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts -->
    <div class="row q-col-gutter-xs">
      <!-- Movimientos diarios -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2">
          <q-card-section class="row items-center justify-between q-pa-xs">
            <div>
              <div class="text-subtitle2 text-grey-8">Movimientos diarios</div>
              <div class="text-caption text-grey-7">Ventas y gastos por día</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-sm" style="position: relative;">
            <apexchart
              type="bar"
              height="185"
              :options="chartOptions"
              :series="chartSeries"
            />
            <q-inner-loading :showing="loading">
              <q-spinner size="32px" />
            </q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <!-- Ventas vs Gastos (mensual) -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2">
          <q-card-section class="row items-center justify-between q-pa-xs">
            <div>
              <div class="text-subtitle2 text-grey-8">Ventas vs Gastos</div>
              <div class="text-caption text-grey-7">Serie mensual del año actual</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-sm" style="position: relative;">
            <apexchart
              type="line"
              height="185"
              :options="chartLineOptions"
              :series="chartLineSeries"
            />
            <q-inner-loading :showing="loading">
              <q-spinner size="32px" />
            </q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <!-- Ventas por usuario -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2">
          <q-card-section class="row items-center justify-between q-pa-xs">
            <div>
              <div class="text-subtitle2 text-grey-8">Ventas por usuario</div>
              <div class="text-caption text-grey-7">Top usuarios por total vendido (solo ventas)</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-sm" style="position: relative;">
            <apexchart
              type="bar"
              height="185"
              :options="chartUserOptions"
              :series="chartUserSeries"
            />
            <q-inner-loading :showing="loading">
              <q-spinner size="32px" />
            </q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="shadow-2 full-height">
          <q-card-section class="q-pa-xs">
            <div class="text-subtitle2 text-grey-8">Productos más vendidos</div>
            <div class="text-caption text-grey-7">Top 10 por unidades vendidas en el rango</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-xs ranking-productos" style="position: relative;">
            <div v-if="!loading && masVendidos.length === 0" class="text-center text-grey-6 q-pa-xl">
              <q-icon name="inventory_2" size="48px" />
              <div class="q-mt-sm">Sin ventas en el rango</div>
            </div>
            <div v-for="(item, index) in masVendidos" :key="`mas-${item.producto_id}`" class="producto-ranking">
              <div class="posicion posicion-mas">{{ index + 1 }}</div>
              <q-img :src="productoImagen(item)" ratio="1" class="producto-foto">
                <template #error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-6">
                    <q-icon name="medication" size="34px" />
                  </div>
                </template>
              </q-img>
              <div class="producto-info">
                <div class="text-weight-bold ellipsis-2-lines">{{ item.producto }}</div>
                <div class="text-caption text-grey-7">{{ fmt(item.total) }} Bs vendidos</div>
              </div>
              <q-chip color="positive" text-color="white" icon="shopping_cart" dense>
                {{ fmtCantidad(item.cantidad) }}
              </q-chip>
            </div>
            <q-inner-loading :showing="loading"><q-spinner size="32px" /></q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="shadow-2 full-height">
          <q-card-section class="q-pa-xs">
            <div class="text-subtitle2 text-grey-8">Productos menos vendidos</div>
            <div class="text-caption text-grey-7">Productos con ventas, ordenados por menor cantidad</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-xs ranking-productos" style="position: relative;">
            <div v-if="!loading && menosVendidos.length === 0" class="text-center text-grey-6 q-pa-xl">
              <q-icon name="inventory_2" size="48px" />
              <div class="q-mt-sm">Sin ventas en el rango</div>
            </div>
            <div v-for="(item, index) in menosVendidos" :key="`menos-${item.producto_id}`" class="producto-ranking">
              <div class="posicion posicion-menos">{{ index + 1 }}</div>
              <q-img :src="productoImagen(item)" ratio="1" class="producto-foto">
                <template #error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-6">
                    <q-icon name="medication" size="34px" />
                  </div>
                </template>
              </q-img>
              <div class="producto-info">
                <div class="text-weight-bold ellipsis-2-lines">{{ item.producto }}</div>
                <div class="text-caption text-grey-7">{{ fmt(item.total) }} Bs vendidos</div>
              </div>
              <q-chip color="orange-8" text-color="white" icon="shopping_cart" dense>
                {{ fmtCantidad(item.cantidad) }}
              </q-chip>
            </div>
            <q-inner-loading :showing="loading"><q-spinner size="32px" /></q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <!-- Últimos movimientos -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-2 full-height">
          <q-card-section class="row items-center justify-between q-pa-xs">
            <div class="text-subtitle1 text-weight-bold text-grey-8">Últimos movimientos</div>
            <div class="text-caption text-grey-7">{{ rangoLegible }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none movimientos-compactos">
            <q-markup-table dense wrap-cells>
              <thead>
              <tr class="bg-primary text-white">
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente / Concepto</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Tipo</th>
              </tr>
              </thead>

              <tbody>
              <tr v-if="loading">
                <td colspan="6" class="q-pa-md">
                  <q-skeleton type="text" width="100%" height="26px" />
                  <q-skeleton type="text" width="100%" height="26px" />
                  <q-skeleton type="text" width="100%" height="26px" />
                </td>
              </tr>

              <tr v-for="v in movimientos" :key="v.id">
                <td>{{ v.id }}</td>
                <td>{{ v.fecha }} {{ v.hora }}</td>
                <td>
                  {{ esGasto(v) ? (v.nombre || 'Gasto') : (v.nombre || 'SN') }}
                </td>
                <td>{{ v.user?.name || '-' }}</td>
                <td class="text-weight-bold">
                  <span v-if="esGasto(v)" class="text-negative">- {{ fmt(v.total) }}</span>
                  <span v-else>{{ fmt(v.total) }}</span>
                  Bs
                </td>
                <td>
                  <q-chip :color="esGasto(v) ? 'negative' : 'positive'" text-color="white" dense>
                    {{ esGasto(v) ? 'Gasto' : 'Venta' }}
                  </q-chip>
                </td>
              </tr>

              <tr v-if="!loading && movimientos.length === 0">
                <td colspan="6" class="text-center text-grey q-pa-md">Sin movimientos en el rango seleccionado</td>
              </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'DashboardPrincipal',
  components: { apexchart: VueApexCharts },

  data () {
    const hoy = new Date()
    const y = hoy.getFullYear()
    const m = String(hoy.getMonth() + 1).padStart(2, '0')
    const d = String(hoy.getDate()).padStart(2, '0')

    return {
      loading: false,
      f: {
        desde: `${y}-${m}-01`,
        hasta: `${y}-${m}-${d}`
      },

      // data
      movimientos: [],
      k: { ventas: 0, gastos: 0, ganancia: 0 },
      masVendidos: [],
      menosVendidos: [],

      // bar diario (2 series)
      chartSeries: [
        { name: 'Ventas', data: [] },
        { name: 'Gastos', data: [] },
      ],
      chartOptions: {
        chart: { toolbar: { show: false } },
        xaxis: { categories: [] },
        dataLabels: { enabled: false },
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 6 } },
        tooltip: { y: { formatter: (v) => Number(v || 0).toFixed(2) } },
        yaxis: { labels: { formatter: v => Number(v).toFixed(2) } },
        noData: { text: 'Sin datos' }
      },

      // line mensual
      chartLineSeries: [
        { name: 'Ventas', data: [] },
        { name: 'Gastos', data: [] }
      ],
      chartLineOptions: {
        chart: { toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: [] },
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
        tooltip: { y: { formatter: (v) => Number(v || 0).toFixed(2) } },
        yaxis: { labels: { formatter: v => Number(v).toFixed(2) } },
        noData: { text: 'Sin datos' }
      },

      // ventas por usuario
      chartUserSeries: [{ name: 'Ventas', data: [] }],
      chartUserOptions: {
        chart: { toolbar: { show: false } },
        plotOptions: {
          bar: { horizontal: true, borderRadius: 6, barHeight: '70%' }
        },
        dataLabels: { enabled: false },
        xaxis: { categories: [] },
        tooltip: { y: { formatter: (v) => Number(v || 0).toFixed(2) } },
        noData: { text: 'Sin datos' }
      }
    }
  },

  computed: {
    rangoLegible () {
      return `${this.f.desde} → ${this.f.hasta}`
    }
  },

  mounted () {
    this.cargarDashboard()
  },

  methods: {
    fmt (n) {
      return Number(n || 0).toFixed(2)
    },

    fmtCantidad (n) {
      const cantidad = Number(n || 0)
      return Number.isInteger(cantidad) ? cantidad : cantidad.toFixed(2)
    },

    productoImagen (item) {
      return item.imagen ? `${this.$url}../images/${item.imagen}` : ''
    },

    esGasto (v) {
      return String(v?.tipo_comprobante || '').toLowerCase() === 'gastos'
    },

    preset (tipo) {
      const hoy = new Date()
      const toISO = (d) => [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
      ].join('-')

      if (tipo === 'hoy') {
        const s = toISO(hoy)
        this.f.desde = s
        this.f.hasta = s
      }

      if (tipo === 'semana') {
        const dia = hoy.getDay() || 7 // Lunes=1 ... Domingo=7
        const inicio = new Date(hoy)
        inicio.setDate(hoy.getDate() - (dia - 1))
        this.f.desde = toISO(inicio)
        this.f.hasta = toISO(hoy)
      }

      if (tipo === 'mes') {
        const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        this.f.desde = toISO(inicio)
        this.f.hasta = toISO(hoy)
      }

      this.cargarDashboard()
    },

    async cargarDashboard () {
      this.loading = true
      try {
        const { data } = await this.$axios.get('dashboard', {
          params: { desde: this.f.desde, hasta: this.f.hasta }
        })

        // KPIs
        this.k.ventas = data.kpis?.ventas || 0
        this.k.gastos = data.kpis?.gastos || 0
        this.k.ganancia = data.kpis?.ganancia || 0

        // tabla
        this.movimientos = data.movimientos || []

        // bar diario
        this.chartOptions = {
          ...this.chartOptions,
          xaxis: { ...this.chartOptions.xaxis, categories: data.dias || [] }
        }
        this.chartSeries = [
          { name: 'Ventas', data: data.ventasDiarias || [] },
          { name: 'Gastos', data: data.gastosDiarios || [] }
        ]

        // line mensual
        this.chartLineOptions = {
          ...this.chartLineOptions,
          xaxis: { ...this.chartLineOptions.xaxis, categories: data.meses || [] }
        }
        this.chartLineSeries = [
          { name: 'Ventas', data: data.ventasMes || [] },
          { name: 'Gastos', data: data.gastosMes || [] }
        ]

        // ventas por usuario
        this.chartUserOptions = {
          ...this.chartUserOptions,
          xaxis: { ...this.chartUserOptions.xaxis, categories: data.usuarios || [] }
        }
        this.chartUserSeries = [{ name: 'Ventas', data: data.ventasUsuarios || [] }]

        this.masVendidos = data.masVendidos || []
        this.menosVendidos = data.menosVendidos || []
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'Error al cargar dashboard' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.kpi { border-radius: 8px; }
.kpi-green { background: linear-gradient(135deg, #43a047, #2e7d32); }
.kpi-red   { background: linear-gradient(135deg, #e53935, #b71c1c); }
.kpi-teal  { background: linear-gradient(135deg, #00897b, #00695c); }
.ranking-productos {
  min-height: 240px;
}
.producto-ranking {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px;
  margin-bottom: 3px;
  border: 1px solid #eceff1;
  border-radius: 6px;
  background: white;
  transition: transform .15s ease, box-shadow .15s ease;
}
.producto-ranking:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(0, 0, 0, .08);
}
.producto-foto {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 5px;
  background: #f5f5f5;
}
.producto-info {
  min-width: 0;
  flex: 1;
}
.posicion {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 10px;
}
.posicion-mas { background: #2e7d32; }
.posicion-menos { background: #ef6c00; }
.dashboard-compacto :deep(.q-card) {
  border-radius: 7px;
}
.dashboard-compacto :deep(.text-caption) {
  line-height: 1.15;
}
.dashboard-compacto :deep(.q-chip) {
  margin: 1px;
  font-size: 10px;
}
.movimientos-compactos {
  max-height: 285px;
  overflow: auto;
}
.movimientos-compactos :deep(th),
.movimientos-compactos :deep(td) {
  height: 28px;
  padding: 2px 5px;
  font-size: 11px;
}
@media (max-width: 599px) {
  .producto-foto {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
  }
  .producto-ranking {
    gap: 5px;
    padding: 4px;
  }
}
</style>
