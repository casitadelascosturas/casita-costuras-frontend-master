import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { noAuthGuard } from './shared/guards/no-auth.guard';
import { pendingChangesGuard } from './shared/guards/pending-changes.guard';
import { pendingChangesReportsGuard } from './shared/guards/pending-changes-reports.guard';
import { pendingChangesReceiptsGuard } from './shared/guards/pending-changes-receipts.guard';
import { ModeCrud } from './shared/enums/mode-crud.enum';
import { URL_CLIENTS, URL_MEASURES, URL_ORDERS, URL_PRODUCTS, URL_SERVICES, URL_TASK, URL_USERS } from './shared/constants/endpoints';
import { rolesResolver } from './shared/resolvers/roles.resolver';
import { measuresResolver } from './shared/resolvers/measures.resolver';
import { optionsUnitMeasuresResolver } from './shared/resolvers/options-unit-measures.resolver';

export const routes: Routes =
[
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    canMatch: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        title: 'BodegasApp',
        canMatch: [authGuard],
        loadComponent: () => import('./dashboard/pages/home/home.component')
      },
      {
        path: 'usuarios',
        title: 'Usuarios',
        children: [
          {
            path: '',
            title: 'Usuarios',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component'),
            data: { 
              configName: 'users-crud',
              serviceCrud: URL_USERS 
            },
            resolve: {
              roles: rolesResolver
            }
          },
          {
            path: 'nuevo',
            title: 'Usuarios',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'users-crud',
              serviceCrud: URL_USERS,
              mode: ModeCrud.CREATE,
            },
            resolve: {
              roles: rolesResolver
            }
          },
          {
            path: ':mode/:id',
            title: 'Usuarios',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'users-crud',
              serviceCrud: URL_USERS,
              mode: ModeCrud.UPDATE,
            },
            resolve: {
              roles: rolesResolver
            }
          },
        ]
      },
      {
        path: 'pedidos',
        title: 'Pedidos',
        children:[
          {
            path: '',
            title: 'Pedidos',
            loadComponent: () => import('./dashboard/modules/orders/orders-grid-main/orders-grid-main.component'),
            data: { 
              configName: 'orders-crud',
              serviceCrud: URL_ORDERS 
            },
          },
          {
            path: 'nuevo',
            title: 'Pedidos',
            loadComponent: () => import('./dashboard/modules/orders/orders-form-main/orders-form-main.component'),
            data: { 
              configName: 'orders-crud',
              serviceCrud: URL_ORDERS,
              mode: ModeCrud.CREATE,
            }
          },
          {
            path: 'detalle/:id',
            title: 'Pedidos',
            loadComponent: () => import('./dashboard/modules/orders/orders-view-details/orders-view-details.component'),
            data: { 
              configName: 'orders-crud',
              serviceCrud: URL_ORDERS,
              mode: ModeCrud.UPDATE,
            }
          },
        ]
      },
      {
        path: 'clientes',
        title: 'Clientes',
        children:[
          {
            path: '',
            title: 'Clientes',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component'),
            data: { 
              configName: 'clients-crud',
              serviceCrud: URL_CLIENTS 
            },
          },
          {
            path: 'nuevo',
            title: 'Clientes',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'clients-crud',
              serviceCrud: URL_CLIENTS,
              mode: ModeCrud.CREATE,
            }
          },
          {
            path: ':mode/:id',
            title: 'Clientes',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'clients-crud',
              serviceCrud: URL_USERS,
              mode: ModeCrud.UPDATE,
            }
          },
        ]
      },
      {
        path: 'notificaciones',
        title: 'Notificaciones',
        children:[
          {
            path: '',
            title: 'Notificaciones',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component')
          },
        ]
      },
      {
        path: 'ventas',
        title: 'Ventas',
        children:[
          {
            path: '',
            title: 'Ventas',
            loadComponent: () => import('./dashboard/modules/sales/sales-charts/sales-charts.component')
          },
        ]
      },
      {
        path: 'kpi',
        title: 'KPI',
        children:[
          {
            path: '',
            title: 'KPI',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component')
          },
        ]
      },
      {
        path: 'servicios',
        title: 'Servicios',
        children:[
          {
            path: '',
            title: 'Servicios',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component'),
            data: { 
              configName: 'services-crud',
              serviceCrud: URL_SERVICES,
              mode: ModeCrud.CREATE,
            }
          },
          {
            path: 'nuevo',
            title: 'Servicios',
            loadComponent: () => import('./dashboard/modules/sewing-services/components/services-form-main/services-form-main.component'),
            data: { 
              configName: 'services-crud',
              serviceCrud: URL_SERVICES,
              mode: ModeCrud.CREATE,
            },
            resolve: {
            }
          },
          {
            path: ':mode/:id',
            title: 'Servicios',
            loadComponent: () => import('./dashboard/modules/sewing-services/components/services-form-main/services-form-main.component'),
            data: { 
              configName: 'services-crud',
              serviceCrud: URL_SERVICES,
              mode: ModeCrud.UPDATE,
            }
          },
        ]
      },
      {
        path: 'detalles-servicios',
        title: 'Detalles de Servicios',
        children:[
          {
            path: '',
            title: 'Detalles de servicio',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component'),
            data: { 
              configName: 'measures-crud',
              serviceCrud: URL_MEASURES,
            },
            resolve: {
              unitMeasure: optionsUnitMeasuresResolver
            }
          },
          {
            path: 'nuevo',
            title: 'Detalles de servicios',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'measures-crud',
              serviceCrud: URL_MEASURES,
              mode: ModeCrud.CREATE,
            },
            resolve: {
              unitMeasure: optionsUnitMeasuresResolver
            }
          },
          {
            path: ':mode/:id',
            title: 'Detalles de servicios',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'measures-crud',
              serviceCrud: URL_MEASURES,
              mode: ModeCrud.UPDATE,
            },
            resolve: {
              unitMeasure: optionsUnitMeasuresResolver
            }
          },
        ]
      },
      {
        path: 'productos',
        title: 'Productos',
        children:[
          {
            path: '',
            title: 'Detalles de servicio',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component'),
            data: { 
              configName: 'products-crud',
              serviceCrud: URL_PRODUCTS,
            }
          },
          {
            path: 'nuevo',
            title: 'Productos',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'products-crud',
              serviceCrud: URL_PRODUCTS,
              mode: ModeCrud.CREATE,
            }
          },
          {
            path: ':mode/:id',
            title: 'Productos',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-form/crud-form.component'),
            data: { 
              configName: 'products-crud',
              serviceCrud: URL_PRODUCTS,
              mode: ModeCrud.UPDATE,
            }
          },
        ]
      },
      {
        path: 'reportes',
        title: 'Reportes',
        // loadComponent: () => import('./dashboard/pages/my-profile/my-profile.component'),
        // canMatch: [authGuard]
        children:[
          {
            path: '',
            title: 'Reportes',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component')
          },
        ]
      },
      {
        path: 'reservas',
        title: 'Reservas',
        // loadComponent: () => import('./dashboard/pages/my-profile/my-profile.component'),
        // canMatch: [authGuard]
        children:[
          {
            path: '',
            title: 'Reservas',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component')
          },
        ]
      },
      {
        path: 'ofertas',
        title: 'Ofertas',
        // loadComponent: () => import('./dashboard/pages/my-profile/my-profile.component'),
        // canMatch: [authGuard]
        children:[
          {
            path: '',
            title: 'Ofertas',
            loadComponent: () => import('./shared/components/crud-main/components/grid/crud-grid/crud.component')
          },
        ]
      },
      {
        path: 'tareas',
        title: 'Tareas',
        // loadComponent: () => import('./dashboard/pages/my-profile/my-profile.component'),
        // canMatch: [authGuard]
        children:[
          {
            path: '',
            title: 'Tareas',
            loadComponent: () => import('./dashboard/modules/tasks/tasks-grid-main/tasks-grid-main.component'),
            data: { 
              configName: 'task-crud',
              serviceCrud: URL_TASK,
            }
          },
          {
            path: 'nuevo',
            title: 'Tareas',
            loadComponent: () => import('./dashboard/modules/tasks/components/tasks-dialog-asign/tasks-dialog-asign.component'),
            data: { 
              configName: 'task-crud',
              serviceCrud: URL_TASK,
            }
          },
        ]
      },
      {
        path: 'ajustes',
        title: 'Ajustes',
        loadComponent: () => import('./dashboard/pages/my-profile/my-profile.component'),
        canMatch: [authGuard]
      },
    ]
  },
  {
    path: 'authentication',
    title: 'Autenticación',
    loadComponent: () => import('./auth/auth.component'),
    children:[
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        title: 'Iniciar Sesión',
        canActivate:[noAuthGuard],
        loadComponent: () => import('./auth/login/login.component')
      },
      {
        path: 'verify',
        title: 'Verificación de usuario',
        loadComponent: () => import('./auth/user-verify/user-verify.component')
      },
      {
        path: 'forget-password',
        title: 'Olvide mi contraseña',
        loadComponent: () => import('./auth/forget-password/forget-password.component')
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
];
