import { hierarchyWiseRoles } from "./appDefaults";

export const appRoutes: any = {
    "/admin/dashboard": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-inquiries": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-categories": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-reviews": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-products": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-users": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-customers": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-coupons": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-roles": [
        hierarchyWiseRoles.ADMIN
    ],
}