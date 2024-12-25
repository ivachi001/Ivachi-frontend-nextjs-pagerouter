import {  hierarchyWiseRoles } from "./appDefaults";

export const appRoutes: any = {
    "/admin/dashboard": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-categories": [
        hierarchyWiseRoles.ADMIN
    ], 
    "/admin/manage-products": [
        hierarchyWiseRoles.ADMIN
    ],
    "/admin/manage-users": [
        hierarchyWiseRoles.ADMIN
    ],  
}