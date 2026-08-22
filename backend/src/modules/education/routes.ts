import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import EducationController from './controller';

function toControllerRequest(ctx: RouteExecutionContext): ControllerRequest {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, context: { metadata: { timestamp: new Date().toISOString(), version: 'v1' } } };
}
function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown>): RouteHandler { return (context) => handler(context); }
function publicOptions(): RouteOptions { return { mode: 'public', publicRoute: true, privateRoute: false, authenticationRequired: false, authorizationRequired: false, requiredPermissions: [], tags: ['education'], middleware: [] }; }
function privateOptions(permission: Permission): RouteOptions { return { mode: 'private', publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: true, requiredPermissions: [permission], tags: ['education'], middleware: [] }; }

export function createEducationRoutes(controller: EducationController = new EducationController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  const register = (definition: { name: string; method: RouteDefinition['method']; path: string; handler: (ctx: RouteExecutionContext) => Promise<unknown>; options: RouteOptions }) => builder.register({ ...definition, version: 'v1', handler: adapt(definition.handler) });
  register({ name: 'education-articles-list', method: 'GET', path: '/education/articles', handler: (ctx) => controller.listArticles(toControllerRequest(ctx)), options: publicOptions() });
  register({ name: 'education-article-get', method: 'GET', path: '/education/articles/:slug', handler: (ctx) => controller.getArticle(toControllerRequest(ctx)), options: publicOptions() });
  register({ name: 'education-consultation-create', method: 'POST', path: '/education/consultations', handler: (ctx) => controller.createConsultation(toControllerRequest(ctx)), options: publicOptions() });
  register({ name: 'education-ai-review', method: 'POST', path: '/admin/education/review', handler: (ctx) => controller.reviewMedicalGuidance(toControllerRequest(ctx)), options: privateOptions('products:read') });
  register({ name: 'education-families-list', method: 'GET', path: '/admin/education/families', handler: (ctx) => controller.listAdminFamilies(toControllerRequest(ctx)), options: privateOptions('products:read') });
  register({ name: 'education-family-create', method: 'POST', path: '/admin/education/families', handler: (ctx) => controller.createAdminFamily(toControllerRequest(ctx)), options: privateOptions('products:update') });
  register({ name: 'education-family-update', method: 'PUT', path: '/admin/education/families/:id', handler: (ctx) => controller.updateAdminFamily(toControllerRequest(ctx)), options: privateOptions('products:update') });
  register({ name: 'education-family-delete', method: 'DELETE', path: '/admin/education/families/:id', handler: (ctx) => controller.deleteAdminFamily(toControllerRequest(ctx)), options: privateOptions('products:update') });
  register({ name: 'education-articles-admin-list', method: 'GET', path: '/admin/education/articles', handler: (ctx) => controller.listAdminArticles(toControllerRequest(ctx)), options: privateOptions('products:read') });
  register({ name: 'education-article-create', method: 'POST', path: '/admin/education/articles', handler: (ctx) => controller.createAdminArticle(toControllerRequest(ctx)), options: privateOptions('products:update') });
  register({ name: 'education-article-update', method: 'PUT', path: '/admin/education/articles/:id', handler: (ctx) => controller.updateAdminArticle(toControllerRequest(ctx)), options: privateOptions('products:update') });
  register({ name: 'education-article-delete', method: 'DELETE', path: '/admin/education/articles/:id', handler: (ctx) => controller.deleteAdminArticle(toControllerRequest(ctx)), options: privateOptions('products:update') });
  register({ name: 'education-consultations-list', method: 'GET', path: '/admin/education/consultations', handler: (ctx) => controller.listConsultations(toControllerRequest(ctx)), options: privateOptions('customers:read') });
  return builder.build();
}
export default createEducationRoutes;
