<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- HEADER -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="col">
          <div class="text-h6 text-weight-bold">Devoluciones</div>
          <div class="text-caption text-grey-7">
            Reglas por proveedor (plazos y cortes del mes)
          </div>
        </div>

        <div class="col-auto">
          <q-chip outline icon="assignment_return" class="q-px-md">
            Lista de referencia
          </q-chip>
        </div>
      </q-card-section>
    </q-card>

    <!-- LISTA -->
    <q-card flat bordered>
      <q-card-section class="q-pb-sm">
        <div class="row items-center">
          <div class="text-subtitle1 text-weight-medium">Proveedores</div>
          <q-space />
          <q-badge outline class="q-px-sm">Sin variables · Estático</q-badge>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Usa esta lista como guía de fechas de devolución.
        </div>
      </q-card-section>

      <q-separator />

      <q-list bordered separator padding class="rounded-borders">
        <!-- SANCOR -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">S</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">SANCOR</q-item-label>
            <q-item-label caption>1 mes antes · Liquida hasta el mes</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="event">1 mes antes</q-chip>
          </q-item-section>
        </q-item>

        <!-- BAYER -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">B</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">BAYER</q-item-label>
            <q-item-label caption>En el mes · Antes del 25</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="calendar_month">Corte: 25</q-chip>
          </q-item-section>
        </q-item>

        <!-- BAGO -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">B</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">BAGO</q-item-label>
            <q-item-label caption>1 mes antes · Antes del 15</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="event">1 mes</q-chip>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- INTI -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">I</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">INTI</q-item-label>
            <q-item-label caption>En el mes · Antes del 15</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- MEGALABS -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">M</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">MEGALABS</q-item-label>
            <q-item-label caption>En el mes · Antes del 15</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- TERBOL -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">T</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">TERBOL</q-item-label>
            <q-item-label caption>En el mes · Antes del 15 · c/factura</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="receipt_long">c/factura</q-chip>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- IFA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">I</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">IFA</q-item-label>
            <q-item-label caption>En el mes · Antes del 15 · (No todo)</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="info">(No todo)</q-chip>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- SAE -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">S</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">SAE</q-item-label>
            <q-item-label caption>En el mes · Antes del 20</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 20</q-chip>
          </q-item-section>
        </q-item>

        <!-- SRVAL -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">S</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">SRVAL</q-item-label>
            <q-item-label caption>En el mes · Antes del 15</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- TECNOFARMA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">T</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">TECNOFARMA</q-item-label>
            <q-item-label caption>En el mes · Antes del 10</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 10</q-chip>
          </q-item-section>
        </q-item>

        <!-- COFAR -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">C</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">COFAR</q-item-label>
            <q-item-label caption>En el mes · Antes del 15 · c/factura</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="receipt_long">c/factura</q-chip>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- RECALCINE -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">R</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">RECALCINE</q-item-label>
            <q-item-label caption>En el mes · Antes del 10</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 10</q-chip>
          </q-item-section>
        </q-item>

        <!-- QUIMIZA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">Q</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              QUIMIZA
              <q-badge outline class="q-ml-sm">Genomalab</q-badge>
            </q-item-label>
            <q-item-label caption>3 meses antes · Antes del 10</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="event_repeat">3 meses</q-chip>
            <q-chip dense outline icon="schedule">Corte: 10</q-chip>
          </q-item-section>
        </q-item>

        <!-- PROCAPS -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">P</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">PROCAPS</q-item-label>
            <q-item-label caption>En el mes · Antes del 15</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- LA FAGA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">L</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">LA FAGA</q-item-label>
            <q-item-label caption>En el mes · Antes del 15</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 15</q-chip>
          </q-item-section>
        </q-item>

        <!-- ENGELS -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">E</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">ENGELS</q-item-label>
            <q-item-label caption>4 meses antes · Antes del 10</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="event_repeat">4 meses</q-chip>
            <q-chip dense outline icon="schedule">Corte: 10</q-chip>
          </q-item-section>
        </q-item>

        <!-- SOFIA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">S</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">SOFIA</q-item-label>
            <q-item-label caption>4 meses · Antes del 10 · c/factura</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="receipt_long">c/factura</q-chip>
            <q-chip dense outline icon="event_repeat">4 meses</q-chip>
          </q-item-section>
        </q-item>

        <!-- DISAC -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">D</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">DISAC</q-item-label>
            <q-item-label caption>En el mes · Antes del 8 · c/factura</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="receipt_long">c/factura</q-chip>
            <q-chip dense outline icon="schedule">Corte: 8</q-chip>
          </q-item-section>
        </q-item>

        <!-- SCHMIDTS PHARMA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">S</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">SCHMIDTS PHARMA</q-item-label>
            <q-item-label caption>En el mes · Antes del 10</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 10</q-chip>
          </q-item-section>
        </q-item>

        <!-- ALFA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">A</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">ALFA</q-item-label>
            <q-item-label caption>3 meses · Antes del 10 · c/factura</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="receipt_long">c/factura</q-chip>
            <q-chip dense outline icon="event_repeat">3 meses</q-chip>
          </q-item-section>
        </q-item>

        <!-- QUINFA -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">Q</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">QUINFA</q-item-label>
            <q-item-label caption>En el mes · Antes del 10</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="schedule">Corte: 10</q-chip>
          </q-item-section>
        </q-item>

        <!-- LAFAR -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">L</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">LAFAR</q-item-label>
            <q-item-label caption>3 meses · Antes del 10 · c/factura</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline icon="receipt_long">c/factura</q-chip>
            <q-chip dense outline icon="event_repeat">3 meses</q-chip>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <!-- FOOTER -->
      <q-card-section class="text-caption text-grey-7">
        Nota: “c/factura” = requiere factura para procesar la devolución.
      </q-card-section>
    </q-card>
  </q-page>
</template>
