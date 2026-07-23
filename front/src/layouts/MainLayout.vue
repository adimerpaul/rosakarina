<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-white text-primary"
      bordered
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
<!--          <q-btn no-caps flat dense round icon="o_search" />-->
<!--          {{ rutaActual }}-->
          <span class="text-subtitle2">
            {{ $version }}
          </span>
        </q-toolbar-title>
        <div>
<!--          Quasar v{{ $q.version }}-->
          <q-btn-group flat>
            <q-btn icon="notifications" flat dense>
              <q-badge v-if="notificaciones.length" color="red" floating>{{ notificaciones.length }}</q-badge>
              <q-menu>
                <q-list style="min-width: 250px; max-height: 300px" separator>
                  <q-item v-if="notificaciones.length === 0">
                    <q-item-section>No hay productos por vencer</q-item-section>
                  </q-item>
                  <q-item v-for="(n, index) in notificaciones" :key="index" clickable>
                    <q-item-section avatar>
                      <q-avatar size="36px">
                        <img :src="`${$url}../images/${n.imagen}`" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ n.producto }}</q-item-label>
                      <q-item-label caption>Vence en {{ n.dias_restantes }} días</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn no-caps dense :label="$store.user.name">
<!--              <template icon-->
              <div style="display: flex; align-items: center;padding-left: 10px">
                <img :src="`${$url}../avatares/${$store.user.avatar || 'default.png'}`" class="q-mr-sm" style="width:24px; height:24px; border-radius:50%" />
              </div>
<!--              <template afater emplate-->
              <q-menu>
                <q-list>
                  <q-item clickable>
                    <q-item-section avatar>
                      <q-icon name="account_circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ $store.user.name }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ $store.user.role }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="logout" v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="exit_to_app" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Salir</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-btn-group>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="500"
      class="drawer-menu text-white"
    >
      <q-list dense>
        <q-item dense>
          <q-item-section avatar>
<!--            <q-icon name="account_circle" />-->
<!--            <img :src="`${$url}../avatares/${props.row.avatar || 'default.png'}`">-->
            <img :src="`${$url}../avatares/${$store.user.avatar || 'default.png'}`" class="q-mr-sm" style="width:40px; height:40px; border-radius:50%" />
          </q-item-section>
          <q-item-section>
<!--            <pre>-->
<!--              {{ $store.user}}-->
<!--            </pre>-->
            <q-item-label >
              {{ $store.user.name }}
<!--              <q-chip color="white" text-color="primary" dense>-->
<!--              <span class="text-bold">-->
<!--                {{ $store.user.role }}-->
<!--              </span>-->
<!--              </q-chip>-->
            </q-item-label>
            <q-item-label caption>
              <q-chip :color="$store.user.color" text-color="white" dense>
                {{ $store.user.role }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
<!--        <q-separator  class="bg-white" inset />-->
        <div class="menu-label text-center">
          OPCIONES
        </div>
        <template v-for="link in linksList" :key="link.title">
          <q-item
            clickable
            :to="link.link"
            exact
            class="text-white"
            active-class="menu"
            v-if="link && $store.permissions.some(p => p.name === link.can || link.can === 'Todos')"
          >
            <q-item-section avatar>
              <q-icon
                :name="$route.path === link.link ? 'o_' + link.icon : link.icon"
                :class="$route.path === link.link ? 'text-white' : ''"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="$route.path === link.link ? 'text-white text-bold' : ''">
                {{ link.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <q-item clickable class="text-red" @click="logout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Salir</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      linksList: [
        { title: 'Principal', icon: 'dashboard', link: '/', can: 'Todos'},
        { title: 'Usuarios', icon: 'supervisor_account', link: '/usuarios', can: 'Usuarios'},
        // { title: 'Doctores', icon: 'medical_services', link: '/doctores', can: 'Doctores'},
        { title: 'Clientes', icon: 'person', link: '/pacientes', can: 'Pacientes'},
        { title: 'Productos', icon: 'inventory_2', link: '/productos', can: 'Productos'},
        { title: 'Ventas', icon: 'sell', link: '/venta', can: 'Ventas'},
        { title: 'Venta Nueva', icon: 'add_shopping_cart', link: '/ventaNuevo', can: 'Nueva venta'},
        { title: 'Proveedores', icon: 'local_shipping', link: '/proveedores', can: 'Proveedores'},
        { title: 'Compras', icon: 'shopping_cart_checkout', link: '/compras', can: 'Compras'},
        { title: 'Compras Nueva', icon: 'add_business', link: '/compras-create', can: 'Compras nuevas'},
        { title: 'Pedidos', icon: 'assignment', link: '/pedidos', can: 'Pedidos'},
        { title: 'Pedidos Crear', icon: 'note_add', link: '/pedidos/create', can: 'Pedidos nuevos'},
        // fecha devoluciones
        { title: 'Devoluciones', icon: 'undo', link: '/devoluciones', can: 'Devoluciones'},
        // {
        //   path: '/pedidos',
        //   name: 'pedidos',
        //   component: () => import('pages/pedidos/Pedidos.vue')
        // },
        // {
        //   path: '/pedidos/create',
        //   name: 'pedidos-create',
        //   component: () => import('pages/pedidos/PedidosCreate.vue')
        // }
        { title: 'Productos por vencer', icon: 'hourglass_bottom', link: '/productos-vencer', can: 'Productos por vencer'},
        { title: 'Productos vencidos', icon: 'report_problem', link: '/productos-vencidos', can: 'Productos vencidos'},
        { title: 'Productos y precios', icon: 'price_check', link: '/productos-precios', can: 'Precio de ventas productos'},
      ],
      notificaciones: [],
    }
  },
  mounted() {
    this.getNotificaciones()
  },
  methods: {
    getNotificaciones() {
      this.$axios.get('/productos-por-vencer-campana').then(res => {
        this.notificaciones = res.data;
      }).catch(() => {
        this.notificaciones = [];
      });
    },
    logout () {
      this.$alert.dialog('¿Desea salir del sistema?')
        .onOk(() => {
          this.$store.isLogged = false
          this.$store.user = {}
          localStorage.removeItem('tokenRosa')
          this.$router.push('/login')
        })
    },
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  computed: {
    rutaActual () {
      return this.$route.path
    }
  }
}
</script>
<style>
.drawer-menu{
  background: linear-gradient(180deg, #c65307 0%, #803d1a 45%, #b34700 100%);
}
.drawer-menu .q-item{
  border-radius: 6px;
  margin: 1px 6px;
  min-height: 32px;
  padding-top: 2px;
  padding-bottom: 2px;
  transition: background 0.2s;
}
.drawer-menu .q-item:hover{
  background: rgba(255, 255, 255, 0.1);
}
.menu{
  background: linear-gradient(90deg, #e65100 0%, #ff9800 100%);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}
.drawer-menu .q-item__section--avatar{
  min-width: 32px;
  padding-right: 8px;
}
.drawer-menu .q-item__label{
  font-size: 13px;
}
.drawer-menu .text-red{
  color: #ffab91 !important;
}
.menu-label{
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.55);
  margin: 8px 0 4px;
}
</style>
