
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'common-ui';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'overview',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      // },
      // {
      //   path: 'calculator',
      //   loadChildren: () => import('./calculator.module').then(m => m.CalculatorModule)
      },
      {
        path: 'overview/site/:siteId/:gamingDay',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/:gamingDay',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/:gamingDay',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/:gamingDay',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/OA/:OAId/:gamingDay',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/OA/:OAId/pit/:pitId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },

      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/:gamingDay',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/pit/:pitId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/pit/:pitId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },

      {
        path: 'overview/site/:siteId/GA/:GAId/pit/:pitId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/pit/:pitId/tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/pit/:pitId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/pit/:pitId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/OA/:OAId/pit/:pitId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },

      {
        path: 'overview/site/:siteId/GA/:GAId/pit/:pitId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/pit/:pitId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/players/:gamingDay',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)
      },

      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/pit/:pitId/performance',
        loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/pit/:pitId/performance',
        loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/OA/:OAId/pit/:pitId/performance',
        loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/pit/:pitId/performance',
        loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/pit/:pitId/performance',
        loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/performance',
        loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule)
      },

      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/pit/:pitId/mratings',
        loadChildren: () => import('./manualratings/manualratings.module').then(m => m.ManualratingsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/pit/:pitId/mratings',
        loadChildren: () => import('./manualratings/manualratings.module').then(m => m.ManualratingsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/OA/:OAId/pit/:pitId/mratings',
        loadChildren: () => import('./manualratings/manualratings.module').then(m => m.ManualratingsModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/pit/:pitId/mratings',
        loadChildren: () => import('./manualratings/manualratings.module').then(m => m.ManualratingsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/pit/:pitId/mratings',
        loadChildren: () => import('./manualratings/manualratings.module').then(m => m.ManualratingsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/mratings',
        loadChildren: () => import('./manualratings/manualratings.module').then(m => m.ManualratingsModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/pit/:pitId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/pit/:pitId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/OA/:OAId/pit/:pitId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/pit/:pitId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/pit/:pitId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/openercloser',
        loadChildren: () => import('./openercloser/openercloser.module').then(m => m.OpenercloserModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/pit/:pitId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/pit/:pitId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/OA/:OAId/pit/:pitId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/pit/:pitId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/pit/:pitId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/fctxns',
        loadChildren: () => import('./fillcredits/fctxns.module').then(m => m.FctxnsModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/OA/:OAId/pit/:pitId/chipsecurity',
        loadChildren: () => import('./chip-security/chip-security.module').then(m => m.ChipSecurityModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/OA/:OAId/pit/:pitId/chipsecurity',
        loadChildren: () => import('./chip-security/chip-security.module').then(m => m.ChipSecurityModule)
      },
      {
        path: 'overview/site/:siteId/GA/:GAId/pit/:pitId/chipsecurity',
        loadChildren: () => import('./chip-security/chip-security.module').then(m => m.ChipSecurityModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/GA/:GAId/pit/:pitId/chipsecurity',
        loadChildren: () => import('./chip-security/chip-security.module').then(m => m.ChipSecurityModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/chipsecurity',
        loadChildren: () => import('./chip-security/chip-security.module').then(m => m.ChipSecurityModule)
      },
      {
        path: 'overview/virtualGroup/:vgId/pit/:pitId/chipsecurity',
        loadChildren: () => import('./chip-security/chip-security.module').then(m => m.ChipSecurityModule)
      },

      {
        path: 'overview/virtualGroup/:vgId/:gamingDay',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
      },


      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
