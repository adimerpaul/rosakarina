<template>
  <q-page class="q-pa-xs">
    <div class="row">
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-indigo">
              <q-item-section avatar>
                <q-icon name="monetization_on" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Ventas Ganancia</q-item-label>
                <q-item-label class="text-white text-h4">
<!--                  {{-->
<!--                    ventas.reduce((acc, v) => {-->
<!--                      const esVenta = String(v.tipo_comprobante || '').toLowerCase() !== 'gastos'-->
<!--                      return esVenta && v.estado === 'Activo'-->
<!--                        ? acc + parseFloat(v.ganancia || 0)-->
<!--                        : acc-->
<!--                    }, 0)-->
<!--                  }}-->
                  {{ totalInternos + totalExternos }}
                  Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-green">
              <q-item-section avatar>
                <q-icon name="monetization_on" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Ventas</q-item-label>
                <q-item-label class="text-white text-h4">
<!--                  {{-->
<!--                  ventas.reduce((acc, v) => {-->
<!--                    const esVenta = String(v.tipo_comprobante || '').toLowerCase() !== 'gastos'-->
<!--                    return esVenta && v.estado === 'Activo'-->
<!--                      ? acc + parseFloat(v.total || 0)-->
<!--                      : acc-->
<!--                  }, 0)-->
<!--                  }}-->
                  {{ totalVentas }}
                  Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-red">
              <q-item-section avatar>
                <q-icon name="monetization_on" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Gastos</q-item-label>
                <q-item-label class="text-white text-h4">
<!--                  {{-->
<!--                    ventas.reduce((acc, v) => {-->
<!--                      const esGasto = String(v.tipo_comprobante || '').toLowerCase() === 'gastos'-->
<!--                      return esGasto && v.estado === 'Activo'-->
<!--                        ? acc + parseFloat(v.total || 0)-->
<!--                        : acc-->
<!--                    }, 0)-->
<!--                  }}-->
                  {{ totalGastos }}
                  Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <div class="row q-col-gutter-sm items-center q-pa-sm">
              <div class="col-12 col-md-2">
                <q-input v-model="fechaInicio" label="Fecha inicio" dense outlined type="date" />
              </div>
              <div class="col-12 col-md-2">
                <q-input v-model="fechaFin" label="Fecha fin" dense outlined type="date" />
              </div>
              <div class="col-12 col-md-2">
                <q-select
                  v-model="user"
                  :options="usersTodos"
                  label="Usuario"
                  dense outlined
                  emit-value map-options
                />
              </div>
              <div class="col-12 col-md-1">
                <q-btn color="primary" label="Buscar" no-caps icon="search" :loading="loading" @click="ventasGet()" dense />
              </div>

              <div class="col-12 col-md-1 text-right">
                <q-btn-dropdown color="primary" label="Exportar" no-caps dense>
                  <q-item clickable v-ripple @click="exportExcel" v-close-popup>
                    <q-item-section avatar><q-icon name="file_download" /></q-item-section>
                    <q-item-section>Excel</q-item-section>
                  </q-item>
                </q-btn-dropdown>
              </div>

              <div class="col-12 col-md-2 text-right">
                <div class="row justify-end q-gutter-sm">
                  <q-btn
                    color="positive"
                    label="Nueva venta"
                    no-caps
                    dense
                    icon="add_circle_outline"
                    :loading="loading"
                    :to="'/ventaNuevo'"
                  />
                </div>
              </div>
              <div class="col-12 col-md-2 text-right">
                <!-- ✅ NUEVO: BOTÓN GASTO -->
                <q-btn
                  color="negative"
                  label="Gasto"
                  no-caps
                  dense
                  icon="remove_circle_outline"
                  @click="openGastoDialog"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-markup-table dense wrap-cells>
      <thead>
      <tr class="bg-primary text-white">
        <th>Acciones</th>
        <th>ID</th>
        <th>Fecha</th>
        <th>Cliente / Concepto</th>
        <th>Usuario</th>
        <th>Estado</th>
        <th>Total</th>
        <th>Productos</th>
<!--        detalles-->
        <th>Detalles</th>
        <th>Tipo</th>
      </tr>
      </thead>

      <tbody>
      <template v-if="ventas.length !== 0">
        <tr v-for="venta in ventas" :key="venta.id">
          <td>
            <q-btn-dropdown color="primary" label="Opciones" no-caps dense size="10px">
              <q-item clickable v-ripple @click="imprimir(venta)" v-close-popup>
                <q-item-section avatar><q-icon name="print" /></q-item-section>
                <q-item-section>Imprimir</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="anular(venta.id)" v-close-popup>
                <q-item-section avatar><q-icon name="delete" /></q-item-section>
                <q-item-section>Anular</q-item-section>
              </q-item>

<!--              <q-item-->
<!--                clickable-->
<!--                v-ripple-->
<!--                v-if="venta.tipo_comprobante !== 'Gastos'"-->
<!--                @click="tipoVentasChange(venta.id)"-->
<!--                v-close-popup-->
<!--              >-->
<!--                <q-item-section avatar><q-icon name="swap_horiz" /></q-item-section>-->
<!--                <q-item-section>Cambiar a {{ venta.tipo_venta === 'Interno' ? 'Externo' : 'Interno' }}</q-item-section>-->
<!--              </q-item>-->

              <q-item clickable v-ripple v-if="venta.estado==='Activo' && venta.tipo_comprobante !== 'Gastos'" @click="openDevolver(venta)" v-close-popup>
                <q-item-section avatar><q-icon name="undo" /></q-item-section>
                <q-item-section>Devolver productos</q-item-section>
              </q-item>
            </q-btn-dropdown>
          </td>

          <td>{{ venta.id }}</td>

          <td>
            {{ venta.fecha }}
            {{ venta.hora }}
          </td>

          <td>
            {{ venta.tipo_comprobante === 'Gastos' ? (venta.nombre || 'Gasto') : (venta.nombre || 'SN') }}
          </td>

          <td>{{ venta.user?.name || '—' }}</td>

          <td>
            <q-chip
              :color="venta.estado === 'Activo' ? 'positive' : 'negative'"
              class="text-white"
              dense
            >
              {{ venta.estado }}
            </q-chip>
          </td>

          <td class="text-bold">
              <span v-if="venta.tipo_comprobante === 'Gastos'" class="text-negative">
                - {{ venta.total }}
              </span>
            <span v-else>
                {{ venta.total }}
              </span>

            <q-chip
              size="10px"
              :color="venta.tipo_pago === 'Efectivo' ? 'green' : 'blue'"
              class="text-white"
              dense
            >
              {{ (venta.tipo_pago || 'E').charAt(0) }}
            </q-chip>
          </td>

          <td>
<!--            <div style="max-width: 200px; line-height: 0.9;" en html>-->
<!--              {{ venta.detailsText || '—' }}-->
<!--            </div>-->
            <div style="max-width: 200px; line-height: 1.2; white-space: normal; overflow: hidden; text-overflow: ellipsis;" v-html="venta.detailsText || '—'">
            </div>
          </td>
          <td>
            {{ venta.detalles || '—' }}
          </td>
          <td>
            <q-chip
              v-if="venta.tipo_comprobante === 'Gastos'"
              color="negative"
              class="text-white"
              dense
            >
              Gasto
            </q-chip>

<!--            <q-chip-->
<!--              v-else-->
<!--              :color="venta.tipo_venta === 'Internado' ? 'indigo' : 'orange'"-->
<!--              class="text-white"-->
<!--              dense-->
<!--            >-->
<!--              {{ venta.tipo_venta }}-->
<!--&lt;!&ndash;            </q-chip>&ndash;&gt; Venta-->
            <q-chip v-else color="teal" class="text-white" dense>
              Venta
            </q-chip>
          </td>
        </tr>
      </template>
      </tbody>
    </q-markup-table>

    <!-- ✅ DIALOG: GASTO -->
    <q-dialog v-model="gastoDialog" persistent>
      <q-card style="width: 520px; max-width: 95vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Registrar gasto</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="gastoDialog=false" />
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-input v-model="gastoForm.fecha" type="date" dense outlined label="Fecha" />
          <q-input v-model="gastoForm.concepto" dense outlined label="Concepto / Descripción" />
          <q-input v-model.number="gastoForm.monto" type="number" min="0" step="0.01" dense outlined label="Monto (Bs.)" />
          <q-select
            v-model="gastoForm.tipo_pago"
            :options="['Efectivo', 'QR', 'Tarjeta', 'Transferencia']"
            dense outlined label="Tipo pago"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" no-caps @click="gastoDialog=false" />
          <q-btn
            color="negative"
            label="Guardar gasto"
            no-caps
            :loading="gastoLoading"
            @click="guardarGasto"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog devolución -->
    <q-dialog v-model="devDialog" persistent>
      <q-card style="max-width: 860px; width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Devolver productos</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="devDialog=false" />
        </q-card-section>

        <q-card-section>
          <q-markup-table dense wrap-cells flat bordered>
            <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Lote</th>
              <th>Vencimiento</th>
              <th style="width:100px;">Vendido</th>
              <th style="width:140px;">Devolver</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(d,i) in venta.venta_detalles" :key="d.id">
              <td class="text-center">{{ i+1 }}</td>
              <td style="max-width:360px;overflow:hidden;text-overflow:ellipsis;">
                {{ d.nombre || d.producto?.nombre || '—' }}
              </td>
              <td class="text-center">{{ d.lote || '—' }}</td>
              <td class="text-center">{{ d.fecha_vencimiento || '—' }}</td>
              <td class="text-center">{{ d.cantidad }}</td>
              <td>
                <q-btn
                  size="sm"
                  color="negative"
                  label="Devolver"
                  no-caps
                  @click="devolverProducto(venta.id, d.id, d.cantidad)"
                  icon="undo"
                />
              </td>
            </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div id="myElement" class="hidden"></div>
  </q-page>
</template>

<script>
import moment from 'moment'
import { Imprimir } from "src/addons/Imprimir";
import { Excel } from "src/addons/Excel";

export default {
  name: 'Ventas',
  data() {
    return {
      ventas: [],
      venta: {},
      fechaInicio: moment().format('YYYY-MM-DD'),
      fechaFin: moment().format('YYYY-MM-DD'),
      loading: false,
      users: [],
      user: '',
      devDialog: false,

      // ✅ gasto
      gastoDialog: false,
      gastoLoading: false,
      gastoForm: {
        fecha: moment().format('YYYY-MM-DD'),
        concepto: '',
        monto: null,
        tipo_pago: 'Efectivo',
      },
    }
  },
  mounted() {
    this.ventasGet()
    this.usersGet()
  },
  methods: {
    openGastoDialog() {
      this.gastoForm = {
        fecha: moment().format('YYYY-MM-DD'),
        concepto: '',
        monto: null,
        tipo_pago: 'Efectivo',
      }
      this.gastoDialog = true
    },

    guardarGasto() {
      const concepto = String(this.gastoForm.concepto || '').trim()
      const monto = Number(this.gastoForm.monto)

      if (!concepto) {
        this.$q.notify({ type: 'warning', message: 'Ingrese el concepto del gasto' })
        return
      }
      if (isNaN(monto) || monto <= 0) {
        this.$q.notify({ type: 'warning', message: 'Ingrese un monto válido' })
        return
      }

      this.gastoLoading = true
      this.$axios.post('ventasGasto', {
        fecha: this.gastoForm.fecha,
        concepto: concepto,
        monto: monto,
        tipo_pago: this.gastoForm.tipo_pago,
      }).then(() => {
        this.$alert.success('Gasto registrado')
        this.gastoDialog = false
        this.ventasGet()
      }).catch(err => {
        this.$alert.error(err?.response?.data?.message || 'Error al registrar gasto')
      }).finally(() => {
        this.gastoLoading = false
      })
    },

    devolverProducto(ventaId, ventaDetalleId, cantidadVendido) {
      this.$q.dialog({
        title: 'Devolver producto',
        message: `Ingrese la cantidad a devolver (vendido: ${cantidadVendido}):`,
        prompt: {
          model: cantidadVendido,
          type: 'number',
          isValid: val => {
            const num = Number(val);
            return !isNaN(num) && num > 0 && num <= cantidadVendido;
          },
          label: 'Cantidad a devolver',
          hint: `Debe ser un número entre 1 y ${cantidadVendido}`,
          mask: '##########'
        },
        cancel: true,
        persistent: true
      }).onOk(cantidadDevolver => {
        const cantidadNum = Number(cantidadDevolver);

        if (isNaN(cantidadNum) || cantidadNum <= 0 || cantidadNum > cantidadVendido) {
          this.$alert.error('Cantidad inválida');
          return;
        }

        this.$axios.post('ventasDevolverProducto', {
          venta_id: ventaId,
          venta_detalle_id: ventaDetalleId,
          cantidad: cantidadNum
        }).then(() => {
          this.$alert.success('Producto devuelto correctamente');
          this.devDialog = false;
          this.ventasGet();
        }).catch(error => {
          this.$alert.error(error.response.data.message);
        });
      });
    },

    openDevolver(venta) {
      this.venta = venta;
      this.devDialog = true;
    },

    exportExcel() {
      // Exportar SOLO ventas activas (no gastos)
      const ventasActivas = (this.ventas || []).filter(v =>
        String(v.estado).toLowerCase() === 'activo' //&&
        // String(v.tipo_comprobante || '').toLowerCase() !== 'gastos'
      );

      if (ventasActivas.length === 0) {
        this.$q.notify({ type: 'warning', message: 'No hay ventas ACTIVAS para exportar' });
        return;
      }

      const data = [{
        columns: [
          { label: "ID", value: "id" },
          { label: "Fecha", value: "fecha" },
          { label: "Cliente", value: "nombre" },
          { label: "Usuario", value: "user.name" },
          { label: "Estado", value: "estado" },
          { label: "Total", value: "total" },
          // tipocomprobante
          { label: "Tipo comprobante", value: "tipo_comprobante" },
          { label: "Detalle", value: "detailsText" },
          // { label: "Tipo venta", value: "tipo_venta" },
        ],
        content: ventasActivas
      }];

      Excel.export(data, 'Ventas_Activas');
    },

    usersGet() {
      this.$axios.get('users').then(res => {
        this.users = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },

    imprimir(venta) {
      Imprimir.reciboVentaSimple(venta);
    },

    tipoVentasChange(id) {
      this.$axios.put(`tipoVentasChange/${id}`).then(() => {
        this.$alert.success('Tipo de venta cambiado')
        this.ventasGet()
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },

    anular(id) {
      this.$alert.dialog('¿Está seguro de anular?').onOk(() => {
        this.$axios.put(`ventasAnular/${id}`).then(() => {
          this.$alert.success('Anulado')
          this.ventasGet()
        }).catch(error => {
          this.$alert.error(error.response.data.message)
        })
      })
    },

    ventasGet() {
      this.loading = true
      this.$axios.get('ventas', {
        params: {
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          user: this.user
        }
      }).then(res => {
        this.ventas = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
  },

  computed: {
    totalGastos() {
      return this.ventas.reduce((acc, v) => {
        const esGasto = String(v.tipo_comprobante || '').toLowerCase() === 'gastos'
        return (esGasto && v.estado === 'Activo')
          ? acc + parseFloat(v.total || 0)
          : acc
      }, 0)
    },
    totalVentas() {
      return this.ventas.reduce((acc, v) => {
        const esVenta = String(v.tipo_comprobante || '').toLowerCase() !== 'gastos'
        return (esVenta && v.estado === 'Activo')
          ? acc + parseFloat(v.total || 0)
          : acc
      }, 0)
    },
    usersTodos() {
      return [{ label: 'Todos', value: '' }, ...this.users.map(u => ({ label: u.name, value: u.id }))]
    },

    // ✅ Totales SOLO para ventas (no gastos)
    totalInternos() {
      return this.ventas.reduce((acc, v) => {
        const esVenta = String(v.tipo_comprobante || '').toLowerCase() !== 'gastos'
        return (esVenta && v.tipo_venta === 'Internado' && v.estado === 'Activo')
          ? acc + parseFloat(v.total || 0)
          : acc
      }, 0)
    },

    totalExternos() {
      return this.ventas.reduce((acc, v) => {
        const esVenta = String(v.tipo_comprobante || '').toLowerCase() !== 'gastos'
        return (esVenta && v.tipo_venta === 'Externo' && v.estado === 'Activo')
          ? acc + parseFloat(v.total || 0)
          : acc
      }, 0)
    }
  }
}
</script>
