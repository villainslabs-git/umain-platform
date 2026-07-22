/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as SitemapDotxmlRouteImport } from './routes/sitemap[.]xml'
import { Route as RobotsDottxtRouteImport } from './routes/robots[.]txt'
import { Route as LoginRouteImport } from './routes/login'
import { Route as LandingRouteImport } from './routes/landing'
import { Route as IndexRouteImport } from './routes/index'
import { Route as SettingsIndexRouteImport } from './routes/settings/index'
import { Route as SettingsProvidersRouteImport } from './routes/settings/providers'
import { Route as RoyaltiesIndexRouteImport } from './routes/royalties/index'
import { Route as ProfileIndexRouteImport } from './routes/profile/index'
import { Route as LicensesIndexRouteImport } from './routes/licenses/index'
import { Route as LegalIndexRouteImport } from './routes/legal/index'
import { Route as LocksIndexRouteImport } from './routes/locks/index'
import { Route as JobsIndexRouteImport } from './routes/jobs/index'
import { Route as IdentitiesIndexRouteImport } from './routes/identities/index'
import { Route as DashboardIndexRouteImport } from './routes/dashboard/index'
import { Route as ContractsIndexRouteImport } from './routes/contracts/index'
import { Route as CampaignsIndexRouteImport } from './routes/campaigns/index'
import { Route as AuditLogIndexRouteImport } from './routes/audit-log/index'
import { Route as ConsentGateIndexRouteImport } from './routes/consent-gate/index'
import { Route as UsageIndexRouteImport } from './routes/usage/index'
import { Route as DocsIndexRouteImport } from './routes/docs/index'
import { Route as ApprovalTokenRouteImport } from './routes/approval/$token'
import { Route as CastingDashboardRouteImport } from './routes/casting/dashboard'
import { Route as CastingNewTalentRouteImport } from './routes/casting/new-talent'
import { Route as AgencyCatalogRouteImport } from './routes/agency/catalog'
import { Route as AgencyRequestsNewRouteImport } from './routes/agency/requests/new'
import { Route as IdentitiesIdIndexRouteImport } from './routes/identities/$id/index'
import { Route as IdentitiesIdConsentMatrixRouteImport } from './routes/identities/$id/consent-matrix'
import { Route as IdentitiesIdAvatarIndexRouteImport } from './routes/identities/$id/avatar/index'

interface R { id: string; path: string; fullPath: string; preLoaderRoute: any; parentRoute: any }
const Routes = {
  SitemapDotxmlRoute: SitemapDotxmlRouteImport.update({ id: '/sitemap.xml', path: '/sitemap.xml', getParentRoute: () => rootRouteImport }),
  RobotsDottxtRoute: RobotsDottxtRouteImport.update({ id: '/robots.txt', path: '/robots.txt', getParentRoute: () => rootRouteImport }),
  LoginRoute: LoginRouteImport.update({ id: '/login', path: '/login', getParentRoute: () => rootRouteImport }),
  LandingRoute: LandingRouteImport.update({ id: '/landing', path: '/landing', getParentRoute: () => rootRouteImport }),
  IndexRoute: IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport }),
  SettingsIndexRoute: SettingsIndexRouteImport.update({ id: '/settings/', path: '/settings/', getParentRoute: () => rootRouteImport }),
  SettingsProvidersRoute: SettingsProvidersRouteImport.update({ id: '/settings/providers', path: '/settings/providers', getParentRoute: () => rootRouteImport }),
  RoyaltiesIndexRoute: RoyaltiesIndexRouteImport.update({ id: '/royalties/', path: '/royalties/', getParentRoute: () => rootRouteImport }),
  ProfileIndexRoute: ProfileIndexRouteImport.update({ id: '/profile/', path: '/profile/', getParentRoute: () => rootRouteImport }),
  LicensesIndexRoute: LicensesIndexRouteImport.update({ id: '/licenses/', path: '/licenses/', getParentRoute: () => rootRouteImport }),
  LegalIndexRoute: LegalIndexRouteImport.update({ id: '/legal/', path: '/legal/', getParentRoute: () => rootRouteImport }),
  LocksIndexRoute: LocksIndexRouteImport.update({ id: '/locks/', path: '/locks/', getParentRoute: () => rootRouteImport }),
  JobsIndexRoute: JobsIndexRouteImport.update({ id: '/jobs/', path: '/jobs/', getParentRoute: () => rootRouteImport }),
  IdentitiesIndexRoute: IdentitiesIndexRouteImport.update({ id: '/identities/', path: '/identities/', getParentRoute: () => rootRouteImport }),
  DashboardIndexRoute: DashboardIndexRouteImport.update({ id: '/dashboard/', path: '/dashboard/', getParentRoute: () => rootRouteImport }),
  ContractsIndexRoute: ContractsIndexRouteImport.update({ id: '/contracts/', path: '/contracts/', getParentRoute: () => rootRouteImport }),
  CampaignsIndexRoute: CampaignsIndexRouteImport.update({ id: '/campaigns/', path: '/campaigns/', getParentRoute: () => rootRouteImport }),
  AuditLogIndexRoute: AuditLogIndexRouteImport.update({ id: '/audit-log/', path: '/audit-log/', getParentRoute: () => rootRouteImport }),
  ConsentGateIndexRoute: ConsentGateIndexRouteImport.update({ id: '/consent-gate/', path: '/consent-gate/', getParentRoute: () => rootRouteImport }),
  UsageIndexRoute: UsageIndexRouteImport.update({ id: '/usage/', path: '/usage/', getParentRoute: () => rootRouteImport }),
  DocsIndexRoute: DocsIndexRouteImport.update({ id: '/docs/', path: '/docs/', getParentRoute: () => rootRouteImport }),
  ApprovalTokenRoute: ApprovalTokenRouteImport.update({ id: '/approval/$token', path: '/approval/$token', getParentRoute: () => rootRouteImport }),
  CastingDashboardRoute: CastingDashboardRouteImport.update({ id: '/casting/dashboard', path: '/casting/dashboard', getParentRoute: () => rootRouteImport }),
  CastingNewTalentRoute: CastingNewTalentRouteImport.update({ id: '/casting/new-talent', path: '/casting/new-talent', getParentRoute: () => rootRouteImport }),
  AgencyCatalogRoute: AgencyCatalogRouteImport.update({ id: '/agency/catalog', path: '/agency/catalog', getParentRoute: () => rootRouteImport }),
  AgencyRequestsNewRoute: AgencyRequestsNewRouteImport.update({ id: '/agency/requests/new', path: '/agency/requests/new', getParentRoute: () => rootRouteImport }),
  IdentitiesIdIndexRoute: IdentitiesIdIndexRouteImport.update({ id: '/identities/$id/', path: '/identities/$id/', getParentRoute: () => rootRouteImport }),
  IdentitiesIdConsentMatrixRoute: IdentitiesIdConsentMatrixRouteImport.update({ id: '/identities/$id/consent-matrix', path: '/identities/$id/consent-matrix', getParentRoute: () => rootRouteImport }),
  IdentitiesIdAvatarIndexRoute: IdentitiesIdAvatarIndexRouteImport.update({ id: '/identities/$id/avatar/', path: '/identities/$id/avatar/', getParentRoute: () => rootRouteImport }),
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/login': { id: '/login'; path: '/login'; fullPath: '/login'; preLoaderRoute: typeof LoginRouteImport; parentRoute: typeof rootRouteImport }
    '/landing': { id: '/landing'; path: '/landing'; fullPath: '/landing'; preLoaderRoute: typeof LandingRouteImport; parentRoute: typeof rootRouteImport }
    '/settings/': { id: '/settings/'; path: '/settings'; fullPath: '/settings/'; preLoaderRoute: typeof SettingsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/settings/providers': { id: '/settings/providers'; path: '/settings/providers'; fullPath: '/settings/providers'; preLoaderRoute: typeof SettingsProvidersRouteImport; parentRoute: typeof rootRouteImport }
    '/royalties/': { id: '/royalties/'; path: '/royalties'; fullPath: '/royalties/'; preLoaderRoute: typeof RoyaltiesIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/profile/': { id: '/profile/'; path: '/profile'; fullPath: '/profile/'; preLoaderRoute: typeof ProfileIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/licenses/': { id: '/licenses/'; path: '/licenses'; fullPath: '/licenses/'; preLoaderRoute: typeof LicensesIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/legal/': { id: '/legal/'; path: '/legal'; fullPath: '/legal/'; preLoaderRoute: typeof LegalIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/locks/': { id: '/locks/'; path: '/locks'; fullPath: '/locks/'; preLoaderRoute: typeof LocksIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/jobs/': { id: '/jobs/'; path: '/jobs'; fullPath: '/jobs/'; preLoaderRoute: typeof JobsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/identities/': { id: '/identities/'; path: '/identities'; fullPath: '/identities/'; preLoaderRoute: typeof IdentitiesIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/dashboard/': { id: '/dashboard/'; path: '/dashboard'; fullPath: '/dashboard/'; preLoaderRoute: typeof DashboardIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/contracts/': { id: '/contracts/'; path: '/contracts'; fullPath: '/contracts/'; preLoaderRoute: typeof ContractsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/campaigns/': { id: '/campaigns/'; path: '/campaigns'; fullPath: '/campaigns/'; preLoaderRoute: typeof CampaignsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/audit-log/': { id: '/audit-log/'; path: '/audit-log'; fullPath: '/audit-log/'; preLoaderRoute: typeof AuditLogIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/consent-gate/': { id: '/consent-gate/'; path: '/consent-gate'; fullPath: '/consent-gate/'; preLoaderRoute: typeof ConsentGateIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/usage/': { id: '/usage/'; path: '/usage'; fullPath: '/usage/'; preLoaderRoute: typeof UsageIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/docs/': { id: '/docs/'; path: '/docs'; fullPath: '/docs/'; preLoaderRoute: typeof DocsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/approval/$token': { id: '/approval/$token'; path: '/approval/$token'; fullPath: '/approval/$token'; preLoaderRoute: typeof ApprovalTokenRouteImport; parentRoute: typeof rootRouteImport }
    '/casting/dashboard': { id: '/casting/dashboard'; path: '/casting/dashboard'; fullPath: '/casting/dashboard'; preLoaderRoute: typeof CastingDashboardRouteImport; parentRoute: typeof rootRouteImport }
    '/casting/new-talent': { id: '/casting/new-talent'; path: '/casting/new-talent'; fullPath: '/casting/new-talent'; preLoaderRoute: typeof CastingNewTalentRouteImport; parentRoute: typeof rootRouteImport }
    '/agency/catalog': { id: '/agency/catalog'; path: '/agency/catalog'; fullPath: '/agency/catalog'; preLoaderRoute: typeof AgencyCatalogRouteImport; parentRoute: typeof rootRouteImport }
    '/agency/requests/new': { id: '/agency/requests/new'; path: '/agency/requests/new'; fullPath: '/agency/requests/new'; preLoaderRoute: typeof AgencyRequestsNewRouteImport; parentRoute: typeof rootRouteImport }
    '/identities/$id/': { id: '/identities/$id/'; path: '/identities/$id'; fullPath: '/identities/$id/'; preLoaderRoute: typeof IdentitiesIdIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/identities/$id/consent-matrix': { id: '/identities/$id/consent-matrix'; path: '/identities/$id/consent-matrix'; fullPath: '/identities/$id/consent-matrix'; preLoaderRoute: typeof IdentitiesIdConsentMatrixRouteImport; parentRoute: typeof rootRouteImport }
    '/identities/$id/avatar/': { id: '/identities/$id/avatar/'; path: '/identities/$id/avatar'; fullPath: '/identities/$id/avatar/'; preLoaderRoute: typeof IdentitiesIdAvatarIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/sitemap.xml': { id: '/sitemap.xml'; path: '/sitemap.xml'; fullPath: '/sitemap.xml'; preLoaderRoute: typeof SitemapDotxmlRouteImport; parentRoute: typeof rootRouteImport }
    '/robots.txt': { id: '/robots.txt'; path: '/robots.txt'; fullPath: '/robots.txt'; preLoaderRoute: typeof RobotsDottxtRouteImport; parentRoute: typeof rootRouteImport }
  }
}

export const routeTree = rootRouteImport._addFileChildren(Routes)._addFileTypes<any>()
