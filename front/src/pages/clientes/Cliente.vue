<template>
  <q-page class="q-pa-md">
    <q-table
      :rows="clientes"
      :columns="columns"
      row-key="id"
      dense
      wrap-cells
      flat
      bordered
      :rows-per-page-options="[0]"
      title="Clientes"
      hide-bottom
    >
      <template v-slot:top>
        <div style="width: 100%">
          <div>
            <q-input
              v-model="filter"
              label="Buscar (nombre, CI, teléfono)"
              dense
              outlined
              clearable
              :debounce="500"
              @update:model-value="resetAndFetch"
            >
              <template #append>
                <q-icon name="search" />
              </template>
              <template #before>
                <q-btn
                  color="positive"
                  label="Nuevo"
                  icon="add_circle_outline"
                  no-caps
                  :loading="loading"
                  @click="clienteNew"
                />
              </template>
            </q-input>
          </div>

          <div class="flex flex-center q-mt-sm">
            <q-pagination
              v-model="current_page"
              :max="Math.ceil(total / per_page) || 1"
              :max-pages="5"
              @update:model-value="clientesGet"
            />
          </div>
        </div>
      </template>

      <!-- Acciones -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <q-btn-dropdown label="Opciones" no-caps size="10px" dense color="primary">
            <q-list>
              <q-item clickable v-close-popup @click="clienteEdit(null, props.row)">
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Editar</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="clienteDelete(props.row.id)">
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog CRUD -->
    <q-dialog v-model="clienteDialog" persistent>
      <q-card style="min-width: 360px; max-width: 520px; width: 95vw;">
        <q-card-section class="q-pb-none row items-center">
          <div class="text-subtitle2">
            {{ cliente.id ? 'Editar' : 'Nuevo' }} cliente
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="clienteDialog = false" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="cliente.id ? clientePut() : clientePost()">
            <q-input
              v-model="cliente.nombre"
              label="Nombre"
              dense
              outlined
              :rules="[val => !!val || 'Campo requerido']"
            />

            <q-input
              v-model="cliente.ci"
              label="CI / NIT"
              dense
              outlined
              :rules="[val => !!val || 'Campo requerido']"
            />

            <q-input
              v-model="cliente.telefono"
              label="Teléfono"
              dense
              outlined
            />

            <q-input
              v-model="cliente.direccion"
              label="Dirección"
              dense
              outlined
              type="textarea"
              autogrow
            />

            <div class="text-right q-mt-sm">
              <q-btn
                color="negative"
                label="Cancelar"
                no-caps
                :loading="loading"
                @click="clienteDialog = false"
              />
              <q-btn
                color="primary"
                label="Guardar"
                type="submit"
                no-caps
                :loading="loading"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'ClientePage',
  data () {
    return {
      clientes: [],
      cliente: {},
      clienteDialog: false,
      loading: false,

      filter: '',
      current_page: 1,
      total: 0,
      per_page: 10,

      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },

        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
        { name: 'ci', label: 'CI / NIT', align: 'left', field: 'ci', sortable: true },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' },
        { name: 'direccion', label: 'Dirección', align: 'left', field: 'direccion' }
      ]
    }
  },
  mounted () {
    this.clientesGet()
  },
  methods: {
    resetAndFetch () {
      this.current_page = 1
      this.clientesGet()
    },

    clienteNew () {
      this.cliente = { nombre: '', ci: '', telefono: '', direccion: '' }
      this.clienteDialog = true
    },

    clientesGet () {
      this.loading = true
      this.$axios.get('clientes', {
        params: {
          search: this.filter,
          page: this.current_page
        }
      }).then(res => {
        // Soporta paginado (Laravel) y también "all()" por si tu index todavía no pagina.
        if (res.data && Array.isArray(res.data.data)) {
          this.clientes = res.data.data
          this.total = res.data.total || 0
          this.per_page = res.data.per_page || 10
          this.current_page = res.data.current_page || this.current_page
        } else if (Array.isArray(res.data)) {
          this.clientes = res.data
          this.total = res.data.length
          this.per_page = 10
          this.current_page = 1
        } else {
          this.clientes = []
        }
      }).catch(err => {
        const msg = err?.response?.data?.message || 'Error al cargar clientes'
        this.$alert.error(msg)
      }).finally(() => {
        this.loading = false
      })
    },

    clienteEdit (evt, row) {
      // si viene por @row-click, row llega como 2do param
      const cliente = row || evt
      if (!cliente || !cliente.id) return
      this.cliente = { ...cliente }
      this.clienteDialog = true
    },

    clientePost () {
      this.loading = true
      this.$axios.post('clientes', this.cliente).then(() => {
        this.clientesGet()
        this.clienteDialog = false
        this.$alert.success('Cliente creado')
      }).catch(err => {
        const msg = err?.response?.data?.message || 'Error al crear cliente'
        this.$alert.error(msg)
      }).finally(() => {
        this.loading = false
      })
    },

    clientePut () {
      this.loading = true
      this.$axios.put('clientes/' + this.cliente.id, this.cliente).then(() => {
        this.clientesGet()
        this.clienteDialog = false
        this.$alert.success('Cliente actualizado')
      }).catch(err => {
        const msg = err?.response?.data?.message || 'Error al actualizar cliente'
        this.$alert.error(msg)
      }).finally(() => {
        this.loading = false
      })
    },

    clienteDelete (id) {
      this.$alert.dialog('¿Desea eliminar el cliente?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('clientes/' + id).then(() => {
            this.clientesGet()
            this.$alert.success('Cliente eliminado')
          }).catch(err => {
            const msg = err?.response?.data?.message || 'Error al eliminar cliente'
            this.$alert.error(msg)
          }).finally(() => {
            this.loading = false
          })
        })
    }
  }
}
</script>
